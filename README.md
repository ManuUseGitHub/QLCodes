# QLCodes

A small utility that unifies SQL codes describing states (SQLSTATE) from different DBMS into a single, normalized structure through a curated dataset constructed at build time.

The module is built from authoritative vendor documentation (IBM, PostgreSQL, Oracle) and generates static reference data at build time. [Find references bellow](/#user-content-references).

## SQLSTATES coverage

The project aims to cover sql states for most of RDBMS [drivers supported by **Typeorm** such as Google Spanner](https://typeorm.io/docs/drivers/google-spanner).
Find bellow the actual coverage:
               
🕓 MySQL | ✅ MariaDB | ✅ PostgreSQL | 🕓 CockroachDB (Postgres-compatible)
🕓 Microsoft SQL Server | ✅ Oracle | 🕓 SQLite | ✅ SAP HANA | ✅ Google Spanner | ✅ IBM*
>( \* ) IBM defines and publishes SQLSTATE codes as part of the SQL standard, so their The codes should covere IBM products such as DB2, IBM Informix, IBM Netezza, IBM i (AS/400) .

## Installation

```bash
$ npm install qlcodes
```

## Usage

```js
import { lens } from "qlcodes";

const state = lens("42501");

console.log(state);
```

Output :

```js
{
  "code": "42501",
  "qlcs": "qlcodes_success",
  "matches": [
    {
      "code": "42501",
      "keys": [
        "insufficient_privilege",
        "authorization_id_does_not_have_privilege_to_perform_specified_operation_on_identified_object"
      ],
      "reasons": [
        "The authorization ID does not have the privilege to perform the specified operation on the identified object."
      ],
      "use": [
        "pgsql",
        "ibm"
      ],
      "class": "42 - Syntax Error or Access Rule Violation"
    }
  ]
}
```

### Mismatches

If the provided SQLSTATE does not match any known entry, we return a normalized fallback object
This guarantees that lens() always returns a predictable object shape.

There are three mismatch levels that we detect.

**Format** : The provided code is malformed and is not validate the expression /[0-9A-Z]{5}/

> ℹ️ ["SQLSTATE values are comprised of a two-character class code value, followed by a three-character subclass code value. (ISO/IEC 9075:1992)"](https://www.ibm.com/docs/en/db2-for-zos/12.0.0?topic=codes-sqlstate-values-common-error)

```js
console.log(lens("123456"));
```

Output:

```js
{
  "code": "123456",
  "qlcs": "qlcodes_malformed",
  "matches": []
}
```

**Code** : The provided code matches no code within known classes

```js
console.log(lens("2000U"));
```

Output:

```js
{
  "code": "ABCDE",
  "qlcs": "qlcodes_no_code_found",
  "matches": []
}
```

---

## API

`lens(code: string): QLLens`

|Parameters|Returns|
|-|-|
|**code** SQLSTATE status code | A structured status description|
|| **code** — normalized SQLSTATE, or `-1` if not found
|| **keys** — semantic identifiers
|| **use** — `DBMS` where the code is applicable
|| **reasons** — human-readable explanations
|| **qlcs** — 'qlcode status', shows the lens call status

## Customization & Rebuild (Contributors)

If you want to extend or adjust the reference data:

1) Clone the repository

```bash
$ git clone https://github.com/ManuUseGitHub/QLCodes.git
$ cd qlcodes
$ npm install
```

2) Adapt the column (headers) configuration.
- `.qlCodes` file (root) : gives the configuration of CSVs headers/columns (with their format and aliases)
- `src/constants.mjs` : gives the configuration of the options passed throught `@maze014/domFetch` to fetch the documentation table of codes for the matching RDBMs.

3) Run the dev script to set everything up.
```bash
$ npm run dev
```
This action will generate the folowing resources folders :
- HTML : files from which a DOM can be fetched via domFetch.
- CSV : CSVs files generated from the build script. These files can be modified according updated info. 


4) Rebuild the module


```bash
# generate the qlCodes.json
$ npm run build -- --prod
```

### Quality of life

By default, the build script has no flag passed but
You may pass flag argument to the build script to enforce a few behaviours to help you seing through the processor...

|argument|effect|
|-|-|
|`--debug`|prevents the cleanup of middle stage file created during the data processing|
|`--prod`|will destroy the resources folder in order to keep things clean|


---

## Showcase

[in stackblitz](https://stackblitz.com/edit/stackblitz-starters-vjcs3q7x?file=index.js)

---

## References

- IBM
  [Listing of SQLSTATE values](https://www.ibm.com/docs/en/i/7.6.0?topic=codes-listing-sqlstate-values#cc__classcode00)
  (Last Updated: 2025-09-29)

- Postgres codes
  [Appendix A. PostgreSQL Error Codes](https://www.postgresql.org/docs/10/static/errcodes-appendix.html)
  (V.10)

- Oracle
  [Oracle appendix](https://docs.oracle.com/cd/E15817_01/appdev.111/b31228/appd.htm)
  11g Release 1 (11.1)

- MariaDb
  [MariaDB Error Code Reference](https://mariadb.com/docs/server/reference/error-codes/mariadb-error-code-reference)

- Google Spanner
  [Spanner error codes](https://docs.cloud.google.com/spanner/docs/error-codes)

- SAP Hana
  [SAP HANA SQL Reference Guide for SAP HANA Platform](https://help.sap.com/docs/SAP_HANA_PLATFORM/4fe29514fd584807ac9f2a04f6754767/20a78d3275191014b41bae7c4a46d835.html) V2.0 SPS 08

---

## License

[MIT 2025](https://github.com/ManuUseGitHub/QLCodes?tab=MIT-1-ov-file#readme)
