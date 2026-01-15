import { onstdin } from "onstdin";

onstdin((input) => {
	console.log(
		input
			.replace(/.+[\r\n]/, "")
	);
});
