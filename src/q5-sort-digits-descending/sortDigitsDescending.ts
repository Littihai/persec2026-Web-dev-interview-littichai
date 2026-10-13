/**
 * Q5 - Sort the digits of a positive integer from high to low
 *
 * 3008 -> 8300
 * 9163 -> 9631
 *
 * Idea: there are only ten possible digits, so instead of sorting them the
 * digits are counted into ten buckets (counting sort) while the number is
 * taken apart with % 10 and / 10. Rebuilding then walks the buckets from 9
 * down to 0. No string conversion is involved, which keeps it O(d) instead of
 * O(d log d), d being the number of digits.
 *
 * Time  O(d)
 * Space O(1) - always ten buckets.
 */

/** Digits of the result must still fit in a JavaScript safe integer. */
export function sortDigitsDescending(value: number): number {
  if (!Number.isInteger(value)) {
    throw new TypeError(
      `sortDigitsDescending expects an integer, received ${value}`,
    );
  }
  if (value < 0) {
    throw new RangeError(
      `sortDigitsDescending expects a non-negative integer, received ${value}`,
    );
  }
  if (!Number.isSafeInteger(value)) {
    throw new RangeError(
      `sortDigitsDescending requires a value up to Number.MAX_SAFE_INTEGER, received ${value}`,
    );
  }

  // A single 0 has nothing to rearrange.
  if (value === 0) return 0;

  const digitCounts = new Array<number>(10).fill(0);

  for (let remaining = value; remaining > 0; remaining = Math.floor(remaining / 10)) {
    const digit = remaining % 10;
    digitCounts[digit] = (digitCounts[digit] ?? 0) + 1;
  }

  let result = 0;

  for (let digit = 9; digit >= 0; digit -= 1) {
    for (let i = 0; i < digitCounts[digit]!; i += 1) {
      result = result * 10 + digit;

      // e.g. 1999999999999999 is safe, but 9999999999999991 is not.
      if (!Number.isSafeInteger(result)) {
        throw new RangeError(
          `The sorted result of ${value} exceeds Number.MAX_SAFE_INTEGER`,
        );
      }
    }
  }

  return result;
}
