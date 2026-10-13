import { describe, expect, it } from "vitest";
import { sortDigitsDescending } from "./sortDigitsDescending.js";

describe("sortDigitsDescending", () => {
  it("returns the examples from the question", () => {
    expect(sortDigitsDescending(3008)).toBe(8300);
    expect(sortDigitsDescending(9163)).toBe(9631);
  });

  it("handles a single digit", () => {
    expect(sortDigitsDescending(7)).toBe(7);
    expect(sortDigitsDescending(0)).toBe(0);
  });

  it("handles repeated digits", () => {
    expect(sortDigitsDescending(1111)).toBe(1111);
    expect(sortDigitsDescending(1221)).toBe(2211);
  });

  it("keeps a value that is already sorted", () => {
    expect(sortDigitsDescending(9876543210)).toBe(9876543210);
  });

  it("drops trailing zeros into place, shortening the number", () => {
    // 1000 -> 1000 has four digits, and so does the result.
    expect(sortDigitsDescending(1000)).toBe(1000);
    expect(sortDigitsDescending(1020)).toBe(2100);
  });

  it("rejects negative numbers", () => {
    expect(() => sortDigitsDescending(-123)).toThrow(RangeError);
  });

  it("rejects values that are not integers", () => {
    expect(() => sortDigitsDescending(12.5)).toThrow(TypeError);
    expect(() => sortDigitsDescending(Number.NaN)).toThrow(TypeError);
    expect(() => sortDigitsDescending(Number.POSITIVE_INFINITY)).toThrow(
      TypeError,
    );
  });

  it("rejects an input above Number.MAX_SAFE_INTEGER", () => {
    expect(() => sortDigitsDescending(2 ** 53)).toThrow(RangeError);
  });

  it("rejects an input whose sorted result would not be a safe integer", () => {
    // 1999999999999999 is safe, but 9999999999999991 is not.
    expect(() => sortDigitsDescending(1999999999999999)).toThrow(RangeError);
  });
});
