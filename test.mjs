import { lens } from "./dist/index.mjs";
const code = lens("42501");
const json = JSON.stringify(code, null, 2);
console.log(json);