"use client";
import { useCoordinates } from "./CoordinatePlane";
export function Grid({ step = 1 }: { step?: number }) {
  const { bounds, toSvg } = useCoordinates();
  const lines = [];
  if (!Number.isFinite(step) || step <= 0)
    throw new Error("Grid step must be positive");
  for (
    let x = Math.ceil(bounds.xMin / step) * step;
    x <= bounds.xMax;
    x += step
  ) {
    const p = toSvg({ x, y: 0 });
    lines.push(
      <g key={"x" + x}>
        <line
          x1={p.x}
          x2={p.x}
          y1={toSvg({ x, y: bounds.yMax }).y}
          y2={toSvg({ x, y: bounds.yMin }).y}
          className={x === 0 ? "axis" : "grid-line"}
        />
        {x !== 0 && (
          <text x={p.x} y={p.y + 19} textAnchor="middle" className="tick">
            {x}
          </text>
        )}
      </g>,
    );
  }
  for (
    let y = Math.ceil(bounds.yMin / step) * step;
    y <= bounds.yMax;
    y += step
  ) {
    const p = toSvg({ x: 0, y });
    lines.push(
      <g key={"y" + y}>
        <line
          y1={p.y}
          y2={p.y}
          x1={toSvg({ x: bounds.xMin, y }).x}
          x2={toSvg({ x: bounds.xMax, y }).x}
          className={y === 0 ? "axis" : "grid-line"}
        />
        {y !== 0 && (
          <text x={p.x - 13} y={p.y + 4} textAnchor="end" className="tick">
            {y}
          </text>
        )}
      </g>,
    );
  }
  return (
    <g aria-hidden="true">
      {lines}
      <text
        x={toSvg({ x: bounds.xMax, y: 0 }).x + 10}
        y={toSvg({ x: 0, y: 0 }).y + 5}
        className="axis-label"
      >
        x
      </text>
      <text
        x={toSvg({ x: 0, y: 0 }).x - 5}
        y={toSvg({ x: 0, y: bounds.yMax }).y - 13}
        className="axis-label"
      >
        y
      </text>
    </g>
  );
}
