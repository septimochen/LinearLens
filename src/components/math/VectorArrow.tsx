"use client";
import { useId } from "react";
import { add, type Vec2 } from "@/math/vector";
import { useCoordinates } from "./CoordinatePlane";
type Props = {
  start?: Vec2;
  label?: string;
  variant?: "v" | "w" | "sum" | "scaled";
  dashed?: boolean;
} & ({ end: Vec2; value?: never } | { value: Vec2; end?: never });
export function VectorArrow({
  start = { x: 0, y: 0 },
  end,
  value,
  label,
  variant = "v",
  dashed = false,
}: Props) {
  const id = useId().replaceAll(":", "");
  const { toSvg } = useCoordinates();
  const finish = end ?? add(start, value!);
  const a = toSvg(start),
    b = toSvg(finish);
  const zero = a.x === b.x && a.y === b.y;
  return (
    <g
      className={"vector vector-" + variant}
      role="img"
      aria-label={
        label
          ? `${label}: (${start.x}, ${start.y}) to (${finish.x}, ${finish.y})`
          : "Vector"
      }
    >
      <defs>
        <marker
          id={id}
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
        </marker>
      </defs>
      {zero ? (
        <circle cx={b.x} cy={b.y} r="5" fill="currentColor" />
      ) : (
        <line
          x1={a.x}
          y1={a.y}
          x2={b.x}
          y2={b.y}
          stroke="currentColor"
          strokeWidth={dashed ? 2 : 3}
          strokeDasharray={dashed ? "6 5" : undefined}
          markerEnd={`url(#${id})`}
        />
      )}
      {label && (
        <text
          x={b.x + 13}
          y={b.y - 13}
          fill="currentColor"
          className="vector-label"
        >
          {label}
        </text>
      )}
    </g>
  );
}
