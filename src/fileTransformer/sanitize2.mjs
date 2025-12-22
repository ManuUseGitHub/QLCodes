import { insertHeadersAndFormat } from "../utils/codeName.mjs";
import { onStdIn } from "../utils/io.mjs";

onStdIn((input) => {
	console.log(
		insertHeadersAndFormat(
			input
				.replaceAll(/\n/gm, "\\")
				.replaceAll(/;".+"/gm, "")
				.replaceAll(/(?:;+$)/gm, "")
				.replaceAll(`"`, "")
				.replaceAll("\\", "\n")
				.replaceAll("\r", "")
				.trim()
		)
	);
});
