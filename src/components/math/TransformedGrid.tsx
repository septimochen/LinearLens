"use client";
import { applyMatrix, type Mat2 } from "@/math/matrix";
import { useCoordinates } from "./CoordinatePlane";
export function TransformedGrid({ matrix }: { matrix: Mat2 }) {
  const { toSvg } = useCoordinates();
  const lines = [];
  // Long source segments show the map across the visible plane; the plane clips them.
  for (let i = -12; i <= 12; i++) {
    for (const vertical of [true, false]) {
      const a = toSvg(
        applyMatrix(matrix, vertical ? { x: i, y: -12 } : { x: -12, y: i }),
      );
      const b = toSvg(
        applyMatrix(matrix, vertical ? { x: i, y: 12 } : { x: 12, y: i }),
      );
      lines.push(
        <line
          key={i + String(vertical)}
          x1={a.x}
          y1={a.y}
          x2={b.x}
          y2={b.y}
          stroke="var(--green)"
          strokeWidth={i === 0 ? 1.8 : 1}
          opacity={i === 0 ? 0.6 : 0.25}
        />,
      );
    }
  }
  return <g aria-hidden="true">{lines}</g>;
}
export function TransformedSquare({ matrix }: { matrix: Mat2 }) {
  const { toSvg } = useCoordinates();
  const points = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 0, y: 1 },
  ]
    .map((v) => {
      const p = toSvg(applyMatrix(matrix, v));
      return `${p.x},${p.y}`;
    })
    .join(" ");
  return (
    <polygon
      points={points}
      fill="var(--orange)"
      fillOpacity=".14"
      stroke="var(--orange)"
      strokeWidth="1.5"
      aria-label="Transformed unit square"
    />
  );
}
