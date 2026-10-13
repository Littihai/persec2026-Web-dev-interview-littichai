/**
 * Q4 - Roman numerals, both directions
 *
 * toRoman(1989)        -> "MCMLXXXIX"
 * fromRoman("MCMLXXXIX") -> 1989
 *
 * Supported range: 1-3999. That is the classic range writable with
 * I V X L C D M alone; 4000 would need an overline (M with a bar) which has
 * no plain-ASCII form.
 *
 * toRoman idea: list every symbol including the six subtractive pairs
 * (CM, CD, XC, XL, IX, IV) in descending value order, then repeatedly take the
 * largest symbol that still fits. Because the pairs sit in the table, the
 * subtraction rule needs no special case.
 *
 * fromRoman idea: validate the shape with one regex that encodes the writing
 * rules (at most three repeats, only the legal subtractive pairs), then scan
 * left to right and subtract instead of add whenever a symbol is smaller than
 * the one after it.
 *
 * Both run in O(1) for this range: the loop is bounded by the longest numeral,
 * "MMMDCCCLXXXVIII" (3888) at 15 characters.
 */

export const MIN_ROMAN_VALUE = 1;
export const MAX_ROMAN_VALUE = 3999;

/** Symbols in descending value order, subtractive pairs included. */
const SYMBOLS: ReadonlyArray<readonly [value: number, numeral: string]> = [
  [1000, "M"],
  [900, "CM"],
  [500, "D"],
  [400, "CD"],
  [100, "C"],
  [90, "XC"],
  [50, "L"],
  [40, "XL"],
  [10, "X"],
  [9, "IX"],
  [5, "V"],
  [4, "IV"],
  [1, "I"],
];

const SINGLE_VALUES: Readonly<Record<string, number>> = {
  I: 1,
  V: 5,
  X: 10,
  L: 50,
  C: 100,
  D: 500,
  M: 1000,
};

/**
 * The only well-formed shape for 1-3999:
 * thousands, then hundreds, then tens, then units, each limited to three
 * repeats and to the legal subtractive pair. It rejects "IIII", "VX", "IC".
 */
const WELL_FORMED =
  /^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/;

/** Convert an integer in 1-3999 to its Roman numeral. */
export function toRoman(value: number): string {
  if (!Number.isInteger(value)) {
    throw new TypeError(`toRoman expects an integer, received ${value}`);
  }
  if (value < MIN_ROMAN_VALUE || value > MAX_ROMAN_VALUE) {
    throw new RangeError(
      `toRoman supports ${MIN_ROMAN_VALUE}-${MAX_ROMAN_VALUE}, received ${value}`,
    );
  }

  let remaining = value;
  let result = "";

  for (const [symbolValue, numeral] of SYMBOLS) {
    while (remaining >= symbolValue) {
      result += numeral;
      remaining -= symbolValue;
    }
  }

  return result;
}

/** Convert a Roman numeral in I-MMMCMXCIX to its integer value. */
export function fromRoman(numeral: string): number {
  if (typeof numeral !== "string") {
    throw new TypeError(`fromRoman expects a string, received ${typeof numeral}`);
  }

  // Lenient about surrounding spaces and letter case, strict about everything else.
  const normalized = numeral.trim().toUpperCase();

  if (normalized === "" || !WELL_FORMED.test(normalized)) {
    throw new Error(`Invalid Roman numeral: "${numeral}"`);
  }

  let total = 0;

  for (let i = 0; i < normalized.length; i += 1) {
    const current = SINGLE_VALUES[normalized[i]!]!;
    const next = SINGLE_VALUES[normalized[i + 1] ?? ""];

    // A smaller symbol in front of a larger one is a subtraction: IV, CM, ...
    total += next !== undefined && current < next ? -current : current;
  }

  return total;
}
