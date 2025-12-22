import { reargv } from "./args.mjs";
import { toSnakeCase } from "./str.mjs";

const argv = reargv();

export const normalizeCode = (raw, classCode) => {
	if (raw === "0") return "00000";
	if (raw.endsWith("xxx")) return `${classCode}000`;
	if (!raw.length) return "";
	return raw.padStart(5, "0");
};

const getFlags = () => (argv.options.flag || "").split(",").join(":");
const isMakeKeys = process.env.MAKE_KEYS === "true";
export const newCode = (line, currentClassCode) => {
	const flags = getFlags();
	const [left, right] = line.split(";", 2);

	const code = normalizeCode(left.trim(), currentClassCode);
	const description = right.trim();
	let key = toSnakeCase(description.split(".")[0]);

	if (!isMakeKeys && !/^[a-z_]+/.test(description.split(".")[0])) {
		key = "_";
	}

	return code.length
		? [`${code}${flags ? "*" + flags : ""}  !${key}`, description]
		: [description];
};

export const insertHeadersAndFormat = (sanitized) => {
	const lines = [];
	let lastClass = "";
	sanitized.split(/[\n]/g).forEach((line) => {
		const match = /^(?<class_code>[0-9A-Z]{1,5});(?<label>.+)/.exec(line);

		if (match) {
			let { class_code, label } = match.groups;
			class_code == "0" ? (class_code = "00000") : class_code;
			if (class_code) {
				const idClass = class_code.substring(0, 2);
				if (lastClass != idClass) {
					lines.push(`Class ${idClass} — ${label.split(";")[0]}`);
				}
				lastClass = idClass;
			}
		}
		const [right, left] = line.split(";");
		if (left) {
			lines.push([right.padStart(5, "0"), left].join(";"));
		}
	});
	return lines.join("\n");
};
