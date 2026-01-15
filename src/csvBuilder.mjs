import { selectElements } from "@maze014/dom-fetch";
import { withSetValues } from "./utils/common.mjs";
import { createHeaderDescriptions } from "./csvHeaderDescriptor.mjs";
import { ERROR_CODE_HEADER_RGX } from "./regex.mjs";
import { QLC_MARKER } from "./constants.mjs";

const _selectFirstHeaders = (headers, columnSize) => {
	return headers.slice(0, columnSize).map((e) => e.text);
};

const _createCodeClassCsvLine = (classString, columnSize) => {
	if (classString)
		return [classString, ...Array(columnSize - 1).map((_) => "")].join(";");
};

const _collectHeaders = (html, fetchOptions) => {
	const { headerSelector } = fetchOptions;
	return selectElements(html, headerSelector, {
		source: "string",
		output: "breakdown",
	});
};

const _collectCells = (html, fetchOptions) => {
	const { cellSelector } = fetchOptions;
	return selectElements(html, cellSelector, {
		source: "string",
		output: "breakdown",
	});
};

const _initLinesOfCsv = async (html, fetchOptions) => {
	const headers = await _collectHeaders(html, fetchOptions);
	const { defaultHeader } = fetchOptions;

	const firstHeaders = _selectFirstHeaders(headers, fetchOptions.columnSize);
	const descriptors = createHeaderDescriptions(
		firstHeaders,
		fetchOptions.headers
	);

	fetchOptions.headers = descriptors;

	return withSetValues([
		// 1. the column headers
		descriptors.headers.join(";"),

		// 2. the "Table 1. NA class code" for the next steps of the pipeline
		_createCodeClassCsvLine(defaultHeader, descriptors.headers.length),
	]);
};

const _pushNextCellInTheLine = (line, text, order) => {
	line.push({
		text: !/^\"$/.test(text) ? text : "",
		order,
	});
};

const _pushListLines = async (e, lines) => {
	if (/<(?:ol|ul)>/i.test(e.html)) {
		const m =
			/(?<intro>[\s\S]*?)(?<list><(?:ol|ul)[\s\S]*?<\/(?:ol|ul)>)/i.exec(
				e.html
			);

		if (m) {
			const text = m.groups.intro;

			const items = await selectElements(m.groups.list, "li", {
				source: "string",
				output: "breakdown",
			});

			items.forEach((item) =>
				lines.push([QLC_MARKER, item.text, "", ""].join(";"))
			);
			return text;
		}
	}
};
const _pushLinesOneByOne = async (fetchOptions, data, lines) => {
	const { columnSize } = fetchOptions;

	const finalHeadersCount = fetchOptions.headers.headers.length;
	const headerOrder = fetchOptions.headers.order;

	let line = [];
	let col = 0;
	let i = 0;
	function flush() {
		if (finalHeadersCount > columnSize) {
			const diff = finalHeadersCount - columnSize;
			for (let i = 0; i < diff; ++i) {
				line.push({ text: `""`, order: headerOrder[columnSize + i] });
			}
		}

		line = line.sort((a, b) => a.order - b.order);
		if (fetchOptions.gneric && line[0].text == `""`) {
			line[0].text = i++;
		}
		
		lines.push(line.map((c) => c.text).join(";"));
		line = [];
		col = 0;
	}
	for (const e of data) {
		const index = fetchOptions.headers.order[col];
		const quoted = fetchOptions.headers.quoted[index];
		let text = quoted ? `"${e.text}"` : e.text;

		const intro = await _pushListLines(e, lines);
		if (intro) {
			text = intro;
		}

		if (ERROR_CODE_HEADER_RGX.test(text)) {
			if (line.length) {
				flush();
			}
			lines.push(_createCodeClassCsvLine(text, finalHeadersCount));
			continue;
		}

		const order = fetchOptions.headers.order[col];
		_pushNextCellInTheLine(line, text, order);

		if (++col === columnSize) {
			flush();
		}
	}

	return line;
};

const _printSanitizedLines = (lines) => {
	const output = lines
		.join("\n")
		.replaceAll(/\n\t+/gm, " ")
		.replaceAll(/\t+/gm, " ")
		.replaceAll(/; /gm, ". ");
	//console.log(output);
	return output;
};

const _pushLastLine = (lines, line) => {
	// Push remaining cells if any
	if (line.length > 0) {
		lines.push(line.join(";"));
	}
};

export const printCsvFromHtml = async (html, fetchOptions) => {
	const printed = await _collectCells(html, fetchOptions).then(async (data) => {
		const lines = await _initLinesOfCsv(html, fetchOptions);
		const lastLine = await _pushLinesOneByOne(fetchOptions, data, lines);

		let sortedline = lastLine.sort((a, b) => a.order - b.order);
		sortedline = lastLine.map((c) => c.text).join(";");

		_pushLastLine(lines, sortedline);
		return _printSanitizedLines(normalizeListBlocks(lines));
	});
	return printed;
};

const normalizeListBlocks = (lines) => {
	const result = [];
	let listBuffer = [];

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];

		if (line.startsWith(QLC_MARKER)) {
			// collect list items (marker removed later)
			listBuffer.push(line);
			continue;
		}

		// if we hit a code line AND we have a pending list
		if (listBuffer.length && /^\d{5};/.test(line)) {
			// push code line first
			result.push(line);

			// then push list items (marker stripped)
			listBuffer.forEach((li) => result.push(li.replace(QLC_MARKER, "")));

			listBuffer = [];
			continue;
		}

		// normal line
		result.push(line);
	}

	// flush any remaining list items
	listBuffer.forEach((li) => result.push(li.replace(QLC_MARKER, "")));

	return result;
};
