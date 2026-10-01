import {
  add,
  magnitude,
  normalize,
  scale,
  subtract,
  type Vec2,
} from "./vector";
import { applyMatrix, determinant, type Mat2 } from "./matrix";
import { spanDimension } from "./basis";

export const dot = (u: Vec2, v: Vec2): number => u.x * v.x + u.y * v.y;
/** A zero vector has no angle. Snap roundoff at ±1 before acos. */
export function angleDegrees(u: Vec2, v: Vec2): number | null {
  if (magnitude(u) === 0 || magnitude(v) === 0) return null;
  const cosine = Math.max(-1, Math.min(1, dot(normalize(u), normalize(v))));
  if (Math.abs(1 - Math.abs(cosine)) < 1e-12) return cosine < 0 ? 180 : 0;
  return (Math.acos(cosine) * 180) / Math.PI;
}
/** Projection onto the zero vector has no defined direction. */
export function project(v: Vec2, onto: Vec2): Vec2 | null {
  if (magnitude(onto) === 0) return null;
  const unit = normalize(onto);
  return scale(unit, dot(v, unit));
}
export const columns = (m: Mat2): readonly [Vec2, Vec2] => [
  { x: m.a, y: m.c },
  { x: m.b, y: m.d },
];
export const rank = (m: Mat2): 0 | 1 | 2 => spanDimension(...columns(m));
/** The relative rank tolerance is shared with the span lesson. */
export function inverse(m: Mat2): Mat2 | null {
  if (rank(m) !== 2) return null;
  const det = determinant(m);
  return { a: m.d / det, b: -m.b / det, c: -m.c / det, d: m.a / det };
}
export function nullBasis(m: Mat2): Vec2[] {
  if (rank(m) === 2) return [];
  if (rank(m) === 0)
    return [
      { x: 1, y: 0 },
      { x: 0, y: 1 },
    ];
  const row =
    Math.hypot(m.a, m.b) >= Math.hypot(m.c, m.d)
      ? { x: m.a, y: m.b }
      : { x: m.c, y: m.d };
  return [normalize({ x: -row.y, y: row.x })];
}
export type LinearSolution =
  | { kind: "unique"; particular: Vec2 }
  | { kind: "infinite"; particular: Vec2; kernel: Vec2[] }
  | { kind: "none" };
export function solve(m: Mat2, target: Vec2): LinearSolution {
  const inv = inverse(m);
  if (inv) return { kind: "unique", particular: applyMatrix(inv, target) };
  const kernel = nullBasis(m);
  if (rank(m) === 0) {
    return magnitude(target) === 0
      ? { kind: "infinite", particular: { x: 0, y: 0 }, kernel }
      : { kind: "none" };
  }
  const useFirst = Math.hypot(m.a, m.b) >= Math.hypot(m.c, m.d);
  const row = useFirst ? { x: m.a, y: m.b } : { x: m.c, y: m.d };
  const particular = scale(
    normalize(row),
    (useFirst ? target.x : target.y) / magnitude(row),
  );
  const error = magnitude(subtract(applyMatrix(m, particular), target));
  return error <= 1e-9 * Math.max(1, magnitude(target))
    ? { kind: "infinite", particular, kernel }
    : { kind: "none" };
}
export function cramer(m: Mat2, target: Vec2): Vec2 | null {
  if (rank(m) !== 2) return null;
  const det = determinant(m);
  return {
    x: determinant({ ...m, a: target.x, c: target.y }) / det,
    y: determinant({ ...m, b: target.x, d: target.y }) / det,
  };
}
/** A basis matrix converts basis coordinates to standard coordinates. */
export function changeBasis(map: Mat2, basis: Mat2): Mat2 | null {
  const inv = inverse(basis);
  if (!inv) return null;
  const [u, v] = columns(basis).map((column) =>
    applyMatrix(inv, applyMatrix(map, column)),
  );
  return { a: u.x, b: v.x, c: u.y, d: v.y };
}
export type EigenResult =
  | { kind: "complex"; real: number; imaginary: number }
  | { kind: "real"; spaces: { value: number; basis: Vec2[] }[] };
export function eigen(m: Mat2): EigenResult {
  // (a-d)^2 + 4bc avoids subtracting two large trace/determinant terms.
  const discriminant = (m.a - m.d) ** 2 + 4 * m.b * m.c;
  const size = Math.max(
    Math.abs(m.a),
    Math.abs(m.b),
    Math.abs(m.c),
    Math.abs(m.d),
  );
  const tolerance = 1e-10 * size * size;
  const center = (m.a + m.d) / 2;
  if (discriminant < -tolerance) {
    return {
      kind: "complex",
      real: center,
      imaginary: Math.sqrt(-discriminant) / 2,
    };
  }
  const repeated = Math.abs(discriminant) <= tolerance;
  const values = repeated
    ? [center]
    : [
        center + Math.sqrt(discriminant) / 2,
        center - Math.sqrt(discriminant) / 2,
      ];
  return {
    kind: "real",
    spaces: values.map((value) => {
      const shifted = { ...m, a: m.a - value, d: m.d - value };
      // Rounding can leave a tiny residual for an exactly scalar matrix.
      if (
        Math.max(
          Math.abs(shifted.a),
          Math.abs(shifted.b),
          Math.abs(shifted.c),
          Math.abs(shifted.d),
        ) <=
        1e-10 * size
      ) {
        return {
          value,
          basis: [
            { x: 1, y: 0 },
            { x: 0, y: 1 },
          ],
        };
      }
      const row =
        Math.hypot(shifted.a, shifted.b) >= Math.hypot(shifted.c, shifted.d)
          ? { x: shifted.a, y: shifted.b }
          : { x: shifted.c, y: shifted.d };
      return { value, basis: [normalize({ x: -row.y, y: row.x })] };
    }),
  };
}
/** Nonzero inputs only: the zero vector is never an eigenvector. */
export function eigenResidual(
  m: Mat2,
  v: Vec2,
): { value: number; error: number } | null {
  if (magnitude(v) === 0) return null;
  const unit = normalize(v);
  const image = applyMatrix(m, unit);
  const value = dot(unit, image);
  return { value, error: magnitude(subtract(image, scale(unit, value))) };
}

export type Vec3 = Readonly<{ x: number; y: number; z: number }>;
export const add3 = (u: Vec3, v: Vec3): Vec3 => ({
  x: u.x + v.x,
  y: u.y + v.y,
  z: u.z + v.z,
});
export const dot3 = (u: Vec3, v: Vec3): number =>
  u.x * v.x + u.y * v.y + u.z * v.z;
export const magnitude3 = (v: Vec3): number => Math.hypot(v.x, v.y, v.z);
export const cross = (u: Vec3, v: Vec3): Vec3 => ({
  x: u.y * v.z - u.z * v.y,
  y: u.z * v.x - u.x * v.z,
  z: u.x * v.y - u.y * v.x,
});
export type Mat3 = readonly [
  readonly [number, number, number],
  readonly [number, number, number],
  readonly [number, number, number],
];
export const crossMatrix = (u: Vec3): Mat3 => [
  [0, -u.z, u.y],
  [u.z, 0, -u.x],
  [-u.y, u.x, 0],
];
export function applyMatrix3(m: Mat3, v: Vec3): Vec3 {
  const entry = (row: readonly number[]) =>
    row[0] * v.x + row[1] * v.y + row[2] * v.z;
  return { x: entry(m[0]), y: entry(m[1]), z: entry(m[2]) };
}
/** An oblique projection for display only; projected lengths/angles are not 3D measurements. */
export const project3 = (v: Vec3): Vec2 => ({
  x: 0.85 * (v.x - v.y),
  y: v.z - 0.45 * (v.x + v.y),
});

/** Coordinates in the ordered basis (1, t, t²) of P₂. */
export type Polynomial = readonly [number, number, number];
export const evaluatePolynomial = (p: Polynomial, t: number): number =>
  p[0] + t * (p[1] + t * p[2]);
export const combinePolynomials = (
  p: Polynomial,
  q: Polynomial,
  a: number,
  b: number,
): Polynomial => [
  a * p[0] + b * q[0],
  a * p[1] + b * q[1],
  a * p[2] + b * q[2],
];
/** Embed the P₁ output into P₂ by giving its quadratic coefficient zero. */
export const derivative = (p: Polynomial): Polynomial => [p[1], 2 * p[2], 0];
export const sumWithNull = (
  particular: Vec2,
  direction: Vec2,
  t: number,
): Vec2 => add(particular, scale(direction, t));
