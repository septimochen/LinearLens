"use client";
import { type PointerEvent } from "react";
import type { Vec2 } from "@/math/vector";
import { useCoordinates } from "./CoordinatePlane";
const clamp = (n: number) => Math.max(-4, Math.min(4, n));
export function DragTip({
  value,
  onChange,
  name,
  tone,
}: {
  value: Vec2;
  onChange: (v: Vec2) => void;
  name: string;
  tone?: "v" | "w";
}) {
  const { toSvg, fromSvg } = useCoordinates();
  const p = toSvg(value);
  function move(event: PointerEvent<SVGCircleElement>) {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    const svg = event.currentTarget.ownerSVGElement!;
    const matrix = svg.getScreenCTM();
    if (!matrix) return;
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(
      matrix.inverse(),
    );
    const next = fromSvg(point);
    onChange({
      x: clamp(Math.round(next.x * 2) / 2),
      y: clamp(Math.round(next.y * 2) / 2),
    });
  }
  return (
    <circle
      cx={p.x}
      cy={p.y}
      r="15"
      className={"drag-tip tip-" + (tone ?? (name === "w" ? "w" : "v"))}
      aria-hidden="true"
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerMove={move}
      onPointerUp={(event) =>
        event.currentTarget.releasePointerCapture(event.pointerId)
      }
    >
      <title>{`Drag ${name}; numeric controls are also available`}</title>
    </circle>
  );
}
export function VectorControls({
  name,
  tone,
  value,
  onChange,
}: {
  name: string;
  tone?: "v" | "w";
  value: Vec2;
  onChange: (v: Vec2) => void;
}) {
  return (
    <fieldset
      className={
        "vector-controls controls-" + (tone ?? (name === "w" ? "w" : "v"))
      }
    >
      <legend>
        <span className="legend-dot" />
        Vector <i>{name}</i>
        <span className="coordinate-value">
          ({value.x}, {value.y})
        </span>
      </legend>
      {(["x", "y"] as const).map((axis) => (
        <div className="control-row" key={axis}>
          <label htmlFor={name + axis}>{axis}</label>
          <input
            aria-label={name + " " + axis + " component slider"}
            type="range"
            min="-4"
            max="4"
            step="0.5"
            value={value[axis]}
            onChange={(e) =>
              onChange({ ...value, [axis]: Number(e.target.value) })
            }
          />
          <input
            id={name + axis}
            aria-label={name + " " + axis + " component"}
            type="number"
            min="-4"
            max="4"
            step="0.5"
            value={value[axis]}
            onChange={(e) => {
              if (Number.isFinite(e.target.valueAsNumber))
                onChange({ ...value, [axis]: clamp(e.target.valueAsNumber) });
            }}
          />
        </div>
      ))}
    </fieldset>
  );
}
