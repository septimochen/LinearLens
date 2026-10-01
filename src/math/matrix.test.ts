import { describe, expect, it } from "vitest";
import {
  applyMatrix,
  determinant,
  identity,
  interpolateMatrix,
  multiplyMatrices,
} from "./matrix";
describe("linear maps", () => {
  it("preserves vectors under identity", () =>
    expect(applyMatrix(identity, { x: -2, y: 3 })).toEqual({ x: -2, y: 3 }));
  it("uses matrix columns as basis images", () => {
    const matrix = { a: 2, b: -1, c: 3, d: 4 };
    expect(applyMatrix(matrix, { x: 1, y: 0 })).toEqual({ x: 2, y: 3 });
    expect(applyMatrix(matrix, { x: 0, y: 1 })).toEqual({ x: -1, y: 4 });
    expect(applyMatrix(matrix, { x: 2, y: -1 })).toEqual({ x: 5, y: 2 });
  });
  it("handles rotation, reflection and collapse", () => {
    expect(applyMatrix({ a: 0, b: -1, c: 1, d: 0 }, { x: 2, y: 1 })).toEqual({
      x: -1,
      y: 2,
    });
    expect(applyMatrix({ a: -1, b: 0, c: 0, d: 1 }, { x: 2, y: 1 })).toEqual({
      x: -2,
      y: 1,
    });
    expect(applyMatrix({ a: 1, b: 0, c: 0, d: 0 }, { x: 2, y: 1 })).toEqual({
      x: 2,
      y: 0,
    });
  });
  it("preserves addition and scalar multiplication", () => {
    const m = { a: 2, b: 1, c: -1, d: 3 };
    expect(applyMatrix(m, { x: 3, y: 5 })).toEqual({ x: 11, y: 12 });
    const u = applyMatrix(m, { x: 1, y: 2 }),
      v = applyMatrix(m, { x: 2, y: 3 });
    expect({ x: u.x + v.x, y: u.y + v.y }).toEqual({ x: 11, y: 12 });
    expect(applyMatrix(m, { x: 2, y: 4 })).toEqual({ x: 2 * u.x, y: 2 * u.y });
  });
  it("measures signed area and detects collapse", () => {
    expect(determinant({ a: 2, b: 0, c: 0, d: 3 })).toBe(6);
    expect(determinant({ a: -1, b: 0, c: 0, d: 1 })).toBe(-1);
    expect(determinant({ a: 1, b: 2, c: 2, d: 4 })).toBe(0);
  });
  it("interpolates endpoints and midpoint", () => {
    const target = { a: 1, b: 2, c: 0, d: 3 };
    expect(interpolateMatrix(identity, target, 0)).toEqual(identity);
    expect(interpolateMatrix(identity, target, 1)).toEqual(target);
    expect(interpolateMatrix(identity, target, 0.5)).toEqual({
      a: 1,
      b: 1,
      c: 0,
      d: 2,
    });
  });
});

describe("matrix composition", () => {
  const a = { a: 2, b: -1, c: 3, d: 4 };
  const b = { a: 1, b: 2, c: -2, d: 0 };
  it("computes all four row-by-column products", () => {
    expect(multiplyMatrices(a, b)).toEqual({ a: 4, b: 4, c: -5, d: 6 });
  });
  it("matches sequential application, with the right matrix acting first", () => {
    for (const v of [
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: -3, y: 2 },
    ])
      expect(applyMatrix(multiplyMatrices(a, b), v)).toEqual(
        applyMatrix(a, applyMatrix(b, v)),
      );
  });
  it("has identity on either side", () => {
    expect(multiplyMatrices(a, identity)).toEqual(a);
    expect(multiplyMatrices(identity, a)).toEqual(a);
  });
  it("is generally not commutative", () => {
    expect(multiplyMatrices(a, b)).not.toEqual(multiplyMatrices(b, a));
  });
  it("is associative and does not mutate inputs", () => {
    const c = Object.freeze({ a: 0, b: -1, c: 1, d: 0 });
    const left = Object.freeze({ ...a }),
      right = Object.freeze({ ...b });
    expect(multiplyMatrices(multiplyMatrices(left, right), c)).toEqual(
      multiplyMatrices(left, multiplyMatrices(right, c)),
    );
    expect(left).toEqual(a);
    expect(right).toEqual(b);
  });
  it("composes inverse turns and retains a collapse", () => {
    expect(
      multiplyMatrices(
        { a: 0, b: 1, c: -1, d: 0 },
        { a: 0, b: -1, c: 1, d: 0 },
      ),
    ).toEqual(identity);
    expect(multiplyMatrices(a, { a: 1, b: 0, c: 0, d: 0 })).toEqual({
      a: 2,
      b: 0,
      c: 3,
      d: 0,
    });
  });
});
