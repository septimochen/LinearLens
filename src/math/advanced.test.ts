import { describe, expect, it } from "vitest";
import { add, magnitude, scale, subtract, type Vec2 } from "./vector";
import {
  applyMatrix,
  determinant,
  identity,
  multiplyMatrices,
  type Mat2,
} from "./matrix";
import {
  angleDegrees,
  applyMatrix3,
  changeBasis,
  combinePolynomials,
  cramer,
  cross,
  crossMatrix,
  derivative,
  dot,
  dot3,
  eigen,
  eigenResidual,
  evaluatePolynomial,
  inverse,
  magnitude3,
  nullBasis,
  project,
  rank,
  solve,
  type Vec3,
} from "./advanced";
const close = (actual: Vec2, expected: Vec2) => {
  expect(actual.x).toBeCloseTo(expected.x, 9);
  expect(actual.y).toBeCloseTo(expected.y, 9);
};
const matrices: Mat2[] = [
  identity,
  { a: 1, b: 1, c: 0, d: 1 },
  { a: -1, b: 0, c: 0, d: 2 },
  { a: 1, b: -1, c: 1, d: 1 },
  { a: 1e-12, b: 0, c: 0, d: 1e-12 },
];
describe("signed area and inverses", () => {
  it("scales oriented area and composes area factors", () => {
    for (const a of matrices)
      for (const b of matrices)
        expect(determinant(multiplyMatrices(a, b))).toBeCloseTo(
          determinant(a) * determinant(b),
          9,
        );
    expect(determinant({ a: 1, b: 2, c: 2, d: 4 })).toBe(0);
  });
  it("undoes maps on both sides, including very small independent columns", () => {
    for (const m of matrices) {
      const inv = inverse(m)!;
      for (const product of [
        multiplyMatrices(m, inv),
        multiplyMatrices(inv, m),
      ])
        expect(product).toEqual(identity);
      close(applyMatrix(inv, applyMatrix(m, { x: -3, y: 2 })), { x: -3, y: 2 });
      expect(rank(m)).toBe(2);
    }
  });
  it("rejects dependent columns and finds null directions", () => {
    for (const m of [
      { a: 1, b: 2, c: 0.5, d: 1 },
      { a: 0, b: 0, c: 1, d: 2 },
      { a: 0, b: 0, c: 0, d: 0 },
    ]) {
      expect(inverse(m)).toBeNull();
      expect(nullBasis(m).length + rank(m)).toBe(2);
      for (const n of nullBasis(m)) close(applyMatrix(m, n), { x: 0, y: 0 });
    }
  });
});
describe("solution spaces and Cramer’s rule", () => {
  it("recovers unique coefficients and verifies the full equation", () => {
    for (const m of matrices) {
      const x = { x: 1.5, y: -0.5 },
        target = applyMatrix(m, x);
      const solution = solve(m, target);
      expect(solution.kind).toBe("unique");
      if (solution.kind === "unique") close(solution.particular, x);
      close(cramer(m, target)!, x);
    }
  });
  it("distinguishes unreachable targets from infinite affine families", () => {
    const m = { a: 1, b: 2, c: 0.5, d: 1 },
      target = { x: 2, y: 1 };
    const solution = solve(m, target);
    expect(solution.kind).toBe("infinite");
    if (solution.kind === "infinite")
      for (const t of [-3, 0, 4])
        close(
          applyMatrix(
            m,
            add(solution.particular, scale(solution.kernel[0], t)),
          ),
          target,
        );
    expect(solve(m, { x: 1, y: 2 }).kind).toBe("none");
    expect(cramer(m, target)).toBeNull();
  });
  it("handles a zero map and a pivot in the second row", () => {
    const zero = { a: 0, b: 0, c: 0, d: 0 };
    expect(solve(zero, { x: 0, y: 0 })).toMatchObject({
      kind: "infinite",
      kernel: [
        { x: 1, y: 0 },
        { x: 0, y: 1 },
      ],
    });
    expect(solve(zero, { x: 0, y: 0.1 })).toEqual({ kind: "none" });
    const m = { a: 0, b: 0, c: 1, d: 2 },
      solution = solve(m, { x: 0, y: 3 });
    expect(solution.kind).toBe("infinite");
    if (solution.kind === "infinite")
      close(applyMatrix(m, solution.particular), { x: 0, y: 3 });
    expect(solve(m, { x: 1, y: 3 }).kind).toBe("none");
  });
});
describe("dot product and projection", () => {
  it("returns exact endpoint angles despite normalized-coordinate roundoff", () => {
    const u = { x: 2, y: 1 };
    expect(angleDegrees(u, scale(u, -1))).toBe(180);
    expect(angleDegrees(u, scale(u, 3))).toBe(0);
    expect(angleDegrees(u, { x: -1, y: 2 })).toBeCloseTo(90, 9);
    expect(angleDegrees(u, { x: 0, y: 0 })).toBeNull();
    expect(angleDegrees({ x: 1e-12, y: 0 }, { x: 0, y: 1e-12 })).toBe(90);
  });

  it("leaves an orthogonal remainder and is unchanged by rescaling the direction", () => {
    const u = { x: 2, y: 1 },
      v = { x: -1, y: 3 },
      p = project(v, u)!;
    expect(dot(subtract(v, p), u)).toBeCloseTo(0, 9);
    close(project(v, scale(u, -3))!, p);
    close(project(v, { x: 1e-12, y: 0 })!, { x: -1, y: 0 });
    expect(project(v, { x: 0, y: 0 })).toBeNull();
  });
});
describe("3D oriented area and cross maps", () => {
  const u: Vec3 = { x: 1, y: 2, z: -1 },
    v: Vec3 = { x: 3, y: -1, z: 2 };
  it("is perpendicular to both vectors and reverses with order", () => {
    const result = cross(u, v);
    expect(dot3(result, u)).toBe(0);
    expect(dot3(result, v)).toBe(0);
    const reverse = cross(v, u);
    expect(reverse.x).toBe(-result.x);
    expect(reverse.y).toBe(-result.y);
    expect(reverse.z).toBe(-result.z);
    expect(magnitude3(cross({ x: 2, y: 0, z: 0 }, { x: 0, y: 3, z: 0 }))).toBe(
      6,
    );
  });
  it("matches its skew matrix and erases parallel inputs", () => {
    expect(applyMatrix3(crossMatrix(u), v)).toEqual(cross(u, v));
    expect(magnitude3(applyMatrix3(crossMatrix(u), u))).toBe(0);
    expect(magnitude3(cross({ x: 0, y: 0, z: 0 }, v))).toBe(0);
    const m = crossMatrix(u);
    for (let row = 0; row < 3; row++)
      for (let col = 0; col < 3; col++)
        expect(m[row][col] + m[col][row]).toBe(0);
  });
  it("is linear for a fixed first vector", () => {
    const w: Vec3 = { x: -1, y: 0, z: 3 },
      combined = { x: 2 * v.x - w.x, y: 2 * v.y - w.y, z: 2 * v.z - w.z };
    const cv = cross(u, v),
      cw = cross(u, w);
    expect(cross(u, combined)).toEqual({
      x: 2 * cv.x - cw.x,
      y: 2 * cv.y - cw.y,
      z: 2 * cv.z - cw.z,
    });
  });
});
describe("basis translation", () => {
  it("preserves the physical map and determinant", () => {
    const a = { a: 2, b: 1, c: -1, d: 1 };
    for (const b of matrices) {
      const translated = changeBasis(a, b)!;
      close(
        applyMatrix(b, applyMatrix(translated, { x: 2, y: -1 })),
        applyMatrix(a, applyMatrix(b, { x: 2, y: -1 })),
      );
      expect(determinant(translated)).toBeCloseTo(determinant(a), 9);
    }
    expect(changeBasis(a, { a: 1, b: 2, c: 1, d: 2 })).toBeNull();
  });
  it("diagonalizes a map in its eigenbasis", () =>
    expect(
      changeBasis({ a: 1, b: 1, c: 1, d: 1 }, { a: 1, b: -1, c: 1, d: 1 }),
    ).toEqual({ a: 2, b: 0, c: 0, d: 0 }));
});
describe("real and complex eigenstructure", () => {
  it("verifies each computed real eigenspace against Av = λv", () => {
    for (const m of [
      ...matrices.filter((_, i) => i !== 3),
      { a: 1, b: 1, c: 1, d: 1 },
      { a: 1, b: 1, c: 0, d: 1 },
      { a: 0, b: 0, c: 0, d: 0 },
      { a: 0, b: 1, c: 2, d: 0 },
    ]) {
      const result = eigen(m);
      expect(result.kind).toBe("real");
      if (result.kind === "real")
        for (const space of result.spaces)
          for (const v of space.basis) {
            close(applyMatrix(m, v), scale(v, space.value));
            expect(magnitude(v)).toBeCloseTo(1, 9);
          }
    }
  });
  it("distinguishes scalar matrices from defective repeated eigenvalues", () => {
    expect(eigen({ a: 2, b: 0, c: 0, d: 2 })).toMatchObject({
      kind: "real",
      spaces: [
        {
          value: 2,
          basis: [
            { x: 1, y: 0 },
            { x: 0, y: 1 },
          ],
        },
      ],
    });
    const shear = eigen({ a: 1, b: 1, c: 0, d: 1 });
    if (shear.kind === "real") {
      expect(shear.spaces).toHaveLength(1);
      expect(shear.spaces[0].basis).toHaveLength(1);
    }
    expect(eigen({ a: 0, b: -1, c: 1, d: 0 })).toEqual({
      kind: "complex",
      real: 0,
      imaginary: 1,
    });
  });
  it("excludes zero, allows a zero eigenvalue, and detects a changed direction", () => {
    const m = { a: 1, b: 1, c: 1, d: 1 };
    expect(eigenResidual(m, { x: 0, y: 0 })).toBeNull();
    expect(eigenResidual(m, { x: 1, y: -1 })).toEqual({ value: 0, error: 0 });
    expect(eigenResidual(m, { x: 1, y: 0 })!.error).toBe(1);
  });
});
describe("polynomials as vectors", () => {
  it("combines whole functions pointwise and differentiates linearly", () => {
    const p = [1, -2, 3] as const,
      q = [-1, 1, 2] as const;
    const combined = combinePolynomials(p, q, 2, -3);
    for (const t of [-2, -0.5, 0, 1, 2])
      expect(evaluatePolynomial(combined, t)).toBeCloseTo(
        2 * evaluatePolynomial(p, t) - 3 * evaluatePolynomial(q, t),
        9,
      );
    expect(derivative(combined)).toEqual(
      combinePolynomials(derivative(p), derivative(q), 2, -3),
    );
  });
  it("erases constants and maps basis functions to the stated columns", () => {
    expect(derivative([2, 0, 0])).toEqual([0, 0, 0]);
    expect(derivative([0, 1, 0])).toEqual([1, 0, 0]);
    expect(derivative([0, 0, 1])).toEqual([0, 2, 0]);
    expect(combinePolynomials([0, 0, 1], [0, 0, -1], 1, 1)).toEqual([0, 0, 0]);
  });
});
