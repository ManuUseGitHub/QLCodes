import fs from "fs";
import { onstdin } from "onstdin";
import { ERROR_CODE_HEADER_RGX } from "./regex.mjs";
import { reargv } from "reargv";
import { parse } from "csv-parse/sync";
import { transform as toSanitizedStopName } from "./fileTransformer/strSanitizeStopName.mjs";
import toSnakeCase from "to-snake-case";
import { debugInFile } from "./utils/logOut.mjs";

const isDebug = process.env.DEBUG;
const { options, files } = reargv();
const { flags } = options;
const selectClass = (states, classMatch) => {
	const { classCode, label } = classMatch.groups;

	return (states[classCode] = states[classCode]
		? states[classCode]
		: {
				label,
				messageSet: [],
		  });
};
const appendUsages = (currentCode, foundCode, use) => {
	if (foundCode) {
		currentCode.use = [...foundCode.use, ...use];
	}
};
const appendKeys = (currentCode, record) => {
	let { Key: key } = record;
	if (key && !currentCode.keys.includes(key)) {
		currentCode.keys.push(key);
	} else if (record.Description) {
		currentCode.keys.push(toSanitizedStopName(toSnakeCase(record.Description)));
	}
};
const appendReason = (currentCode, record) => {
	let { Description } = record;
	if (record.Description) {
		currentCode.reasons.push(Description);
	}
};
const registerCodeEntry = (record, currentClass) => {
	let { Code: code } = record;

	const foundCode = currentClass.messageSet.find((x) => x.code == code);
	const use = flags.split(":").filter((x) => x);

	let codeEntry = foundCode || {
		code,
		keys: [],
		reasons: [],
		use,
	};

	appendKeys(codeEntry, record);
	appendReason(codeEntry, record);
	appendUsages(codeEntry, foundCode, use);

	return { codeEntry, isNew: !foundCode };
};
const apply = (text, states = {}) => {
	const records = parse(text, {
		columns: true,
		skip_empty_lines: true,
		delimiter: ";",
	});

	let currentClass;
	records.forEach((record) => {
		const classMatch = ERROR_CODE_HEADER_RGX.exec(record.Code);

		if (classMatch) {
			currentClass = selectClass(states, classMatch);
		} else {
			const { codeEntry, isNew } = registerCodeEntry(record, currentClass);

			if (isNew) {
				currentClass.messageSet.push(codeEntry);
			}
		}
	});

	return states;
};

if (options.file || files.length) {
	const file = options.file || files[0];

	onstdin((content) => {
		let states;
		try {
			states = JSON.parse(content ? content : "{}");
		} catch {
			states = {};
		}
		debugInFile(JSON.stringify(states, null, isDebug ? 2 : 0));
		console.log(
			JSON.stringify(apply(fs.readFileSync(file, "utf-8"), states), null, 2)
		);
	});
}
