"use client";
import { useState } from "react";
import { CoordinatePlane } from "@/components/math/CoordinatePlane";
import { VectorArrow } from "@/components/math/VectorArrow";
import { DragTip, VectorControls } from "@/components/math/VectorControls";
import { MatrixControls } from "@/components/math/MatrixControls";
import {
  TransformedGrid,
  TransformedSquare,
} from "@/components/math/TransformedGrid";
import { ScalarControl } from "@/components/math/ScalarControl";
import { MathNotation } from "@/components/math/MathNotation";
import { matrixNotation, vectorNotation } from "@/components/math/notation";
import {
  applyMatrix,
  identity,
  interpolateMatrix,
  multiplyMatrices,
  type Mat2,
} from "@/math/matrix";
import type { Vec2 } from "@/math/vector";
const shear: Mat2 = { a: 1, b: 1, c: 0, d: 1 };
const turn: Mat2 = { a: 0, b: -1, c: 1, d: 0 };
const presets = [
  { label: "Shear and turn", a: turn, b: shear },
  {
    label: "Two scales",
    a: { a: 2, b: 0, c: 0, d: 2 },
    b: { a: 0.5, b: 0, c: 0, d: 0.5 },
  },
  { label: "Collapse then shear", a: shear, b: { a: 1, b: 0, c: 0, d: 0 } },
];
function isIdentity(m: Mat2) {
  return (
    Math.abs(m.a - 1) < 1e-6 &&
    Math.abs(m.d - 1) < 1e-6 &&
    Math.abs(m.b) < 1e-6 &&
    Math.abs(m.c) < 1e-6
  );
}
export function CompositionPlayground() {
  const [a, setA] = useState<Mat2>(turn),
    [b, setB] = useState<Mat2>(shear);
  const [v, setV] = useState<Vec2>({ x: 2, y: 1 });
  const [progress, setProgress] = useState(2),
    [reversed, setReversed] = useState(false);
  const first = reversed ? a : b,
    second = reversed ? b : a;
  const order = reversed ? "BA" : "AB",
    firstName = reversed ? "A" : "B",
    secondName = reversed ? "B" : "A";
  const product = multiplyMatrices(second, first);
  // Stage two acts on the already-mapped plane: A_t B, rather than starting over at I.
  const current =
    progress <= 1
      ? interpolateMatrix(identity, first, progress)
      : multiplyMatrices(
          interpolateMatrix(identity, second, progress - 1),
          first,
        );
  const intermediate = applyMatrix(first, v),
    result = applyMatrix(current, v);
  const alternative = applyMatrix(multiplyMatrices(first, second), v);
  const extent = Math.max(
    6,
    ...[v, intermediate, applyMatrix(product, v), alternative].flatMap((p) => [
      Math.abs(p.x) + 2,
      Math.abs(p.y) + 2,
    ]),
  );
  const success = isIdentity(product) && !isIdentity(a) && !isIdentity(b);
  function edit(setter: (m: Mat2) => void, m: Mat2) {
    setter(m);
    setProgress(2);
  }
  return (
    <section id="playground" className="playground">
      <div className="playground-top">
        <div>
          <span className="eyebrow">THE COMPOSITION LAB</span>
          <h2>Two maps. One journey.</h2>
        </div>
        <button
          className="reset-button"
          onClick={() => {
            setA(turn);
            setB(shear);
            setV({ x: 2, y: 1 });
            setProgress(2);
            setReversed(false);
          }}
        >
          ↺ Reset
        </button>
      </div>
      <div className="lab-body">
        <div className="visual-panel">
          <div className="preset-row">
            {presets.map((p) => (
              <button
                className="reset-button"
                key={p.label}
                onClick={() => {
                  setA(p.a);
                  setB(p.b);
                  setProgress(2);
                  setReversed(false);
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
          <div
            className="preset-row"
            role="group"
            aria-label="Composition order"
          >
            <button
              className="reset-button"
              aria-pressed={!reversed}
              onClick={() => {
                setReversed(false);
                setProgress(2);
              }}
            >
              AB · B then A
            </button>
            <button
              className="reset-button"
              aria-pressed={reversed}
              onClick={() => {
                setReversed(true);
                setProgress(2);
              }}
            >
              BA · A then B
            </button>
          </div>
          <CoordinatePlane
            bounds={{
              xMin: -extent,
              xMax: extent,
              yMin: -extent,
              yMax: extent,
            }}
            gridStep={Math.ceil(extent / 8)}
            label={`Coordinate plane showing ${firstName} followed by ${secondName}`}
          >
            <TransformedGrid matrix={current} />
            <TransformedSquare matrix={current} />
            <VectorArrow value={v} variant="v" dashed />
            {progress > 1 && (
              <VectorArrow value={intermediate} variant="w" dashed />
            )}
            <VectorArrow
              value={result}
              variant="scaled"
              label={
                progress === 2
                  ? `${order} v`
                  : progress === 1
                    ? `${firstName} v`
                    : "current"
              }
            />
            <DragTip name="v" value={v} onChange={setV} />
          </CoordinatePlane>
          <div className="plot-footer">
            <span>
              Dashed green: v · orange: {firstName}v · purple: current image
            </span>
            <span>Green grid follows the current map</span>
          </div>
          <div className="animation-controls">
            <div
              className="preset-row"
              role="group"
              aria-label="Transformation stage"
            >
              {["Original", `After ${firstName}`, `After ${secondName}`].map(
                (label, i) => (
                  <button
                    key={label}
                    className="reset-button"
                    aria-pressed={progress === i}
                    onClick={() => setProgress(i)}
                  >
                    {label}
                  </button>
                ),
              )}
            </div>
            <ScalarControl
              label="Journey progress"
              value={Math.round(progress * 100)}
              min={0}
              max={200}
              step={1}
              onChange={(n) => setProgress(n / 100)}
            />
            <p className="interpolation-note">
              0–100% applies {firstName}; 100–200% applies {secondName} to that
              result. Intermediate maps blend linearly; they are not rigid
              rotations.
            </p>
          </div>
        </div>
        <aside className="control-panel">
          <span className="eyebrow">READ FROM RIGHT TO LEFT</span>
          <h3>
            {firstName} first. {secondName} second.
          </h3>
          <p>Edit either matrix. The full composition updates immediately.</p>
          <div className="composition-editors">
            <MatrixControls
              name="A"
              value={a}
              onChange={(m) => edit(setA, m)}
            />
            <MatrixControls
              name="B"
              value={b}
              onChange={(m) => edit(setB, m)}
            />
          </div>
          <VectorControls name="v" value={v} onChange={setV} />
          <div className="result-card">
            <span className="eyebrow">THE JOURNEY OF v</span>
            <MathNotation
              formula={`\\mathbf v=${vectorNotation(v)}\\;\\xrightarrow{${firstName}}\\;${vectorNotation(intermediate)}\\;\\xrightarrow{${secondName}}\\;${vectorNotation(applyMatrix(product, v))}`}
            />
            <p>
              Current image: ({Number(result.x.toFixed(2))},{" "}
              {Number(result.y.toFixed(2))})
            </p>
            <p>
              The other order sends this vector to ({alternative.x},{" "}
              {alternative.y}). Compare the matrices too: one shared destination
              does not imply identical maps.
            </p>
          </div>
        </aside>
      </div>
      <div className="equation-strip">
        <MathNotation
          formula={`${order}=${matrixNotation(second)}${matrixNotation(first)}=${matrixNotation(product)}`}
        />
        <MathNotation
          formula={`${order}\\mathbf v=${secondName}(${firstName}\\mathbf v)`}
        />
      </div>
      <div className="composition-columns">
        <span className="eyebrow">FOLLOW THE BASIS</span>
        <p>The product’s columns are the final destinations of e₁ and e₂.</p>
        <MathNotation
          formula={`${order}e_1=${vectorNotation(applyMatrix(product, { x: 1, y: 0 }))},\\qquad ${order}e_2=${vectorNotation(applyMatrix(product, { x: 0, y: 1 }))}`}
        />
      </div>
      <div className={"challenge " + (success ? "challenge-success" : "")}>
        <div>
          <span className="eyebrow">A SMALL CHALLENGE</span>
          <h3>Make two maps undo each other.</h3>
          <p>
            Choose two matrices, neither equal to identity, whose product is
            identity. Check more than one vector: every arrow should return
            home.
          </p>
        </div>
        <span className="challenge-status" role="status">
          {success
            ? "✓ Every vector returns home!"
            : "○ Aim for the identity product"}
        </span>
      </div>
    </section>
  );
}
