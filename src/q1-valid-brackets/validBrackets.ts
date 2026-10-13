/**
 * Q1 - Valid Brackets
 *
 * Check that every bracket in the string is closed by the matching type
 * and in the correct nesting order.
 *
 * Idea: a closing bracket must always match the most recently opened one,
 * which is exactly last-in / first-out behaviour, so a stack is the natural fit.
 *
 * Time  O(n) - every character is pushed/popped at most once.
 * Space O(n) - worst case all characters are opening brackets, e.g. "((((".
 */

/** Closing bracket -> the opening bracket it must match. */
const CLOSING_TO_OPENING: Readonly<Record<string, string>> = {
  ")": "(",
  "]": "[",
  "}": "{",
};

const OPENING_BRACKETS = new Set(Object.values(CLOSING_TO_OPENING));

export function isValidBrackets(input: string): boolean {
  const stack: string[] = [];

  for (const char of input) {
    if (OPENING_BRACKETS.has(char)) {
      stack.push(char);
      continue;
    }

    const expectedOpening = CLOSING_TO_OPENING[char];

    // Not a bracket character at all -> treat the whole input as invalid,
    // because the spec says the input contains only ()[]{}.
    if (expectedOpening === undefined) return false;

    // A closing bracket with nothing open, or closing the wrong type.
    if (stack.pop() !== expectedOpening) return false;
  }

  // Anything left on the stack was opened but never closed.
  return stack.length === 0;
}
