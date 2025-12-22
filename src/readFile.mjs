import fs from "fs";
import { reargv } from "./utils/args.mjs";

console.log(fs.readFileSync(reargv().files[0], "utf8"));
