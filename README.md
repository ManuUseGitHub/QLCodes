# QLCodes

A small utility that unifies SQL codes describing states (SQLSTATE) from different DBMS into a single, normalized structure through a curated dataset constructed at build time.

The module is built from authoritative vendor documentation (IBM, PostgreSQL, Oracle) and generates static reference data at build time. Find references bellow.

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

---

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
  code: "42501",
  keys: [ "insufficient_privilege" ],
  use: [ "ibm", "postgres" ],
  reason: "The authorization ID does not have the privilege to perform the specified operation on the identified object.",
  qlcs: "qlcodes_sucess"
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
  code: "123456",
  keys: [],
  qlcs: "qlcodes_malformed",
  use: [],
  r
```

**Class** : The provided code matches no code class

```js
console.log(lens("ABCDE"));
```

Output:

```js
{
  code: "ABCDE",
  keys: [],
  qlcs: "qlcodes_no_class_found",
  use: [],
  reason: "The code 'ABCDE' does not match any entries in qlcodes. This may be a qlcode issue only to provide you with the correct information"
}
```

**Code** : The provided code matches no code within known classes

```js
console.log(lens("2000U"));
```

Output:

```js
{
  code: "2000U",
  keys: [],
  qlcs: "qlcodes_no_code_found",
  use: [],
  reason: "The code '2000U' does not match any entries in qlcodes. This may be a qlcode issue only to provide you with the correct information"
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
|| **reason** — human-readable explanation
|| **qlcs** — 'qlcode status', shows the lens call status

## Customization & Rebuild (Contributors)

> ⚠️ Do not modify files inside node_modules.
> Changes will be lost on reinstall.

If you want to extend or adjust the reference data:

1) Clone the repository

```bash
$ git clone https://github.com/ManuUseGitHub/QLCodes.git
$ cd qlcodes
$ npm install
```

2) Modify files:

- under references/
    -> CSV files generated from vendor documentation
- under src/
    -> transformation and normalization logic

> ⚠️ follow the data modification pipeline describe by the `build.sh` script.
> unless you know what you know what you are doing.

3) Rebuild the module
```bash
$ npm run build
```

### Quality of life
You may pass argument to the build script to enforce a few behaviours to help you seing through the process...
|argument|effect|
|-|-|
|`--debug`|prevents the cleanup of middle stage file created during the data processing|
|`--make-keys`|allows the creation of keys when a description is given...through the 'generate' step (`generate.cjs`)|



Use your customized build via a local dependency or a forked package.

---

## License
[MIT 2025](https://github.com/ManuUseGitHub/QLCodes?tab=MIT-1-ov-file#readme)
