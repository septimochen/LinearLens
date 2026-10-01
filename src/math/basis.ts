import { add, scale, magnitude, type Vec2 } from "./vector";
import { determinant } from "./matrix";
export function linearCombination(
  u: Vec2,
  v: Vec2,
  a: number,
  b: number,
): Vec2 {
  return add(scale(u, a), scale(v, b));
}
/** Relative tolerance avoids mistaking tiny, independent vectors for a line. */
export function spanDimension(u: Vec2, v: Vec2): 0 | 1 | 2 {
  const uLength = magnitude(u),
    vLength = magnitude(v);
  if (uLength === 0 && vLength === 0) return 0;
  if (uLength === 0 || vLength === 0) return 1;
  const signedArea = determinant({
    a: u.x / uLength,
    b: v.x / vLength,
    c: u.y / uLength,
    d: v.y / vLength,
  });
  return Math.abs(signedArea) <= 1e-9 ? 1 : 2;
}
