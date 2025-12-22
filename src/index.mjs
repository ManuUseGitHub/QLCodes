import data from "../qlCodes.json" with { type : "json" };
export const lens = (code) => {
	let error = {
		code: "-1",
		keys: [],
		use: [],
		reason: `The code '${code}' does not match any entries in qlcodes. This may be a qlcode issue only to provide you with the correct information`,
	};
	try {
		if (
			code == "" ||
			(!code && code != "0") ||
			!/[A-Z0-9]{5}/.test(`${code}`.padStart(5, "0"))
		)
			throw "qlcodes_malformed";
		const paddedCode = `${code}`.padStart(5, "0");
		const search = Object.entries(data).find(([id]) =>
			new RegExp(`^${id}`).test(paddedCode)
		);
		if (!search) {
			throw "qlcodes_no_class_found";
		}
		const [_, foundClass] = search;
		if (foundClass)
			error = foundClass.errorSet.find((x) => (x.code = paddedCode));
		else throw "qlcodes_no_code_found";
	} catch (err) {
		error.keys = [typeof err == "string" ? err : "qlcodes_unexpected_error"];
	}
	return error;
};
