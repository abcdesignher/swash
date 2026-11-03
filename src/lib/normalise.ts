/**
 * Input normalisation shared by the browser form and the server.
 *
 * Pure functions with no Node or browser dependencies, so the exact same code
 * runs in AuthForm (convenience) and in the API route (enforcement).
 * The server never trusts that the client ran it.
 *
 * Approved authentication policy:
 *  - Email: strip edge whitespace, then lowercase.
 *  - Password: strip edge whitespace ONLY. No lowercasing, no Unicode
 *    normalisation, interior characters are never changed.
 */

/**
 * Characters treated as "edge whitespace" when users paste values.
 * JavaScript's `\s` covers spaces, tabs, line breaks, non-breaking space
 * (U+00A0), other Unicode space separators and the byte-order mark (U+FEFF).
 * Zero-width characters (U+200B-U+200D, U+2060) are not covered by `\s` but
 * are commonly picked up when copying from chat apps, PDFs and web pages.
 */
const EDGE_WHITESPACE = "[\\s\\u200B-\\u200D\\u2060\\uFEFF]";
const LEADING = new RegExp(`^${EDGE_WHITESPACE}+`);
const TRAILING = new RegExp(`${EDGE_WHITESPACE}+$`);

export function trimEdgeWhitespace(value: string): string {
  return value.replace(LEADING, "").replace(TRAILING, "");
}

export function normaliseEmail(value: string): string {
  return trimEdgeWhitespace(value).toLowerCase();
}

export function normalisePassword(value: string): string {
  return trimEdgeWhitespace(value);
}

export function passwordHadEdgeWhitespace(value: string): boolean {
  return normalisePassword(value) !== value;
}

