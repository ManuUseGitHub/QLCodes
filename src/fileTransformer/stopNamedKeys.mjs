import { onstdin } from "onstdin";

onstdin((input) => {
	console.log(
		input
			.replaceAll(/ use_of_| the_| an_| a_|for_the_|_the|of_the_/gm, "")
			.replaceAll(/there_are_|there_is/gm, "")
			.replaceAll(/in_|is_|are_/gm, "")
			.replaceAll(/on_a_/gm, "")
			.replaceAll(/has_been_/gm, "")
			.replaceAll(/use_of_a_/gm, "")
			.replaceAll(/_use_of_a|_use_of_an/gm, "")
			.replaceAll(/_use_of_|_an_/gm, "_")
	);
});
