import { describe, expect, it } from "vitest";
import { tribonacci } from "./tribonacci.js";

describe("tribonacci", () => {
  it("returns the examples from the question", () => {
    expect(tribonacci([1, 3, 5], 5)).toEqual([1, 3, 5, 9, 17]);
    expect(tribonacci([10, 10, 10], 4)).toEqual([10, 10, 10, 30]);
  });

  it("continues for longer sequences", () => {
    expect(tribonacci([1, 1, 1], 10)).toEqual([
      1, 1, 1, 3, 5, 9, 17, 31, 57, 105,
    ]);
    expect(tribonacci([0, 0, 1], 8)).toEqual([0, 0, 1, 1, 2, 4, 7, 13]);
  });

  it("cuts the signature when n is shorter than it", () => {
    expect(tribonacci([5, 2, 0], 1)).toEqual([5]);
    expect(tribonacci([5, 2, 0], 2)).toEqual([5, 2]);
  });

  it("returns an empty array for n of 0 or less", () => {
    expect(tribonacci([1, 3, 5], 0)).toEqual([]);
    expect(tribonacci([1, 3, 5], -4)).toEqual([]);
  });

  it("treats the missing elements of a short signature as 0", () => {
    expect(tribonacci([1], 4)).toEqual([1, 1, 2, 4]);
    expect(tribonacci([2, 3], 5)).toEqual([2, 3, 5, 10, 18]);
    expect(tribonacci([], 4)).toEqual([0, 0, 0, 0]);
  });

  it("handles negative starting values", () => {
    expect(tribonacci([-1, 2, -3], 5)).toEqual([-1, 2, -3, -2, -3]);
  });

  it("does not mutate the signature", () => {
    const signature = [1, 3, 5];
    tribonacci(signature, 6);
    expect(signature).toEqual([1, 3, 5]);
  });

  it("rejects a signature longer than three numbers", () => {
    expect(() => tribonacci([1, 2, 3, 4], 6)).toThrow(RangeError);
  });

  it("rejects an n that is not an integer", () => {
    expect(() => tribonacci([1, 3, 5], 2.5)).toThrow(TypeError);
    expect(() => tribonacci([1, 3, 5], Number.NaN)).toThrow(TypeError);
  });

  it("rejects a signature holding a NaN", () => {
    expect(() => tribonacci([1, Number.NaN, 3], 5)).toThrow(TypeError);
  });
});
