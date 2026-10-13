import { describe, expect, it } from "vitest";
import { naturalCompare, naturalSort } from "./naturalSort.js";

describe("naturalSort", () => {
  it("sorts the example from the question", () => {
    expect(naturalSort(["TH10", "TH3Netflix", "TH1", "TH7"])).toEqual([
      "TH1",
      "TH3Netflix",
      "TH7",
      "TH10",
    ]);
  });

  it("sorts the text prefix alphabetically before looking at numbers", () => {
    expect(naturalSort(["SG2", "TH1", "JP10", "TH1Extra"])).toEqual([
      "JP10",
      "SG2",
      "TH1",
      "TH1Extra",
    ]);
  });

  it("compares digit runs by value, not as text", () => {
    expect(naturalSort(["x2", "x100", "x20", "x3"])).toEqual([
      "x2",
      "x3",
      "x20",
      "x100",
    ]);
  });

  it("handles several numeric groups in one string", () => {
    expect(naturalSort(["v1.10.0", "v1.2.0", "v1.2.10", "v1.2.2"])).toEqual([
      "v1.2.0",
      "v1.2.2",
      "v1.2.10",
      "v1.10.0",
    ]);
  });

  it("does not mutate the input array", () => {
    const input = ["b2", "a1"];
    naturalSort(input);
    expect(input).toEqual(["b2", "a1"]);
  });

  it("handles empty and single-item arrays", () => {
    expect(naturalSort([])).toEqual([]);
    expect(naturalSort(["only"])).toEqual(["only"]);
  });

  it("puts a shorter string before the longer one it prefixes", () => {
    expect(naturalSort(["TH1Extra", "TH1"])).toEqual(["TH1", "TH1Extra"]);
  });

  it("compares digit runs beyond Number.MAX_SAFE_INTEGER correctly", () => {
    expect(
      naturalSort(["n9007199254740993", "n9007199254740992"]),
    ).toEqual(["n9007199254740992", "n9007199254740993"]);
  });

  it("handles leading zeros", () => {
    expect(naturalSort(["a010", "a9", "a07"])).toEqual(["a07", "a9", "a010"]);
  });

  it("is a consistent comparator", () => {
    expect(naturalCompare("TH1", "TH10")).toBeLessThan(0);
    expect(naturalCompare("TH10", "TH1")).toBeGreaterThan(0);
    expect(naturalCompare("TH1", "TH1")).toBe(0);
  });
});
