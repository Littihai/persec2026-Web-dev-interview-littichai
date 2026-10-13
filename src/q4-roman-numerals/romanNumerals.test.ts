import { describe, expect, it } from "vitest";
import {
  MAX_ROMAN_VALUE,
  MIN_ROMAN_VALUE,
  fromRoman,
  toRoman,
} from "./romanNumerals.js";

describe("toRoman", () => {
  it("converts the examples from the question", () => {
    expect(toRoman(1989)).toBe("MCMLXXXIX");
    expect(toRoman(109)).toBe("CIX");
  });

  it("applies the subtraction rule", () => {
    expect(toRoman(4)).toBe("IV");
    expect(toRoman(9)).toBe("IX");
    expect(toRoman(40)).toBe("XL");
    expect(toRoman(90)).toBe("XC");
    expect(toRoman(400)).toBe("CD");
    expect(toRoman(900)).toBe("CM");
  });

  it("handles the range boundaries", () => {
    expect(toRoman(MIN_ROMAN_VALUE)).toBe("I");
    expect(toRoman(MAX_ROMAN_VALUE)).toBe("MMMCMXCIX");
  });

  it("rejects values outside 1-3999", () => {
    expect(() => toRoman(0)).toThrow(RangeError);
    expect(() => toRoman(-1)).toThrow(RangeError);
    expect(() => toRoman(4000)).toThrow(RangeError);
  });

  it("rejects values that are not integers", () => {
    expect(() => toRoman(1.5)).toThrow(TypeError);
    expect(() => toRoman(Number.NaN)).toThrow(TypeError);
  });
});

describe("fromRoman", () => {
  it("converts the examples from the question", () => {
    expect(fromRoman("MCMLXXXIX")).toBe(1989);
    expect(fromRoman("CIX")).toBe(109);
  });

  it("reads subtractive pairs", () => {
    expect(fromRoman("IV")).toBe(4);
    expect(fromRoman("IX")).toBe(9);
    expect(fromRoman("XL")).toBe(40);
    expect(fromRoman("CM")).toBe(900);
  });

  it("accepts lowercase input and surrounding spaces", () => {
    expect(fromRoman("  mcmlxxxix  ")).toBe(1989);
  });

  it("rejects malformed numerals", () => {
    expect(() => fromRoman("IIII")).toThrow();
    expect(() => fromRoman("VX")).toThrow();
    expect(() => fromRoman("IC")).toThrow();
    expect(() => fromRoman("MMMM")).toThrow();
    expect(() => fromRoman("VV")).toThrow();
  });

  it("rejects an empty string and non-Roman characters", () => {
    expect(() => fromRoman("")).toThrow();
    expect(() => fromRoman("   ")).toThrow();
    expect(() => fromRoman("ABC")).toThrow();
    expect(() => fromRoman("X1")).toThrow();
  });
});

describe("toRoman / fromRoman round trip", () => {
  it("returns the original value for every number in the supported range", () => {
    for (let value = MIN_ROMAN_VALUE; value <= MAX_ROMAN_VALUE; value += 1) {
      expect(fromRoman(toRoman(value))).toBe(value);
    }
  });
});
