import fs from "fs";
import { onStdIn } from "./utils/io.mjs";
import { CODE_RE, CLASS_RE, COMMENT_RE } from "./regex.mjs";
import { reargv } from "./utils/args.mjs";
const argv = reargv();
function flushBuffer(buffer, currentClass, currentCode) {
	if (!buffer.length) return buffer;

	const reason = buffer.join("\n").trim();
	if (currentCode && !/(\w+_)+/.test(reason)) {
		currentCode.reason = reason;
	} else if (currentClass && !/(\w+_)+/.test(reason)) {
		currentClass.reason = reason;
	}
	return [];
}

const apply = (text, errors = {}) => {
	let buffer = [];
	let currentClass = null;
	let currentCode = null;

	for (const rawLine of text.split(/\r?\n/)) {
		const line = rawLine.trimEnd();

		// Ignore comment lines entirely
		if (COMMENT_RE.test(line)) {
			continue;
		}

		// Class line
		const classMatch = line.match(CLASS_RE);
		if (classMatch) {
			buffer = flushBuffer(buffer, currentClass, currentCode);

			const { classCode, label } = classMatch.groups;

			currentClass = errors[classCode]
				? errors[classCode]
				: {
						label,
						errorSet: [],
				  };
			errors[classCode] = currentClass;
			currentCode = null;
			continue;
		}

		// Error code line
		const codeMatch = line.match(CODE_RE);
		if (codeMatch) {
			buffer = flushBuffer(buffer, currentClass, currentCode);

			let { code, key, flags } = codeMatch.groups;
			const foundCode = currentClass.errorSet.find((x) => x.code == code);
			const use = flags.split(":").filter((x) => x);

			key = key.substring(1);
			currentCode = foundCode || {
				code,
				keys: [],
				use,
			};

			if (key != "_" && !currentCode.keys.includes(key)) {
				currentCode.keys.push(key);
			}
			if (foundCode) {
				currentCode.use = [...foundCode.use, ...use];
			}
			if (!foundCode) {
				currentClass.errorSet.push(currentCode);
			}
			continue;
		}

		// reason line (non-empty, non-comment)
		if (line !== "") {
			buffer.push(line);
		}
	}

	// Flush trailing reason
	buffer = flushBuffer(buffer, currentClass, currentCode);
	return errors;
};

const debugInFile = (file, data = null) => {
	const isDebug = process.env.DEBUG;
	if (isDebug) {
		const fileName = file.replaceAll("../", "");
		fs.writeFileSync(fileName + ".debug.json", data);
	}
};
if (argv.options.file || argv.files.length) {
	const file = argv.options.file || argv.files[0];

	onStdIn((content) => {
		const isDebug = process.env.DEBUG;
		let errors;
		try {
			errors = JSON.parse(content ? content : "{}");
		} catch {
			errors = {};
		}

		debugInFile(file, JSON.stringify(errors, null, isDebug ? 2 : 0));

		console.log(
			JSON.stringify(apply(fs.readFileSync(file, "utf8"), errors), null, 2)
		);
	});
}
