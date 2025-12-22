export const onStdIn = (cb) => {
	let input = "";
	process.stdin.setEncoding("utf8");
	process.stdin.on("data", (chunk) => {
		input += chunk;
	});

	process.stdin.on("end", () => {
		cb(input);
	});
};
