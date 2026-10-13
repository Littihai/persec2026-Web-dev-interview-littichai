import { describe, expect, it } from "vitest";
import { autocomplete } from "./autocomplete.js";

const ITEMS = ["Mother", "Think", "Worthy", "Apple", "Android"] as const;

describe("autocomplete", () => {
  it("returns the example from the question", () => {
    expect(autocomplete("th", ITEMS, 2)).toEqual(["Think", "Mother"]);
  });

  it("ranks a match at the start of the word before a match inside it", () => {
    expect(autocomplete("th", ITEMS, 10)).toEqual([
      "Think", // index 0
      "Mother", // index 2
      "Worthy", // index 2, after Mother in the input
    ]);
  });

  it("ignores letter case on both sides", () => {
    expect(autocomplete("TH", ITEMS, 1)).toEqual(["Think"]);
    expect(autocomplete("aPp", ITEMS, 1)).toEqual(["Apple"]);
  });

  it("returns an empty array when nothing matches", () => {
    expect(autocomplete("zzz", ITEMS, 5)).toEqual([]);
  });

  it("returns an empty array for a non-positive maxResult", () => {
    expect(autocomplete("th", ITEMS, 0)).toEqual([]);
    expect(autocomplete("th", ITEMS, -3)).toEqual([]);
  });

  it("rounds a fractional maxResult down", () => {
    expect(autocomplete("th", ITEMS, 2.9)).toEqual(["Think", "Mother"]);
  });

  it("returns every match when maxResult is larger than the match count", () => {
    expect(autocomplete("an", ITEMS, 99)).toEqual(["Android"]);
  });

  it("matches every item for an empty search string", () => {
    expect(autocomplete("", ITEMS, 3)).toEqual(["Mother", "Think", "Worthy"]);
  });

  it("handles an empty item list", () => {
    expect(autocomplete("th", [], 5)).toEqual([]);
  });

  it("does not mutate the input array", () => {
    const items = ["Mother", "Think"];
    autocomplete("th", items, 2);
    expect(items).toEqual(["Mother", "Think"]);
  });
});
