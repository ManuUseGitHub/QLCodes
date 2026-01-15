import data from "../headers.config.json" with { type : "json" }

const CSV_BASE_PATH = "./ressources/CSV/"
const HTML_BASE_PATH = "./ressources/HTML/"

// MARIA DB ==================================================================
export const MARIA_HTML_PAGE_URL =
	"https://mariadb.com/docs/server/reference/error-codes/mariadb-error-code-reference";
export const MARIA_TABLE_PATH = HTML_BASE_PATH + "mariaTables.html";
export const MARIA_CSV_PATH = CSV_BASE_PATH + "MARIA_DB_codes2.csv";
export const MARIA_DB_COLUMN_SIZE = 4;

export const ROLE_TABLE_SELECTOR = "div[role='table']";
export const ROLE_COLUMN_HEADER_SELECTOR = "div[role='columnheader']";
export const ROLE_CELL_SELECTOR = "div[role='cell']";

// IBM ======================================================================
export const IBM_HTML_STATES_REF_URL =
	"https://www.ibm.com/docs/en/i/7.6.0?topic=codes-listing-sqlstate-values#cc__classcode00";
export const IBM_TABLE_PATH = HTML_BASE_PATH + "ibmTables.html";
export const IBM_CSV_PATH = CSV_BASE_PATH + "IBM_states2.csv";
export const IBM_DB_COLUMN_SIZE = 3;

export const IBM_TABLE_SELECTOR = "[role='main'] table";
export const IBM_TABLE_TAb_H_SELECTOR = "th";
export const IBM_TABLE_CELL_SELECTOR = "td";
export const IBM_TABLE_CAPTION_SELECTOR = "caption";

// POSTGRES ======================================================================
export const POSTGRES_HTML_STATES_REF_URL =
	"https://www.postgresql.org/docs/current/errcodes-appendix.html";
export const POSTGRES_TABLE_PATH = HTML_BASE_PATH + "postgresTables.html";
export const POSTGRES_CSV_PATH = CSV_BASE_PATH + "POSTGRES_states2.csv";
export const POSTGRES_DB_COLUMN_SIZE = 2;

export const POSTGRES_TABLE_SELECTOR = "#ERRCODES-TABLE table";
export const POSTGRES_TABLE_TAb_H_SELECTOR = "th";
export const POSTGRES_TABLE_CELL_SELECTOR = "td";

// Oracle ======================================================================
export const ORACLE_HTML_STATES_REF_URL =
	"https://docs.oracle.com/cd/E15817_01/appdev.111/b31228/appd.htm";
export const ORACLE_TABLE_PATH = HTML_BASE_PATH + "oracleTables.html";
export const ORACLE_CSV_PATH = CSV_BASE_PATH + "oracle_states.csv";
export const ORACLE_DB_COLUMN_SIZE = 3;

export const ORACLE_TABLE_SELECTOR = "table[class='Informal']";
export const ORACLE_TABLE_TAb_H_SELECTOR = "th";
export const ORACLE_TABLE_CELL_SELECTOR = "td";

// SAP Hana ======================================================================
export const SAP_HANA_HTML_STATES_REF_URL =
	"https://help.sap.com/docs/SAP_HANA_PLATFORM/4fe29514fd584807ac9f2a04f6754767/20a78d3275191014b41bae7c4a46d835.html";
export const SAP_HANA_TABLE_PATH = HTML_BASE_PATH + "sapHanaTables.html";
export const SAP_HANA_CSV_PATH = CSV_BASE_PATH + "sap_hana_states.csv";
export const SAP_HANA_DB_COLUMN_SIZE = 3;

export const SAP_HANA_TABLE_SELECTOR = "table";
export const SAP_HANA_TABLE_TAb_H_SELECTOR = "th";
export const SAP_HANA_TABLE_CELL_SELECTOR = "td";

// Google Spanner ======================================================================
export const G_SPANNER_HTML_STATES_REF_URL =
	"https://docs.cloud.google.com/spanner/docs/error-codes";
export const G_SPANNER_TABLE_PATH = HTML_BASE_PATH + "gSpannerTables.html";
export const G_SPANNER_CSV_PATH = CSV_BASE_PATH + "gSpanner_states.csv";
export const G_SPANNER_DB_COLUMN_SIZE = 3;

export const G_SPANNER_TABLE_SELECTOR = "#error-codes + p + div table";
export const G_SPANNER_TABLE_TAb_H_SELECTOR = "th";
export const G_SPANNER_TABLE_CELL_SELECTOR = "td";

// MISC ======================================================================

export const NON_ASSCIABLE_CLASS_CODE_HEADER =
	"Table 1. Class Code NA: Non associable class codes";

export const QLC_MARKER = "[_QLC_LI_]";

// OPTIONS ===================================================================

export const IBMoptions = {
	source: {
		tableUrl: IBM_HTML_STATES_REF_URL,
		htmlFile: IBM_TABLE_PATH,
		csvFile: IBM_CSV_PATH,
	},
	headers: {
		descriptors: data.ibm,
	},
	localFileTableSelector: "table",
	columnSize: IBM_DB_COLUMN_SIZE,
	tableSelector: IBM_TABLE_SELECTOR,
	headerSelector: IBM_TABLE_TAb_H_SELECTOR,
	cellSelector: IBM_TABLE_CAPTION_SELECTOR + ", " + IBM_TABLE_CELL_SELECTOR,
	sourceKind: "headless",
};

export const MARIAoptions = {
	source: {
		tableUrl: MARIA_HTML_PAGE_URL,
		htmlFile: MARIA_TABLE_PATH,
		csvFile: MARIA_CSV_PATH,
	},
	headers: {
		descriptors: data.mariaDb,
	},
	localFileTableSelector: "table",
	columnSize: MARIA_DB_COLUMN_SIZE,
	defaultHeader: NON_ASSCIABLE_CLASS_CODE_HEADER,
	tableSelector: ROLE_TABLE_SELECTOR,
	headerSelector: ROLE_COLUMN_HEADER_SELECTOR,
	cellSelector: ROLE_CELL_SELECTOR,
};

export const ORACLEoptions = {
	source: {
		tableUrl: ORACLE_HTML_STATES_REF_URL,
		htmlFile: ORACLE_TABLE_PATH,
		csvFile: ORACLE_CSV_PATH,
	},
	headers: {
		descriptors: data.oracle,
	},
	localFileTableSelector: "table",
	columnSize: ORACLE_DB_COLUMN_SIZE,
	defaultHeader: NON_ASSCIABLE_CLASS_CODE_HEADER,
	tableSelector: ORACLE_TABLE_SELECTOR,
	headerSelector: ORACLE_TABLE_TAb_H_SELECTOR,
	cellSelector: ORACLE_TABLE_CELL_SELECTOR,
};

export const G_SPANNERoptions = {
	source: {
		tableUrl: G_SPANNER_HTML_STATES_REF_URL,
		htmlFile: G_SPANNER_TABLE_PATH,
		csvFile: G_SPANNER_CSV_PATH,
	},
	headers: {
		descriptors: data.googleSpanner,
	},
	localFileTableSelector: "table",
	columnSize: G_SPANNER_DB_COLUMN_SIZE,
	defaultHeader: NON_ASSCIABLE_CLASS_CODE_HEADER,
	tableSelector: G_SPANNER_TABLE_SELECTOR,
	headerSelector: G_SPANNER_TABLE_TAb_H_SELECTOR,
	cellSelector: G_SPANNER_TABLE_CELL_SELECTOR,
	sourceKind: "headless",
	gneric: true,
};

export const SAP_HANAoptions = {
	source: {
		tableUrl: SAP_HANA_HTML_STATES_REF_URL,
		htmlFile: SAP_HANA_TABLE_PATH,
		csvFile: SAP_HANA_CSV_PATH,
	},
	headers: {
		descriptors: data.sapHanna,
	},
	localFileTableSelector: "table",
	columnSize: SAP_HANA_DB_COLUMN_SIZE,
	defaultHeader: NON_ASSCIABLE_CLASS_CODE_HEADER,
	tableSelector: SAP_HANA_TABLE_SELECTOR,
	headerSelector: SAP_HANA_TABLE_TAb_H_SELECTOR,
	cellSelector: SAP_HANA_TABLE_CELL_SELECTOR,
	sourceKind: "headless",
};

export const POSTGRESoptions = {
	source: {
		tableUrl: POSTGRES_HTML_STATES_REF_URL,
		htmlFile: POSTGRES_TABLE_PATH,
		csvFile: POSTGRES_CSV_PATH,
	},
	headers: {
		descriptors: data.postgres,
	},
	localFileTableSelector: "table",
	columnSize: POSTGRES_DB_COLUMN_SIZE,
	tableSelector: POSTGRES_TABLE_SELECTOR,
	headerSelector: POSTGRES_TABLE_TAb_H_SELECTOR,
	cellSelector: POSTGRES_TABLE_CELL_SELECTOR,
};