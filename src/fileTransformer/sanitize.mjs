import { onstdin } from "onstdin";

onstdin((input) => {
	console.log(
		input
			.replaceAll("SQLSTATE Value;Meaning", "")
			.replaceAll(`"""`, "")
			.replace(/;[^;\n]*$/gm, "")
	);
});
