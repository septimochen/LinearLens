import type { Vec2 } from "./vector";
export type Bounds = { xMin: number; xMax: number; yMin: number; yMax: number };
/** Use the same scale on both axes, and invert y because SVG grows downward. */
export function coordinateSystem(bounds: Bounds, size = 600, padding = 36) {
  const unit =
    (size - 2 * padding) /
    Math.max(bounds.xMax - bounds.xMin, bounds.yMax - bounds.yMin);
  const center = {
    x: (bounds.xMin + bounds.xMax) / 2,
    y: (bounds.yMin + bounds.yMax) / 2,
  };
  return {
    size,
    unit,
    bounds,
    toSvg: (v: Vec2): Vec2 => ({
      x: size / 2 + (v.x - center.x) * unit,
      y: size / 2 - (v.y - center.y) * unit,
    }),
    fromSvg: (v: Vec2): Vec2 => ({
      x: (v.x - size / 2) / unit + center.x,
      y: (size / 2 - v.y) / unit + center.y,
    }),
  };
}
