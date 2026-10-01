"use client";
import { useState } from "react";
import { Lab, Plane, Segment } from "./Lab";
import { MatrixControls } from "@/components/math/MatrixControls";
import { VectorControls, DragTip } from "@/components/math/VectorControls";
import { VectorArrow } from "@/components/math/VectorArrow";
import { MathNotation } from "@/components/math/MathNotation";
import { formatNumber } from "@/components/math/notation";
import { applyMatrix, type Mat2 } from "@/math/matrix";
import { eigen, eigenResidual } from "@/math/advanced";
import { scale, type Vec2 } from "@/math/vector";
const initial: Mat2 = { a: 2, b: 0, c: 0, d: 1 };
export function EigenPlayground() {
  const [m, setM] = useState<Mat2>(initial),
    [v, setV] = useState<Vec2>({ x: 1, y: 1 });
  const result = eigen(m),
    image = applyMatrix(m, v),
    residual = eigenResidual(m, v);
  const eigenvector = residual !== null && residual.error < 1e-6;
  const fullPlane =
    result.kind === "real" &&
    result.spaces.some((space) => space.basis.length === 2);
  return (
    <Lab
      title="Find a direction that stays on its line."
      subtitle="THE EIGENVECTOR LAB"
      reset={() => {
        setM(initial);
        setV({ x: 1, y: 1 });
      }}
      presets={[
        { label: "Two stretches", action: () => setM(initial) },
        {
          label: "Tilted eigenvectors",
          action: () => setM({ a: 1, b: 1, c: 1, d: 1 }),
        },
        {
          label: "Quarter turn",
          action: () => setM({ a: 0, b: -1, c: 1, d: 0 }),
        },
        {
          label: "Repeated, one line",
          action: () => setM({ a: 1, b: 1, c: 0, d: 1 }),
        },
        {
          label: "Every direction",
          action: () => setM({ a: 2, b: 0, c: 0, d: 2 }),
        },
        {
          label: "Reflection",
          action: () => setM({ a: -1, b: 0, c: 0, d: 1 }),
        },
      ]}
      visual={
        <>
          <Plane
            points={[v, image]}
            label="A vector, its image and the real eigenspaces"
          >
            {fullPlane ? (
              <rect
                x="36"
                y="36"
                width="528"
                height="528"
                fill="var(--green)"
                opacity=".08"
              />
            ) : (
              result.kind === "real" &&
              result.spaces.map((space, i) => (
                <Segment
                  key={i}
                  from={scale(space.basis[0], -1000)}
                  to={scale(space.basis[0], 1000)}
                  tone="var(--green)"
                  dashed
                />
              ))
            )}
            <VectorArrow value={v} label="v" />
            <VectorArrow value={image} label="Av" variant="scaled" />
            <DragTip name="v" value={v} onChange={setV} />
          </Plane>
          <div className="plot-footer">
            Dashed green: real eigenlines · whole-plane shading: every nonzero
            direction is an eigenvector
          </div>
        </>
      }
      controls={
        <>
          <MatrixControls name="A" value={m} onChange={setM} />
          <VectorControls name="v" value={v} onChange={setV} />
          <div className="result-card">
            {result.kind === "complex" ? (
              <>
                <MathNotation
                  formula={String.raw`\lambda=${formatNumber(result.real)}\pm ${formatNumber(result.imaginary)}i`}
                />
                <p>
                  No real eigenvectors: no real line is preserved by this map.
                </p>
              </>
            ) : (
              result.spaces.map((space, i) => (
                <div key={i}>
                  <MathNotation
                    formula={String.raw`\lambda_${i + 1}=${formatNumber(space.value)}`}
                  />
                  <p>
                    {space.basis.length === 2
                      ? "Eigenspace: the whole plane."
                      : `Eigenline direction: (${formatNumber(space.basis[0].x)}, ${formatNumber(space.basis[0].y)}).`}
                  </p>
                </div>
              ))
            )}
            <p role="status">
              {residual === null
                ? "The zero vector is excluded from the definition of eigenvector."
                : eigenvector
                  ? `v is an eigenvector with eigenvalue ${formatNumber(residual.value)}.`
                  : "v is not an eigenvector: its image leaves its line."}
            </p>
            {residual && (
              <p>
                Best scalar fit: {formatNumber(residual.value)}. Per-unit
                residual: {formatNumber(residual.error)}.
              </p>
            )}
          </div>
        </>
      }
      equations={
        <MathNotation
          formula={String.raw`Av=\lambda v,\quad v\ne 0,\qquad \det(A-\lambda I)=0`}
        />
      }
      challenge={{
        title: "Find an eigenvector away from the axes.",
        text: "Choose a map with an eigenline through a vector whose x and y components are both nonzero. Keep the image on that line.",
        hint: "○ Find a non-axis eigenvector",
      }}
      success={eigenvector && Math.abs(v.x) > 0.1 && Math.abs(v.y) > 0.1}
    />
  );
}
