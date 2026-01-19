export const ERROR_CODE_HEADER_RGX =
	/^(?:Table \d+\.\sClass\sCode|Class)\s+(?<classCode>[0-9A-Z]{2})[^\w]+(?<label>.+)\n?/;

// Class after generate header
export const CLASS_RE =
	/^Class\s+(?<classCode>[0-9A-Z]{2})\s+—\s+(?<label>.+)$/;

export const CODE_RE =
	/^(?<code>[0-9A-Z]{5})\*?(?<flags>[\w:]*)\s+(?<key>!?[a-z_]+)$/;

export const COMMENT_RE = /^\*/;
