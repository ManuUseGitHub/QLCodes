import fs from "fs";
import { onstdin } from "onstdin";
import { reargv } from "reargv";

const isDebug = process.env.DEBUG === "true";
const argv = reargv();

if (argv.options.file || argv.files.length) {
	const file = argv.options.file || argv.files[0];

	onstdin((content) => {
		fs.writeFile(
			file,
			JSON.stringify(JSON.parse(content), null, isDebug ? 2 : undefined),
			(_) => {}
		);
	});
}
