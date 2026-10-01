import { expect, it } from "vitest";
import { linearCombination, spanDimension } from "./basis";
it("forms linear combinations including negative and zero coefficients", () => {
  expect(linearCombination({ x: 2, y: 0 }, { x: 1, y: 2 }, -0.25, 1.5)).toEqual(
    { x: 1, y: 3 },
  );
  expect(linearCombination({ x: 2, y: 0 }, { x: 1, y: 2 }, 0, 0)).toEqual({
    x: 0,
    y: 0,
  });
});
it("distinguishes a plane, line and point", () => {
  expect(spanDimension({ x: 2, y: 0 }, { x: 1, y: 2 })).toBe(2);
  expect(spanDimension({ x: 1, y: 2 }, { x: -2, y: -4 })).toBe(1);
  expect(spanDimension({ x: 0, y: 0 }, { x: 1, y: 0 })).toBe(1);
  expect(spanDimension({ x: 0, y: 0 }, { x: 0, y: 0 })).toBe(0);
});
it("classifies small independent vectors and near-collinear directions", () => {
  expect(spanDimension({ x: 1e-12, y: 0 }, { x: 0, y: 1e-12 })).toBe(2);
  expect(spanDimension({ x: 1, y: 0 }, { x: 2, y: 1e-12 })).toBe(1);
});
