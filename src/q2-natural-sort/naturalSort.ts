/**
 * Q2 - Natural Sort
 *
 * Sort strings the way a human reads them: the text part alphabetically,
 * and any digit run by its numeric value instead of character by character.
 *
 * A plain string sort puts "TH10" before "TH3", because it compares "1" < "3".
 * The fix is to split each string into alternating chunks of text and digits,
 * then compare chunk by chunk and switch to a numeric comparison whenever both
 * sides are digits.
 *
 *   "TH3Netflix" -> ["TH", "3", "Netflix"]
 *   "TH10"       -> ["TH", "10"]
 *
 * Numbers are compared by (digit length, then lexicographically) rather than by
 * Number(), so a digit run longer than Number.MAX_SAFE_INTEGER still compares
 * correctly.
 *
 * Time  O(n * m log n) - n items, m the cost of comparing two strings.
 * Space O(n * m)       - the tokenized form of every string is cached once.
 */

type Chunk =
  | { readonly kind: "text"; readonly value: string }
  | { readonly kind: "number"; readonly digits: string };

const CHUNK_PATTERN = /\d+|\D+/g;

/** Split a string into alternating text / digit chunks. */
export function tokenize(input: string): Chunk[] {
  const matches = input.match(CHUNK_PATTERN) ?? [];

  return matches.map((part) =>
    /^\d/.test(part)
      ? { kind: "number" as const, digits: part }
      : { kind: "text" as const, value: part },
  );
}

/** Compare two digit runs by value, without converting them to Number. */
function compareDigits(left: string, right: string): number {
  const a = left.replace(/^0+(?=\d)/, "");
  const b = right.replace(/^0+(?=\d)/, "");

  if (a.length !== b.length) return a.length - b.length;
  if (a !== b) return a < b ? -1 : 1;

  // Same value: keep ordering deterministic for "007" vs "7".
  return left.length - right.length;
}

function compareText(left: string, right: string): number {
  const a = left.toLowerCase();
  const b = right.toLowerCase();

  if (a !== b) return a < b ? -1 : 1;
  if (left === right) return 0;

  // Same letters, different case: keep ordering deterministic.
  return left < right ? -1 : 1;
}

/**
 * Comparator usable directly with Array.prototype.sort.
 * Returns a negative number, 0, or a positive number.
 */
export function naturalCompare(left: string, right: string): number {
  const leftChunks = tokenize(left);
  const rightChunks = tokenize(right);
  const shared = Math.min(leftChunks.length, rightChunks.length);

  for (let i = 0; i < shared; i += 1) {
    const a = leftChunks[i]!;
    const b = rightChunks[i]!;

    if (a.kind === "number" && b.kind === "number") {
      const result = compareDigits(a.digits, b.digits);
      if (result !== 0) return result;
      continue;
    }

    if (a.kind === "text" && b.kind === "text") {
      const result = compareText(a.value, b.value);
      if (result !== 0) return result;
      continue;
    }

    // Mixed kinds at the same position: text sorts before digits,
    // so "THA" comes before "TH1". (Documented assumption.)
    return a.kind === "text" ? -1 : 1;
  }

  // One string is a prefix of the other: the shorter one comes first.
  return leftChunks.length - rightChunks.length;
}

/** Return a new array sorted naturally; the input array is left untouched. */
export function naturalSort(items: readonly string[]): string[] {
  return [...items].sort(naturalCompare);
}
