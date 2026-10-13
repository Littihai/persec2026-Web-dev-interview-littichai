import { describe, expect, it } from "vitest";
import { isValidBrackets } from "./validBrackets.js";

describe("isValidBrackets", () => {
  it("accepts the examples from the question", () => {
    expect(isValidBrackets("()")).toBe(true);
    expect(isValidBrackets("()[]{}")).toBe(true);
    expect(isValidBrackets("([{}])")).toBe(true);
  });

  it("rejects the examples from the question", () => {
    expect(isValidBrackets("(]")).toBe(false);
    expect(isValidBrackets("([)]")).toBe(false);
    expect(isValidBrackets("{")).toBe(false);
  });

  it("treats an empty string as valid (nothing is left unclosed)", () => {
    expect(isValidBrackets("")).toBe(true);
  });

  it("rejects a closing bracket that was never opened", () => {
    expect(isValidBrackets(")")).toBe(false);
    expect(isValidBrackets("()}" )).toBe(false);
  });

  it("rejects an opening bracket that is never closed", () => {
    expect(isValidBrackets("([]")).toBe(false);
    expect(isValidBrackets("{[()]")).toBe(false);
  });

  it("handles deep nesting", () => {
    expect(isValidBrackets("{[()()]}")).toBe(true);
    expect(isValidBrackets("(".repeat(500) + ")".repeat(500))).toBe(true);
    expect(isValidBrackets("(".repeat(500) + ")".repeat(499))).toBe(false);
  });

  it("rejects characters that are not brackets", () => {
    expect(isValidBrackets("a(b)")).toBe(false);
    expect(isValidBrackets(" ")).toBe(false);
  });
});
