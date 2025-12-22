import { onStdIn } from "../utils/io.mjs";

onStdIn((input) => {
	console.log(
		input
			.replaceAll("SQLSTATE Value;Meaning", "")
			.replaceAll(`"""`, "")
			.replace(/;[^;\n]*$/gm, "")
	);
});
