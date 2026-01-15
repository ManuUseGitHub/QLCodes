const applyHeaderParameters = (descriptor, index, quotesFlags) => {
	const m = /\[(?<parameters>.+)\]/.exec(descriptor);
	if (m) {
		const startParametersIndex = descriptor.indexOf("[");
		descriptor = descriptor.substring(0, startParametersIndex);

		const { parameters } = m.groups;
		const p = /([^,]+),?/gm;
		let result;

		while ((result = p.exec(parameters)) !== null && result[1]) {
			const parameter = result[1];

			if (parameter.startsWith("as:")) {
				const start = parameter.indexOf(":");
				descriptor = parameter.substring(start + 1);
			}
			if (parameter == "quoted") quotesFlags[index] = true;
		}
	}

	return descriptor;
};

const matchingString = (read, rearanged, e) => {
	let m = /^([^\[]+)/.exec(e);

	if (m && read.find((e) => e == m[1])) {
		const result = rearanged.find((x) => {
			m = /^([^\[]+)/.exec(x);
			return e == m[1];
		});
		return result;
	}
};

const prepareHeaders = (read, headers) => {
	const rearanged = headers.descriptors;
	const union = [
		...new Set([...read, ...rearanged.filter((x) => !/:/.test(x))]),
	];
	const rawUnion = [...new Set([...rearanged])];
	const resultHeaders = [...union];
	const size = union.length;
	const quotesFlags = [...new Array(size)].map((_) => false);

	return { rearanged, union, rawUnion, resultHeaders, size, quotesFlags };
};

export const createHeaderDescriptions = (read, headers) => {
	const { rearanged, union, rawUnion, resultHeaders, size, quotesFlags } =
		prepareHeaders(read, headers);

	let order = [];

	union.forEach((e, i) => {
		const index = rearanged.indexOf(matchingString(read, rearanged, e));
		resultHeaders[i] = applyHeaderParameters(rawUnion[i], i, quotesFlags);
		if (index != -1) {
			order.push(index);
		}
	});

	order.push(
		...[...new Array(size)].map((_, i) => i).filter((x) => !order.includes(x))
	);

	return { headers: resultHeaders, order, quoted: quotesFlags };
};
