export interface QLLens {
	/**
	 * Normalized SQLSTATE code.
	 * "-1" indicates that the code was not found.
	 */
	code: string;

	/**
	 * Semantic identifiers for the error.
	 */
	keys: string[];

	/**
	 * DBMS where the error code is applicable
	 * (e.g. "ibm", "postgres", "oracle").
	 */
	use: string[];

	/**
	 * Human-readable explanation of the error.
	 */
	reason: string;
}

/**
 * Returns a normalized SQL error description.
 *
 * @param code SQLSTATE error code
 * @returns A QLLens object (never null)
 */
export function lens(code: string): QLLens;