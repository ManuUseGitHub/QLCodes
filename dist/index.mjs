import data from "./qlCodes.json" with {type : "json"}

const keyRegex = /^[a-zA-Z0-9_]+$/;
const codeRegex = /^[A-Z0-9]{5}$/;

const NON_ASSOCIATED_CLASS = "NA";

const QLCODES_ERR_MALFORMED = "qlcodes_malformed"
const QLCODES_ERR_NOT_FOUND = "qlcodes_no_code_found"
const QLCODES_ERR_UNEXPECTED_ERR = "qlcodes_unexpected_error"

const QLCODES_SUCCESS = "qlcodes_success"

const _validateSearch = (search, response) => {
	if (
		search === "" ||
		(!search && search !== "0") ||
		(!codeRegex.test(`${search}`.padStart(5, "0")) &&
			!keyRegex.test(`${search}`))
	) {
		throw QLCODES_ERR_MALFORMED;
	} else if (codeRegex.test(`${search}`)) {
		response.code = search;
	} else {
		response.key = search;
	}
};

const _getHitKeyOrCode = (cls, response, paddedSearch) => {
	if (!response.key && !response.code) {
		return [];
	}
	const matchingInKeys = (x) => x.keys.find((k) => paddedSearch === k);
	const matchingCode = (x) =>
		x.code === paddedSearch || x.code === paddedSearch;

	return cls.data.messageSet.filter(
		response.key ? matchingInKeys : matchingCode
	);
};

const _collectAllMatches = (classesToSearch, response, paddedSearch) => {
	const matches = [];
	for (const cls of classesToSearch) {
		for (const hit of _getHitKeyOrCode(cls, response, paddedSearch)) {
			matches.push({
				...hit,
				class: `${cls.id} - ${cls.data.label}`,
			});
		}
	}
	return matches;
};

const _classesForCodeSearch = (entries, paddedSearch) => {
	const classesToSearch = [];
	const classEntry = entries.find(([id]) => paddedSearch.startsWith(id));
	if (classEntry) {
		classesToSearch.push({
			id: classEntry[0],
			data: classEntry[1],
		});
	}
	// Always include NA as fallback / collision source
	if (data[NON_ASSOCIATED_CLASS]) {
		classesToSearch.push({
			id: NON_ASSOCIATED_CLASS,
			data: data[NON_ASSOCIATED_CLASS],
		});
	}
};

const _classesForKeySearche = (entries) => {
	const classesToSearch = [];
	entries.forEach(([id]) => {
		classesToSearch.push({
			id,
			data: data[id],
		});
	});
	return classesToSearch;
};

export const lens = (search) => {
	let response = {
		code: undefined,
		key: undefined,
		qlcs: "",
		matches: [],
	};

	try {
		_validateSearch(search, response);

		const paddedSearch = `${search}`.padStart(5, "0");
		const classes = Object.entries(data);

		const classesToSearch = response.code
			? _classesForCodeSearch(classes, paddedSearch)
			: response.key
			? _classesForKeySearche(classes)
			: [];

		response.matches = _collectAllMatches(
			classesToSearch,
			response,
			paddedSearch
		);

		if (response.matches.length === 0) {
			throw QLCODES_ERR_NOT_FOUND;
		}

		response.qlcs = QLCODES_SUCCESS;
	} catch (err) {
		response.qlcs = typeof err === "string" ? err : QLCODES_ERR_UNEXPECTED_ERR;
	}

	return response;
};
