import { readFileSync } from "fs";

const data = JSON.parse(readFileSync("./qlCodes.json"));

export const lens = (code) => {
	let response = {
		code,
		qlcs: "",
		matches: [],
	};

	try {
		// ---- validation ----
		if (
			code === "" ||
			(!code && code !== "0") ||
			!/^[A-Z0-9]{5}$/.test(`${code}`.padStart(5, "0"))
		) {
			throw "qlcodes_malformed";
		}

		const paddedCode = `${code}`.padStart(5, "0");

		// ---- find matching class ----
		const classEntry = Object.entries(data).find(([id]) =>
			paddedCode.startsWith(id)
		);

		const classesToSearch = [];

		if (classEntry) {
			classesToSearch.push({
				id: classEntry[0],
				data: classEntry[1],
			});
		}

		// Always include NA as fallback / collision source
		if (data["NA"]) {
			classesToSearch.push({
				id: "NA",
				data: data["NA"],
			});
		}

		// ---- collect all matches ----
		for (const cls of classesToSearch) {
			const hits = cls.data.messageSet.filter(
				(x) => x.code === paddedCode || x.code === code
			);

			for (const hit of hits) {
				response.matches.push({
					...hit,
					class: `${cls.id} - ${cls.data.label}`,
				});
			}
		}

		if (response.matches.length === 0) {
			throw "qlcodes_no_code_found";
		}

		response.qlcs = "qlcodes_success";
	} catch (err) {
		response.qlcs = typeof err === "string" ? err : "qlcodes_unexpected_error";
	}

	return response;
};
