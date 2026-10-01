"use client";
import { type ReactNode, useId } from "react";
import {
  CoordinatePlane,
  useCoordinates,
} from "@/components/math/CoordinatePlane";
import { add, type Vec2 } from "@/math/vector";

export function Lab({
  title,
  subtitle,
  reset,
  presets,
  visual,
  controls,
  equations,
  challenge,
  success,
}: {
  title: string;
  subtitle: string;
  reset: () => void;
  presets: { label: string; action: () => void }[];
  visual: ReactNode;
  controls: ReactNode;
  equations: ReactNode;
  challenge: { title: string; text: string; hint: string };
  success: boolean;
}) {
  return (
    <section id="playground" className="playground advanced-lab">
      <div className="playground-top">
        <div>
          <span className="eyebrow">{subtitle}</span>
          <h2>{title}</h2>
        </div>
        <button className="reset-button" onClick={reset}>
          ↺ Reset
        </button>
      </div>
      <div className="lab-body">
        <div className="visual-panel">
          <div className="preset-row">
            {presets.map((p) => (
              <button key={p.label} className="reset-button" onClick={p.action}>
                {p.label}
              </button>
            ))}
          </div>
          {visual}
        </div>
        <aside className="control-panel">{controls}</aside>
      </div>
      <div className="equation-strip">{equations}</div>
      <div className={"challenge " + (success ? "challenge-success" : "")}>
        <div>
          <span className="eyebrow">A SMALL CHALLENGE</span>
          <h3>{challenge.title}</h3>
          <p>{challenge.text}</p>
        </div>
        <span className="challenge-status" role="status">
          {success ? "✓ Challenge complete!" : challenge.hint}
        </span>
      </div>
    </section>
  );
}
export function Plane({
  points,
  label,
  children,
}: {
  points: readonly Vec2[];
  label: string;
  children: ReactNode;
}) {
  const extent = Math.max(
    4,
    ...points.flatMap((p) => [Math.abs(p.x) + 1.5, Math.abs(p.y) + 1.5]),
  );
  return (
    <CoordinatePlane
      bounds={{ xMin: -extent, xMax: extent, yMin: -extent, yMax: extent }}
      gridStep={Math.ceil(extent / 6)}
      label={label}
    >
      {children}
    </CoordinatePlane>
  );
}
export function Area({
  u,
  v,
  tone = "var(--orange)",
}: {
  u: Vec2;
  v: Vec2;
  tone?: string;
}) {
  const { toSvg } = useCoordinates();
  const points = [{ x: 0, y: 0 }, u, add(u, v), v]
    .map(toSvg)
    .map((p) => `${p.x},${p.y}`)
    .join(" ");
  return (
    <polygon
      points={points}
      fill={tone}
      fillOpacity=".14"
      stroke={tone}
      strokeWidth="2"
      aria-label="Parallelogram spanned by the displayed vectors"
    />
  );
}
export function Segment({
  from,
  to,
  dashed = false,
  tone = "var(--purple)",
}: {
  from: Vec2;
  to: Vec2;
  dashed?: boolean;
  tone?: string;
}) {
  const { toSvg } = useCoordinates();
  const a = toSvg(from),
    b = toSvg(to);
  return (
    <line
      x1={a.x}
      y1={a.y}
      x2={b.x}
      y2={b.y}
      stroke={tone}
      strokeWidth="2"
      strokeDasharray={dashed ? "6 5" : undefined}
    />
  );
}
/** Independent SVG for 3D projections, without misleading 2D coordinate ticks. */
export function SpatialPlot({
  vectors,
  polygon,
  extent,
  children,
}: {
  vectors: { value: Vec2; label: string; tone: string; dashed?: boolean }[];
  polygon: Vec2[];
  extent: number;
  children?: ReactNode;
}) {
  const id = useId().replaceAll(":", "");
  const point = (v: Vec2) => ({
    x: 300 + (v.x * 235) / extent,
    y: 300 - (v.y * 235) / extent,
  });
  const axes = [
    { x: 0.85, y: -0.45 },
    { x: -0.85, y: -0.45 },
    { x: 0, y: 1 },
  ];
  return (
    <svg
      className="coordinate-plane"
      viewBox="0 0 600 600"
      role="img"
      aria-label="Oblique projection of 3D vectors and their spanned parallelogram"
    >
      <defs>
        <marker
          id={id}
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto"
        >
          <path d="M0 0 L10 5 L0 10z" fill="context-stroke" />
        </marker>
      </defs>
      {axes.map((axis, i) => {
        const p = point({
            x: axis.x * extent * 0.85,
            y: axis.y * extent * 0.85,
          }),
          n = point({ x: -axis.x * extent * 0.85, y: -axis.y * extent * 0.85 });
        return (
          <g key={i}>
            <line
              x1={n.x}
              y1={n.y}
              x2={p.x}
              y2={p.y}
              stroke="var(--axis)"
              strokeDasharray="4 5"
            />
            <text x={p.x + 10} y={p.y} fill="var(--tick)" fontSize="18">
              {["x", "y", "z"][i]}
            </text>
          </g>
        );
      })}
      <polygon
        points={polygon
          .map(point)
          .map((p) => `${p.x},${p.y}`)
          .join(" ")}
        fill="var(--orange)"
        fillOpacity=".15"
        stroke="var(--orange)"
      />
      {vectors.map((v) => {
        const p = point(v.value);
        return (
          <g key={v.label}>
            <line
              x1="300"
              y1="300"
              x2={p.x}
              y2={p.y}
              stroke={v.tone}
              strokeWidth="3"
              strokeDasharray={v.dashed ? "6 5" : undefined}
              markerEnd={p.x === 300 && p.y === 300 ? undefined : `url(#${id})`}
            />
            <circle cx={p.x} cy={p.y} r="3" fill={v.tone} />
            <text
              x={p.x + 10}
              y={p.y - 10}
              fill={v.tone}
              className="vector-label"
            >
              {v.label}
            </text>
          </g>
        );
      })}
      <circle cx="300" cy="300" r="4" fill="var(--ink)" />
      {children}
    </svg>
  );
}

/** Function graphs use independent axis scales to keep the sampled interval readable. */
export function FunctionPlot({
  curves,
  labels,
}: {
  curves: Vec2[][];
  labels: string[];
}) {
  const extent = Math.max(2, ...curves.flat().map((p) => Math.abs(p.y))) * 1.1;
  const toPoint = (p: Vec2) => ({
    x: 300 + p.x * 110,
    y: 210 - (p.y * 165) / extent,
  });
  const tones = ["var(--green)", "var(--orange)", "var(--purple)"];
  return (
    <svg
      className="function-plot"
      viewBox="0 0 600 420"
      role="img"
      aria-label={`Function graphs of ${labels.join(", ")} on −2 ≤ t ≤ 2. Horizontal and vertical scales differ.`}
    >
      {[-2, -1, 0, 1, 2].map((t) => (
        <g key={t}>
          <line
            x1={300 + t * 110}
            x2={300 + t * 110}
            y1="30"
            y2="380"
            stroke="var(--grid)"
          />
          <text
            x={300 + t * 110}
            y="405"
            textAnchor="middle"
            fill="var(--tick)"
            fontSize="14"
          >
            {t}
          </text>
        </g>
      ))}
      {[-1, -0.5, 0, 0.5, 1].map((f) => {
        const y = 210 - f * 165;
        return (
          <g key={f}>
            <line x1="65" x2="535" y1={y} y2={y} stroke="var(--grid)" />
            <text
              x="55"
              y={y + 5}
              textAnchor="end"
              fill="var(--tick)"
              fontSize="12"
            >
              {Number((f * extent).toFixed(1))}
            </text>
          </g>
        );
      })}
      <line x1="65" x2="535" y1="210" y2="210" stroke="var(--axis)" />
      <line x1="300" x2="300" y1="30" y2="380" stroke="var(--axis)" />
      {curves.map((curve, i) => (
        <polyline
          key={i}
          points={curve
            .map(toPoint)
            .map((p) => `${p.x},${p.y}`)
            .join(" ")}
          fill="none"
          stroke={tones[i]}
          strokeWidth="3"
        >
          <title>{labels[i]}</title>
        </polyline>
      ))}
      <text x="555" y="215" fill="var(--tick)" fontSize="18">
        t
      </text>
      <text x="315" y="25" fill="var(--tick)" fontSize="14">
        value
      </text>
    </svg>
  );
}
