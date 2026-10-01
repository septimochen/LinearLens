"use client";
import { useState } from "react";
import { Lab, SpatialPlot } from "./Lab";
import { ScalarControl } from "@/components/math/ScalarControl";
import { MathNotation } from "@/components/math/MathNotation";
import { formatNumber } from "@/components/math/notation";
import {
  add3,
  cross,
  crossMatrix,
  dot3,
  magnitude3,
  project3,
  type Vec3,
} from "@/math/advanced";
function Controls3({
  name,
  value,
  onChange,
}: {
  name: string;
  value: Vec3;
  onChange: (v: Vec3) => void;
}) {
  return (
    <fieldset className="vector-controls">
      <legend>3D vector {name}</legend>
      {(["x", "y", "z"] as const).map((axis) => (
        <ScalarControl
          key={axis}
          label={`${name} ${axis}`}
          value={value[axis]}
          min={-3}
          max={3}
          step={0.5}
          onChange={(n) => onChange({ ...value, [axis]: n })}
        />
      ))}
    </fieldset>
  );
}
const notation3 = (v: Vec3) =>
  String.raw`\begin{pmatrix}${formatNumber(v.x)}\\${formatNumber(v.y)}\\${formatNumber(v.z)}\end{pmatrix}`;
const initialU: Vec3 = { x: 2, y: 0, z: 0 },
  initialV: Vec3 = { x: 0, y: 2, z: 0 };
export function CrossPlayground({
  transformation = false,
}: {
  transformation?: boolean;
}) {
  const [u, setU] = useState<Vec3>(initialU),
    [v, setV] = useState<Vec3>(initialV);
  const result = cross(u, v),
    area = magnitude3(result),
    matrix = crossMatrix(u);
  const points = [u, v, result, add3(u, v)].map(project3);
  const extent = Math.max(
    4,
    ...points.flatMap((p) => [Math.abs(p.x) + 1, Math.abs(p.y) + 1]),
  );
  const nonzero = magnitude3(u) > 1e-6 && magnitude3(v) > 1e-6;
  return (
    <Lab
      title={
        transformation ? "Fix u. Map every v." : "An area becomes an arrow."
      }
      subtitle={
        transformation
          ? "THE CROSS TRANSFORMATION LAB"
          : "THE CROSS PRODUCT LAB"
      }
      reset={() => {
        setU(initialU);
        setV(initialV);
      }}
      presets={[
        {
          label: "XY plane",
          action: () => {
            setU(initialU);
            setV(initialV);
          },
        },
        {
          label: "Tilted plane",
          action: () => {
            setU({ x: 1, y: 1, z: 0 });
            setV({ x: 0, y: 1, z: 2 });
          },
        },
        {
          label: "Parallel",
          action: () => {
            setU({ x: 1, y: 1, z: 1 });
            setV({ x: 2, y: 2, z: 2 });
          },
        },
        {
          label: "Swap u and v",
          action: () => {
            setU(v);
            setV(u);
          },
        },
        { label: "Zero u", action: () => setU({ x: 0, y: 0, z: 0 }) },
      ]}
      visual={
        <>
          <SpatialPlot
            extent={extent}
            polygon={[
              project3({ x: 0, y: 0, z: 0 }),
              points[0],
              points[3],
              points[1],
            ]}
            vectors={[
              { value: points[0], label: "u", tone: "var(--green)" },
              { value: points[1], label: "v", tone: "var(--orange)" },
              { value: points[2], label: "u × v", tone: "var(--purple)" },
            ]}
          />
          <div className="plot-footer">
            Oblique 3D projection · projected lengths and angles are distorted.
            Read the actual components and area at right.
          </div>
        </>
      }
      controls={
        <>
          <Controls3 name="u" value={u} onChange={setU} />
          <Controls3 name="v" value={v} onChange={setV} />
          <div className="result-card">
            <MathNotation
              formula={String.raw`u\times v=${notation3(result)}`}
            />
            <p>3D area: {formatNumber(area)} square units.</p>
            <MathNotation
              formula={String.raw`u\cdot(u\times v)=${formatNumber(dot3(u, result))},\quad v\cdot(u\times v)=${formatNumber(dot3(v, result))}`}
            />
            <p role="status">
              {magnitude3(u) === 0
                ? "With u = 0, this is the zero map: rank 0, null space all of R³."
                : area < 1e-9
                  ? "The input vectors are dependent. Their cross product is zero."
                  : "The result is perpendicular to both inputs in 3D."}
            </p>
            {transformation && (
              <>
                <MathNotation
                  formula={String.raw`[u]_\times=\begin{pmatrix}${matrix.map((row) => row.map(formatNumber).join("&")).join(String.raw`\\`)}\end{pmatrix}`}
                />
                <p>
                  For nonzero u: rank 2, null space span(u), and column space
                  the plane perpendicular to u. A parallel input disappears.
                </p>
              </>
            )}
          </div>
        </>
      }
      equations={
        <MathNotation
          formula={
            transformation
              ? String.raw`[u]_\times v=u\times v,\qquad [u]_\times u=0`
              : String.raw`\|u\times v\|=\|u\|\|v\|\sin\theta`
          }
        />
      }
      challenge={
        transformation
          ? {
              title: "Find a nonzero input in the kernel.",
              text: "Keep u nonzero and choose a nonzero parallel v. The output should vanish.",
              hint: "○ Send a nonzero v to zero",
            }
          : {
              title: "Build a unit normal.",
              text: "Choose u and v whose cross product is (0, 0, 1). Order determines the sign.",
              hint: "○ Aim for u × v = (0, 0, 1)",
            }
      }
      success={
        transformation
          ? nonzero && area < 1e-6
          : Math.hypot(result.x, result.y, result.z - 1) < 1e-6
      }
    />
  );
}
