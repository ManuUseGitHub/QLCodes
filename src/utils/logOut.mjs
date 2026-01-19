import path from "path";
import { DEBUG_PATH } from "../constants.mjs";
import { reargv } from "reargv";
import fs from "fs"

const { options, files } = reargv();
const file = options.file || files[0];
const isDebug = process.env.DEBUG;
export const debugInFile = (data) => {
	if (isDebug) {
		const fileName = file.replaceAll("../", "");
		try {
			fs.writeFileSync(
				path.join("./", DEBUG_PATH, path.basename(fileName + ".debug.json")),
				data
			);
		} catch {
			fs.writeFileSync(
				path.join("./", DEBUG_PATH, path.basename(fileName + ".debug.json")),
				JSON.stringify(`${data}`)
			);
		}
	}
};
