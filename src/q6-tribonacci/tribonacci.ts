/**
 * Q6 - tribonacci(signature, n)
 *
 * `signature` holds 0-3 starting numbers, `n` is how many elements the result
 * should have in total, counting the signature itself. Every element after the
 * signature is the sum of the three before it.
 *
 *   tribonacci([1, 3, 5], 5)    -> [1, 3, 5, 9, 17]
 *   tribonacci([10, 10, 10], 4) -> [10, 10, 10, 30]
 *
 * Idea: start from a copy of the signature and keep pushing the sum of the
 * last three elements until the array has n elements. When fewer than three
 * elements exist yet, the missing ones count as 0 - so [1] continues
 * 1, 1, 2, 4, ... and [] stays all zeros. (Documented assumption.)
 *
 * Time  O(n) - each element is computed from a fixed window of three.
 * Space O(n) - the result array.
 */

const MAX_SIGNATURE_LENGTH = 3;

export function tribonacci(
  signature: readonly number[],
  n: number,
): number[] {
  if (!Number.isInteger(n)) {
    throw new TypeError(`tribonacci expects an integer n, received ${n}`);
  }
  if (signature.length > MAX_SIGNATURE_LENGTH) {
    throw new RangeError(
      `tribonacci expects a signature of 0-${MAX_SIGNATURE_LENGTH} numbers, received ${signature.length}`,
    );
  }
  if (signature.some((value) => typeof value !== "number" || Number.isNaN(value))) {
    throw new TypeError("tribonacci expects the signature to hold numbers only");
  }

  if (n <= 0) return [];

  // n may be shorter than the signature: tribonacci([5, 2, 0], 1) -> [5].
  const result = signature.slice(0, n);

  while (result.length < n) {
    const window = result.slice(-MAX_SIGNATURE_LENGTH);
    const next = window.reduce((sum, value) => sum + value, 0);
    result.push(next);
  }

  return result;
}
