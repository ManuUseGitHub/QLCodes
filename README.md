# QLCodes

A small utility that unifies SQL error codes (SQLSTATE) from different DBMS into a single, normalized structure through a curated dataset constructed at build time.

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
npm install qlcodes
```

## Usage

```js
    import { lens } from "qlcodes";
    
    const error = lens("42501");
    
    console.log(error);
```

Output :

```js
{
    code: "42501",
    keys: ["insufficient_privilege"],
    use: ["ibm", "postgres"],
    reason: "The authorization ID does not have the privilege to perform the specified operation on the identified object."
}
```

### Mismatches

If the provided SQLSTATE does not match any known entry, we return a normalized fallback object
This guarantees that lens() always returns a predictable object shape.

```js
const error = lens("XXXXX");

console.log(error);
```

Output:

```js
{
  code: "-1",
  keys: ["qlcodes_not_found"],
  use: [],
  reason: "The code 'XXXXX' does not match any entries in qlcodes. This may be a qlcode issue only to provide you with the correct information"
}
```

---

## API

`lens(code: string): QLLens`
|Parameters|Returns|
|-|-|
|**code** SQLSTATE error code | A structured error description|
|| **code** — normalized SQLSTATE, or `-1` if not found
|| **keys** — semantic identifiers
|| **use** — `DBMS` where the code is applicable
|| **reason** — human-readable explanation

## Customization & Rebuild (Contributors)

> ⚠️ Do not modify files inside node_modules.
> Changes will be lost on reinstall.

If you want to extend or adjust the reference data:

1) Clone the repository

```bash
$ git clone <repository-url>
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
|--debug|prevent the cleanup of middle stage file created during the data processing|
|--make-keys|allow the creation of keys when a description is given...through the 'generate' step (`generate.cjs`)|



Use your customized build via a local dependency or a forked package.

---

## License
[MIT 2025](https://github.com/ManuUseGitHub/QLCodes?tab=MIT-1-ov-file#readme)
