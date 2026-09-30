"use client";
import type { Vec2 } from "@/math/vector";
import { useCoordinates } from "./CoordinatePlane";
export function Point({ value, label }: { value: Vec2; label?: string }) {
  const { toSvg } = useCoordinates();
  const p = toSvg(value);
  return (
    <g>
      <circle cx={p.x} cy={p.y} r="4" fill="currentColor" />
      {label && (
        <text x={p.x + 10} y={p.y - 10}>
          {label}
        </text>
      )}
    </g>
  );
}
