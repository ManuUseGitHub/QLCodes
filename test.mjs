import { lens } from "./dist/index.mjs";
const code = lens("insufficient_privilege");
const json = JSON.stringify(code, null, 2);
console.log(json);