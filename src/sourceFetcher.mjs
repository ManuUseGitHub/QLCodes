import { selectElements } from "@maze014/dom-fetch";
import { readFileSync, writeFileSync } from "fs"
import { printCsvFromHtml } from "./csvBuilder.mjs";

export const fetchSource = async (options,encoding="utf-8") => {
	try {
		// fetch the existing CSV file so we keep from spaming the documentation page
		readFileSync(options.source.csvFile,{encoding});
	} catch (err) {
		try {
			const html = readFileSync(options.source.htmlFile, { encoding });
			const csv = await printCsvFromHtml(html, options);
			writeFileSync(options.source.csvFile, csv);
		} catch (err) {
			await selectElements(options.source.tableUrl, options.tableSelector, {
				source: options.sourceKind,
                encoding
			}).then(async (data) => {
				const html = data.join("");

				// save a sub html of the maria db page containing
				// the tables to not spam the maria db page next time we fetch
				writeFileSync(options.source.htmlFile, html);

				// create the CSV useful for the rest of the data pipeline
				const csv = await printCsvFromHtml(html, options);

				writeFileSync(options.source.csvFile, csv);
			});
		}
	}
};
