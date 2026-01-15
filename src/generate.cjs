const fs = require("fs");
const { ERROR_CODE_HEADER_RGX } = require("./regex.mjs");
const { newCode } = require("./utils/codeName.mjs");
const { onstdin } = require("onstdin");
const { reargv } = require("reargv");

const argv = reargv();

const pushHeader = (lines, groups) => {
	let { label, class_code } = groups;

	label = label.replace(/^Unqualified\s+/i, "");
	lines.push("", `Class ${class_code} — ${label}`);
	return class_code;
};

const getActualClassHeader = (lines, code) => {
	let match;
	let matchedClassCode;
	if ((match = ERROR_CODE_HEADER_RGX.exec(code))) {
		matchedClassCode = pushHeader(lines, match.groups);
	}
	return matchedClassCode;
};

const processCSVLines = (fileCSVText) => {
	let lines = [];
	let currentClassCode = null;
	for (const line of fileCSVText.split(/\r?\n/)) {
		if (!line.trim()) continue;

		const [code] = line.split(";", 2);

		let changedClass = getActualClassHeader(lines, code);
		if (changedClass) {
			currentClassCode = changedClass;
			continue;
		}

		if (!currentClassCode) continue;

		lines.push(...newCode(line, currentClassCode));
	}
	return lines.join("\n");
};

if (argv.options.file || argv.files.length) {
	const file = argv.options.file || argv.files[0];
	console.log(processCSVLines(fs.readFileSync(file, "utf8")));
} else {
	onstdin((csv) => {
		console.log(processCSVLines(csv));
	});
}
