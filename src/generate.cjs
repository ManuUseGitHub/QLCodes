const fs = require("fs");
const { ERROR_CODE_HEADER_RGX } = require("./regex.mjs");
const { newCode } = require("./utils/codeName.mjs");
const { onstdin } = require("onstdin");
const { reargv } = require("reargv");

const argv = reargv();

const processCSVLines = (fileCSVText) => {
	let output = [];
	let currentClassCode = null;
	for (const line of fileCSVText.split(/\r?\n/)) {
		if (!line.trim()) continue;

		const [code] = line.split(";", 2);

		let match;
		if ((match = ERROR_CODE_HEADER_RGX.exec(code))) {
			let { label, class_code } = match.groups;

			label = label.replace(/^Unqualified\s+/i, "");
			output.push("", `Class ${class_code} — ${label}`);

			currentClassCode = class_code;
			continue;
		}

		if (!currentClassCode) continue;

		output.push(...newCode(line, currentClassCode));
	}
	return output.join("\n");
};

if (argv.options.file || argv.files.length) {
	const file = argv.options.file || argv.files[0];
	console.log(processCSVLines(fs.readFileSync(file, "utf8")));
} else {
	onstdin((csv) => {
		console.log(processCSVLines(csv));
	});
}
