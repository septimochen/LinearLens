"use client";
import { useState } from "react";
import { Lab, Plane } from "./Lab";
import { MatrixControls } from "@/components/math/MatrixControls";
import {
  TransformedGrid,
  TransformedSquare,
} from "@/components/math/TransformedGrid";
import { VectorArrow } from "@/components/math/VectorArrow";
import { MathNotation } from "@/components/math/MathNotation";
import { matrixNotation, formatNumber } from "@/components/math/notation";
import { determinant, identity, type Mat2 } from "@/math/matrix";
import { columns, rank } from "@/math/advanced";
import { add } from "@/math/vector";
const initial: Mat2 = { a: 1, b: 1, c: 0, d: 1 };
const presets = [
  { label: "Shear", matrix: initial },
  { label: "Double area", matrix: { a: 2, b: 0, c: 0, d: 1 } },
  { label: "Reflection", matrix: { a: -1, b: 0, c: 0, d: 1 } },
  { label: "Collapse", matrix: { a: 1, b: 2, c: 0.5, d: 1 } },
  { label: "Identity", matrix: identity },
];
export function DeterminantPlayground() {
  const [m, setM] = useState<Mat2>(initial);
  const det = determinant(m),
    [u, v] = columns(m);
  return (
    <Lab
      title="Measure what happens to area."
      subtitle="THE DETERMINANT LAB"
      reset={() => setM(initial)}
      presets={presets.map((p) => ({
        label: p.label,
        action: () => setM(p.matrix),
      }))}
      visual={
        <>
          <Plane
            points={[u, v, add(u, v)]}
            label="Transformed grid and unit square showing area scaling"
          >
            <TransformedGrid matrix={m} />
            <TransformedSquare matrix={m} />
            <VectorArrow value={u} label="Ae₁" />
            <VectorArrow value={v} label="Ae₂" variant="w" />
          </Plane>
          <div className="plot-footer">
            Orange: image of a unit square · arrows: ordered basis images
          </div>
        </>
      }
      controls={
        <>
          <h3>Signed area, live.</h3>
          <p>Edit the columns. The unit square becomes a parallelogram.</p>
          <MatrixControls name="A" value={m} onChange={setM} />
          <div className="result-card">
            <MathNotation
              formula={`\\det A=${formatNumber(det)},\\quad \\text{area}=${formatNumber(Math.abs(det))}`}
            />
            <p role="status">
              {rank(m) < 2
                ? "The columns are dependent (within numerical tolerance): the area collapses."
                : det < 0
                  ? "Orientation reverses: the ordered basis turns clockwise."
                  : "Orientation is preserved: the ordered basis turns counterclockwise."}
            </p>
            <p>
              A determinant of 1 preserves area; it can still change lengths and
              angles.
            </p>
          </div>
        </>
      }
      equations={
        <MathNotation
          formula={`\\det ${matrixNotation(m)}=(${m.a})(${m.d})-(${m.b})(${m.c})=${formatNumber(det)}`}
        />
      }
      challenge={{
        title: "Double area and reverse orientation.",
        text: "Make the signed determinant −2. A reflection and a stretch can work together.",
        hint: "○ Aim for det A = −2",
      }}
      success={Math.abs(det + 2) < 1e-6}
    />
  );
}
