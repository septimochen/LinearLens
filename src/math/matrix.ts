import type { Vec2 } from "./vector";
/** Row-major entries: columns (a,c) and (b,d) are the images of the standard basis. */
export type Mat2 = Readonly<{ a: number; b: number; c: number; d: number }>;
export const identity: Mat2 = { a: 1, b: 0, c: 0, d: 1 };
export function applyMatrix(matrix: Mat2, vector: Vec2): Vec2 {
  return {
    x: matrix.a * vector.x + matrix.b * vector.y,
    y: matrix.c * vector.x + matrix.d * vector.y,
  };
}
export function determinant(matrix: Mat2): number {
  return matrix.a * matrix.d - matrix.b * matrix.c;
}
/** Intermediate matrices are linear maps too; this path need not be a pure rotation. */
export function interpolateMatrix(from: Mat2, to: Mat2, t: number): Mat2 {
  return {
    a: from.a + (to.a - from.a) * t,
    b: from.b + (to.b - from.b) * t,
    c: from.c + (to.c - from.c) * t,
    d: from.d + (to.d - from.d) * t,
  };
}
