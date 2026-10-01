"use client";
import { useState } from "react";
import { Lab, Plane, Segment } from "./Lab";
import { VectorControls, DragTip } from "@/components/math/VectorControls";
import { VectorArrow } from "@/components/math/VectorArrow";
import { MathNotation } from "@/components/math/MathNotation";
import { formatNumber, vectorNotation } from "@/components/math/notation";
import { angleDegrees, dot, project } from "@/math/advanced";
import { magnitude, type Vec2 } from "@/math/vector";
export function DotPlayground() {
  const [u, setU] = useState<Vec2>({ x: 3, y: 1 }),
    [v, setV] = useState<Vec2>({ x: 1, y: 3 });
  const product = dot(u, v),
    projection = project(v, u);
  const lengths = magnitude(u) * magnitude(v);
  const angle = angleDegrees(u, v);
  return (
    <Lab
      title="How much points the same way?"
      subtitle="THE DOT PRODUCT LAB"
      reset={() => {
        setU({ x: 3, y: 1 });
        setV({ x: 1, y: 3 });
      }}
      presets={[
        {
          label: "Perpendicular",
          action: () => {
            setU({ x: 2, y: 1 });
            setV({ x: -1, y: 2 });
          },
        },
        {
          label: "Opposite",
          action: () => {
            setU({ x: 2, y: 1 });
            setV({ x: -2, y: -1 });
          },
        },
        { label: "Zero direction", action: () => setU({ x: 0, y: 0 }) },
      ]}
      visual={
        <>
          <Plane
            points={[u, v, ...(projection ? [projection] : [])]}
            label="Two vectors and the orthogonal projection of v onto u"
          >
            <VectorArrow value={u} label="u" />
            <VectorArrow value={v} label="v" variant="w" />
            {projection && (
              <>
                <VectorArrow
                  value={projection}
                  label="projᵤ v"
                  variant="scaled"
                />
                <Segment from={v} to={projection} dashed />
              </>
            )}
            <DragTip name="u" value={u} onChange={setU} />
            <DragTip name="v" tone="w" value={v} onChange={setV} />
          </Plane>
          <div className="plot-footer">
            Purple: projection of v onto u · dashed: perpendicular remainder
          </div>
        </>
      }
      controls={
        <>
          <VectorControls name="u" value={u} onChange={setU} />
          <VectorControls name="v" tone="w" value={v} onChange={setV} />
          <div className="result-card">
            <MathNotation formula={`u\\cdot v=${formatNumber(product)}`} />
            <p role="status">
              {angle === null
                ? "An angle needs two nonzero vectors."
                : `Angle: ${formatNumber(angle)}°. ${Math.abs(product) < 1e-9 ? "The directions are perpendicular." : angle < 1e-6 ? "The vectors point in the same direction." : angle > 180 - 1e-6 ? "The vectors point in opposite directions." : product > 0 ? "The angle is acute." : "The angle is obtuse."}`}
            </p>
            {projection ? (
              <MathNotation
                formula={`\\operatorname{proj}_u v=${vectorNotation(projection)}`}
              />
            ) : (
              <p>
                Projection onto u is undefined because u is zero. The dot
                product is still zero.
              </p>
            )}
          </div>
        </>
      }
      equations={
        <MathNotation
          formula={`u\\cdot v=(${u.x})(${v.x})+(${u.y})(${v.y})=${formatNumber(product)}`}
        />
      }
      challenge={{
        title: "Find a perpendicular pair.",
        text: "Make the dot product zero while keeping both vectors nonzero. Try using a rotated copy of u.",
        hint: "○ Aim for nonzero orthogonal vectors",
      }}
      success={lengths > 1e-6 && Math.abs(product) / lengths < 1e-6}
    />
  );
}
