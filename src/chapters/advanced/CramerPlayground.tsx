"use client";
import { useState } from "react";
import { Lab, Plane, Area } from "./Lab";
import { MatrixControls } from "@/components/math/MatrixControls";
import { VectorControls, DragTip } from "@/components/math/VectorControls";
import { VectorArrow } from "@/components/math/VectorArrow";
import { MathNotation } from "@/components/math/MathNotation";
import { formatNumber, vectorNotation } from "@/components/math/notation";
import { determinant, applyMatrix, type Mat2 } from "@/math/matrix";
import { columns, cramer, solve } from "@/math/advanced";
import { add, type Vec2 } from "@/math/vector";
const initial: Mat2 = { a: 1, b: 1, c: 0, d: 1 };
export function CramerPlayground() {
  const [m, setM] = useState<Mat2>(initial),
    [target, setTarget] = useState<Vec2>({ x: 3, y: 2 }),
    [replacement, setReplacement] = useState<"original" | "x" | "y">(
      "original",
    );
  const det = determinant(m),
    dx = determinant({ ...m, a: target.x, c: target.y }),
    dy = determinant({ ...m, b: target.x, d: target.y });
  const answer = cramer(m, target),
    solution = solve(m, target),
    [u, v] = columns(m);
  const first = replacement === "x" ? target : u,
    second = replacement === "y" ? target : v;
  return (
    <Lab
      title="Solve with signed area ratios."
      subtitle="THE CRAMER LAB"
      reset={() => {
        setM(initial);
        setTarget({ x: 3, y: 2 });
        setReplacement("original");
      }}
      presets={[
        {
          label: "Unique solution",
          action: () => {
            setM(initial);
            setTarget({ x: 3, y: 2 });
          },
        },
        {
          label: "Singular, reachable",
          action: () => {
            setM({ a: 1, b: 2, c: 0.5, d: 1 });
            setTarget({ x: 2, y: 1 });
          },
        },
        {
          label: "Singular, unreachable",
          action: () => {
            setM({ a: 1, b: 2, c: 0.5, d: 1 });
            setTarget({ x: 1, y: 2 });
          },
        },
      ]}
      visual={
        <>
          <div
            className="preset-row"
            role="group"
            aria-label="Column replacement"
          >
            {(["original", "x", "y"] as const).map((mode) => (
              <button
                key={mode}
                className="reset-button"
                aria-pressed={replacement === mode}
                onClick={() => setReplacement(mode)}
              >
                {mode === "original"
                  ? "Original area Δ"
                  : `Replace column ${mode === "x" ? 1 : 2}: Δ${mode}`}
              </button>
            ))}
          </div>
          <Plane
            points={[first, second, add(first, second), target]}
            label="Original or column-replaced parallelogram for Cramer's rule"
          >
            <Area u={first} v={second} />
            <VectorArrow
              value={first}
              label={replacement === "x" ? "b" : "column 1"}
            />
            <VectorArrow
              value={second}
              label={replacement === "y" ? "b" : "column 2"}
              variant="w"
            />
            <VectorArrow value={target} label="b" variant="scaled" dashed />
            <DragTip name="b" value={target} onChange={setTarget} />
          </Plane>
          <div className="plot-footer">
            Displayed signed area:{" "}
            {formatNumber(
              replacement === "x" ? dx : replacement === "y" ? dy : det,
            )}{" "}
            · swap the view to compare numerators
          </div>
        </>
      }
      controls={
        <>
          <MatrixControls name="A" value={m} onChange={setM} />
          <VectorControls name="b" value={target} onChange={setTarget} />
          <div className="result-card">
            <MathNotation
              formula={String.raw`\Delta=${formatNumber(det)},\quad \Delta_x=${formatNumber(dx)},\quad \Delta_y=${formatNumber(dy)}`}
            />
            {answer ? (
              <>
                <MathNotation
                  formula={String.raw`x=\frac{\Delta_x}{\Delta}=${formatNumber(answer.x)},\quad y=\frac{\Delta_y}{\Delta}=${formatNumber(answer.y)}`}
                />
                <MathNotation
                  formula={String.raw`A${vectorNotation(answer)}=${vectorNotation(applyMatrix(m, answer))}`}
                />
              </>
            ) : (
              <p role="status">
                Cramer’s rule needs a nonzero denominator. This system has{" "}
                {solution.kind === "none"
                  ? "no solutions"
                  : "infinitely many solutions"}
                ; use column space to distinguish the cases.
              </p>
            )}
          </div>
        </>
      }
      equations={
        <MathNotation
          formula={String.raw`b=x\,a_1+y\,a_2,\qquad x=\frac{\det[\,b\ a_2\,]}{\det A},\quad y=\frac{\det[\,a_1\ b\,]}{\det A}`}
        />
      }
      challenge={{
        title: "Recover the coefficients (1, −1).",
        text: "Use an invertible A and choose b so the solution has x = 1 and y = −1. Predict b from the columns.",
        hint: "○ Aim for x = 1, y = −1",
      }}
      success={answer !== null && Math.hypot(answer.x - 1, answer.y + 1) < 1e-6}
    />
  );
}
