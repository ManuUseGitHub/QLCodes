import fs from "fs";
import { reargv } from "./utils/args.mjs";
import { onStdIn } from "./utils/io.mjs";

const isDebug = process.env.DEBUG === "true";
const argv = reargv();

if (argv.options.file || argv.files.length) {
	const file = argv.options.file || argv.files[0];

	onStdIn((content) => {
		fs.writeFile(
			file,
			JSON.stringify(JSON.parse(content), null, isDebug ? 2 : undefined),
			(_) => {}
		);
	});
}
