"use client";
import { useState } from "react";
import { Lab, Plane } from "./Lab";
import { MatrixControls } from "@/components/math/MatrixControls";
import { VectorControls, DragTip } from "@/components/math/VectorControls";
import { ScalarControl } from "@/components/math/ScalarControl";
import { VectorArrow } from "@/components/math/VectorArrow";
import { SpanRegion } from "@/components/math/SpanRegion";
import { MathNotation } from "@/components/math/MathNotation";
import { matrixNotation, vectorNotation } from "@/components/math/notation";
import { applyMatrix, type Mat2 } from "@/math/matrix";
import {
  columns,
  inverse,
  nullBasis,
  rank,
  solve,
  sumWithNull,
} from "@/math/advanced";
import { magnitude, type Vec2 } from "@/math/vector";
const initial: Mat2 = { a: 1, b: 1, c: 0, d: 1 };
export function InversePlayground() {
  const [m, setM] = useState<Mat2>(initial),
    [target, setTarget] = useState<Vec2>({ x: 2, y: 1 }),
    [t, setT] = useState(0);
  const solution = solve(m, target),
    inv = inverse(m),
    kernel = nullBasis(m),
    [u, v] = columns(m);
  const input =
    solution.kind === "none"
      ? null
      : solution.kind === "infinite"
        ? sumWithNull(solution.particular, kernel[0], t)
        : solution.particular;
  const image = input && applyMatrix(m, input);
  return (
    <Lab
      title="Can this map be undone?"
      subtitle="THE INVERSE & SPACES LAB"
      reset={() => {
        setM(initial);
        setTarget({ x: 2, y: 1 });
        setT(0);
      }}
      presets={[
        {
          label: "Invertible shear",
          action: () => {
            setM(initial);
            setTarget({ x: 2, y: 1 });
            setT(0);
          },
        },
        {
          label: "Many solutions",
          action: () => {
            setM({ a: 1, b: 1, c: 0, d: 0 });
            setTarget({ x: 2, y: 0 });
            setT(0);
          },
        },
        {
          label: "No solution",
          action: () => {
            setM({ a: 1, b: 1, c: 0, d: 0 });
            setTarget({ x: 2, y: 1 });
            setT(0);
          },
        },
        {
          label: "Zero map",
          action: () => {
            setM({ a: 0, b: 0, c: 0, d: 0 });
            setTarget({ x: 0, y: 0 });
            setT(0);
          },
        },
      ]}
      visual={
        <>
          <Plane
            points={[u, v, target, ...(input ? [input] : [])]}
            label="Column space, target, a preimage and null directions"
          >
            <SpanRegion u={u} v={v} />
            <VectorArrow value={u} label="column 1" />
            <VectorArrow value={v} label="column 2" variant="w" />
            <VectorArrow value={target} label="b" variant="scaled" />
            {input && <VectorArrow value={input} label="x" dashed />}
            {kernel.map((n, i) => (
              <VectorArrow
                key={i}
                value={n}
                label={`n${i + 1}`}
                variant="w"
                dashed
              />
            ))}
            <DragTip name="b" value={target} onChange={setTarget} />
          </Plane>
          <div className="plot-footer">
            Shading: output column space · dashed x and n: input-space vectors,
            overlaid for comparison
          </div>
        </>
      }
      controls={
        <>
          <MatrixControls name="A" value={m} onChange={setM} />
          <VectorControls name="b" value={target} onChange={setTarget} />
          {solution.kind === "infinite" && (
            <ScalarControl
              label="Move along first null direction"
              value={t}
              onChange={setT}
            />
          )}
          <div className="result-card">
            <p role="status">
              {solution.kind === "unique"
                ? "Exactly one preimage. This map has an inverse."
                : solution.kind === "none"
                  ? "No preimage: b lies outside the column space."
                  : "Infinitely many preimages. Add any null-space vector."}
            </p>
            <MathNotation
              formula={`\\operatorname{rank}A=${rank(m)},\\quad\\dim\\ker A=${kernel.length}`}
            />
            {inv ? (
              <MathNotation formula={`A^{-1}=${matrixNotation(inv)}`} />
            ) : (
              <p>No inverse exists for this matrix.</p>
            )}
            {input && (
              <MathNotation
                formula={`x=${vectorNotation(input)},\\quad Ax=${vectorNotation(image!)}`}
              />
            )}
            {kernel.map((n, i) => (
              <MathNotation
                key={i}
                formula={`n_${i + 1}=${vectorNotation(n)},\\quad An_${i + 1}=${vectorNotation(applyMatrix(m, n))}`}
              />
            ))}
            {kernel.length === 2 && (
              <p>
                The zero map has the whole plane as its null space. The slider
                explores one of its two independent directions.
              </p>
            )}
          </div>
        </>
      }
      equations={
        <MathNotation
          formula={
            input
              ? `A x=${vectorNotation(image!)}=b`
              : "b\\notin\\operatorname{col}A"
          }
        />
      }
      challenge={{
        title: "Make a family of preimages.",
        text: "Choose a rank-one matrix and a nonzero reachable b. Move the null-direction slider without changing Ax.",
        hint: "○ Reach a nonzero b with rank 1",
      }}
      success={
        rank(m) === 1 &&
        solution.kind === "infinite" &&
        magnitude(target) > 1e-6 &&
        Math.abs(t) > 0.1
      }
    />
  );
}
