export const reargv = () => {
	const args = process.argv.slice(2);
	const argvs = { misc: [], options: {}, files: [] };
	const len = args.length;
	let jump = 0;
	for (const [i, arg] of args.entries()) {
		if (jump) {
			jump--;
			continue;
		}
		if (arg.startsWith("--")) {
            const option = arg.replace(/^-+/g, "");
			if (i + 1 < len) {
				const nextArg = args[i + 1];
				if (!nextArg.startsWith("--")) {
					argvs.options[option] = args[i + 1];
					jump++;
				} else {
					argvs.options[option] = true;
					jump++;
				}
			} else {
				argvs.options[option] = true;
			}
		} else if (/(\.(?:[a-zA-Z]+)+)$/.test(arg)) {
			argvs.files.push(arg);
		} else {
			argvs.misc.push(arg);
		}
	}
	return argvs;
};
