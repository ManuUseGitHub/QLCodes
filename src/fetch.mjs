import {
	G_SPANNERoptions,
	IBMoptions,
	MARIAoptions,
	ORACLEoptions,
	SAP_HANAoptions,
	POSTGRESoptions,
} from "./constants.mjs";
import { logOnFulfill } from "./logQueue.mjs";
import { fetchSource } from "./sourceFetcher.mjs";

logOnFulfill(
	"ALL Using CSV files",
	new Promise((resolve) => resolve(null))
);
const settled = Promise.allSettled([
	logOnFulfill("SAP Hanna", fetchSource(SAP_HANAoptions)),
	logOnFulfill("Google Spanner", fetchSource(G_SPANNERoptions)),
	logOnFulfill("IBM", fetchSource(IBMoptions)),
	logOnFulfill("MARIA DB", fetchSource(MARIAoptions)),
	logOnFulfill("ORACLE", fetchSource(ORACLEoptions)),
	logOnFulfill("POSTGRES", fetchSource(POSTGRESoptions)),
]);

await logOnFulfill("ALL All files have been treated", settled);
