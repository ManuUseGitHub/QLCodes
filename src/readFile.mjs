import fs from "fs";
import { reargv } from "reargv";

console.log(fs.readFileSync(reargv().files[0], "utf8"));
