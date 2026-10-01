"use client";
import { useCoordinates } from "./CoordinatePlane";
import { magnitude, normalize, scale, type Vec2 } from "@/math/vector";
import { spanDimension } from "@/math/basis";
export function SpanRegion({ u, v }: { u: Vec2; v: Vec2 }) {
  const { toSvg, bounds } = useCoordinates();
  const dimension = spanDimension(u, v);
  if (dimension === 2)
    return (
      <rect
        x="36"
        y="36"
        width="528"
        height="528"
        fill="#397462"
        opacity=".055"
        aria-hidden="true"
      />
    );
  const origin = toSvg({ x: 0, y: 0 });
  if (dimension === 0)
    return (
      <circle
        cx={origin.x}
        cy={origin.y}
        r="9"
        fill="#397462"
        opacity=".3"
        aria-hidden="true"
      />
    );
  const direction = normalize(magnitude(u) > 0 ? u : v);
  const reach =
    2 *
    Math.max(
      Math.abs(bounds.xMin),
      Math.abs(bounds.xMax),
      Math.abs(bounds.yMin),
      Math.abs(bounds.yMax),
    );
  const a = toSvg(scale(direction, -reach)),
    b = toSvg(scale(direction, reach));
  return (
    <line
      x1={a.x}
      y1={a.y}
      x2={b.x}
      y2={b.y}
      stroke="#397462"
      strokeWidth="12"
      opacity=".16"
      aria-hidden="true"
    />
  );
}
