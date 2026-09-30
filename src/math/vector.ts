/** A displacement in a two-dimensional coordinate system. */
export type Vec2 = Readonly<{ x: number; y: number }>;
export const add = (a: Vec2, b: Vec2): Vec2 => ({ x: a.x + b.x, y: a.y + b.y });
export const subtract = (a: Vec2, b: Vec2): Vec2 => ({
  x: a.x - b.x,
  y: a.y - b.y,
});
export const scale = (v: Vec2, scalar: number): Vec2 => ({
  x: v.x * scalar,
  y: v.y * scalar,
});
export const magnitude = (v: Vec2): number => Math.hypot(v.x, v.y);
/** The zero vector has no direction; normalize it to zero instead of returning NaN. */
export function normalize(v: Vec2): Vec2 {
  const length = magnitude(v);
  return length === 0 ? { x: 0, y: 0 } : scale(v, 1 / length);
}
