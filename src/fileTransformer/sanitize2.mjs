import { insertHeadersAndFormat } from "../utils/codeName.mjs";
import { onstdin } from "onstdin";

onstdin((input) => {
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
