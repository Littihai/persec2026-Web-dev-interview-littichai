# Persec 2026 — Web Developer Pre-Interview Questions

Solutions to the six pre-interview questions, written in TypeScript with unit
tests (Vitest).

- **Language:** TypeScript 5 in `strict` mode (plus `noUncheckedIndexedAccess`)
- **Tests:** Vitest — 57 tests, each question tested against the examples from
  the question sheet plus its edge cases
- **No runtime dependencies.** Only TypeScript and Vitest as dev dependencies.

## Getting started

```bash
npm install      # install dev dependencies
npm test         # run every unit test once
npm run test:watch   # re-run tests on change
npm run typecheck    # tsc --noEmit
```

## Project structure

One folder per question, with the solution and its tests side by side:

```
src/
├── index.ts                        # re-exports every answer
├── q1-valid-brackets/
│   ├── validBrackets.ts
│   └── validBrackets.test.ts
├── q2-natural-sort/
│   ├── naturalSort.ts
│   └── naturalSort.test.ts
├── q3-autocomplete/
│   ├── autocomplete.ts
│   └── autocomplete.test.ts
├── q4-roman-numerals/
│   ├── romanNumerals.ts
│   └── romanNumerals.test.ts
├── q5-sort-digits-descending/
│   ├── sortDigitsDescending.ts
│   └── sortDigitsDescending.test.ts
└── q6-tribonacci/
    ├── tribonacci.ts
    └── tribonacci.test.ts
```

## The questions

### Q1 — Valid brackets

`isValidBrackets(input: string): boolean`

A closing bracket must always match the most recently opened one, which is
last-in / first-out, so the solution pushes opening brackets onto a stack and
pops on every closing bracket. The input is valid when nothing is left on the
stack at the end.

Time **O(n)**, space **O(n)**.

```ts
isValidBrackets("([{}])"); // true
isValidBrackets("([)]");   // false
isValidBrackets("{");      // false
```

### Q2 — Natural sort

`naturalSort(items: readonly string[]): string[]`
`naturalCompare(left: string, right: string): number`

A plain string sort puts `"TH10"` before `"TH3"`, because it compares `"1"` to
`"3"`. Each string is therefore split into alternating chunks of text and digits
(`"TH3Netflix"` → `["TH", "3", "Netflix"]`) and compared chunk by chunk, using a
numeric comparison whenever both sides are digit runs.

Digit runs are compared by (length after stripping leading zeros, then
lexicographically) instead of through `Number()`, so a digit run larger than
`Number.MAX_SAFE_INTEGER` still sorts correctly.

`naturalSort` returns a new array; the input is not mutated. `naturalCompare` is
exported so it can be passed straight to `Array.prototype.sort`.

Time **O(n·m log n)**, space **O(n·m)** — n items, m the cost of one comparison.

```ts
naturalSort(["TH10", "TH3Netflix", "TH1", "TH7"]);
// ["TH1", "TH3Netflix", "TH7", "TH10"]
```

### Q3 — Autocomplete

`autocomplete(search: string, items: readonly string[], maxResult: number): string[]`

Case-insensitive `indexOf` already returns the position of the match, which *is*
the ranking the question asks for: start of the word first, then further into
the word. Matches are sorted by that index and cut to `maxResult`.

Time **O(n·m + n log n)**, space **O(n)**.

```ts
autocomplete("th", ["Mother", "Think", "Worthy", "Apple", "Android"], 2);
// ["Think", "Mother"]
```

### Q4 — Roman numerals

`toRoman(value: number): string`
`fromRoman(numeral: string): number`

`toRoman` walks a table of symbol values in descending order that already
includes the six subtractive pairs (`CM CD XC XL IX IV`), taking the largest
symbol that still fits. Having the pairs in the table means the subtraction rule
needs no special case.

`fromRoman` first validates the shape with a single regex that encodes the
writing rules (at most three repeats, only the legal subtractive pairs), then
scans left to right and subtracts whenever a symbol is smaller than the one
after it.

Both are **O(1)** for the supported range — the longest numeral, `MMMDCCCLXXXVIII`,
is 15 characters. A round-trip test covers all 3,999 values.

```ts
toRoman(1989);          // "MCMLXXXIX"
fromRoman("MCMLXXXIX"); // 1989
toRoman(109);           // "CIX"
```

### Q5 — Sort digits descending

`sortDigitsDescending(value: number): number`

There are only ten possible digits, so rather than sorting them the solution
counts them into ten buckets (counting sort) while taking the number apart with
`% 10` and `/ 10`, then rebuilds from bucket 9 down to 0. No string conversion,
so it is **O(d)** rather than **O(d log d)** in the digit count, with **O(1)**
extra space.

```ts
sortDigitsDescending(3008); // 8300
sortDigitsDescending(9163); // 9631
```

### Q6 — Tribonacci

`tribonacci(signature: readonly number[], n: number): number[]`

Starts from a copy of the signature and keeps appending the sum of the last
three elements until the array holds `n` elements in total.

Time **O(n)**, space **O(n)**. The signature is not mutated.

```ts
tribonacci([1, 3, 5], 5);    // [1, 3, 5, 9, 17]
tribonacci([10, 10, 10], 4); // [10, 10, 10, 30]
```

## Assumptions

The question sheet leaves a few cases open. These are the choices made, all
covered by tests:

**Q1 — Valid brackets**
- An empty string is **valid** (`true`): nothing is left unclosed.
- A character that is not one of `()[]{}` makes the whole input invalid, since
  the question states the input contains only brackets.

**Q2 — Natural sort**
- Comparison is case-insensitive first, with a deterministic tie-break on the
  raw strings, so sorting is stable and never returns an inconsistent order.
- When one side has a text chunk where the other has digits (`"THA"` vs `"TH1"`),
  text sorts first — matching "letters A–Z first, then numbers".
- When one string is a prefix of the other, the shorter one comes first
  (`"TH1"` before `"TH1Extra"`).

**Q3 — Autocomplete**
- Items whose match is at the same position keep their original order in
  `items`. This is done with an explicit tie-break on the original index rather
  than relying on `Array.prototype.sort` being stable.
- `maxResult` of `0` or less returns `[]`; a fractional value is rounded down.
- An empty `search` string matches every item (`indexOf("")` is `0`), returning
  the first `maxResult` items in their original order.

**Q4 — Roman numerals**
- Supported range is **1–3999**, the classic range writable with `I V X L C D M`
  alone. 4000 would need an overline, which has no plain-ASCII form.
- `toRoman` throws `TypeError` for a non-integer and `RangeError` outside 1–3999.
- `fromRoman` is lenient about surrounding whitespace and letter case, and
  strict about everything else: `"IIII"`, `"VX"`, `"IC"`, `"MMMM"` and `""` all
  throw rather than guessing a value.

**Q5 — Sort digits descending**
- Only non-negative integers are accepted: `TypeError` for a non-integer,
  `RangeError` for a negative value or one above `Number.MAX_SAFE_INTEGER`.
- `0` returns `0`.
- A result that would exceed `Number.MAX_SAFE_INTEGER` throws `RangeError`
  instead of returning a silently wrong number — `1999999999999999` is a safe
  integer, but its sorted form `9999999999999991` is not.

**Q6 — Tribonacci**
- When fewer than three elements exist yet, the missing ones count as `0`, so
  `[1]` continues `1, 1, 2, 4, …` and `[]` stays all zeros.
- `n` of `0` or less returns `[]`.
- An `n` shorter than the signature truncates it: `tribonacci([5, 2, 0], 1)` is
  `[5]`.
- A signature longer than three numbers throws `RangeError`, since the question
  specifies 0–3 starting values.
- `n` must be an integer, and the signature must hold numbers only.
