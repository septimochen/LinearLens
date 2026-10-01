"use client";
import { useEffect, useState } from "react";
import { CoordinatePlane } from "@/components/math/CoordinatePlane";
import { VectorArrow } from "@/components/math/VectorArrow";
import { DragTip, VectorControls } from "@/components/math/VectorControls";
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
  type Mat2,
} from "@/math/matrix";
import { spanDimension } from "@/math/basis";
import type { Vec2 } from "@/math/vector";
const initial: Mat2 = { a: 1, b: 1, c: 0, d: 1 };
const presets: { label: string; matrix: Mat2 }[] = [
  { label: "Identity", matrix: identity },
  { label: "Shear", matrix: initial },
  { label: "Quarter turn", matrix: { a: 0, b: -1, c: 1, d: 0 } },
  { label: "Reflect", matrix: { a: -1, b: 0, c: 0, d: 1 } },
  { label: "Collapse to line", matrix: { a: 1, b: 0, c: 0, d: 0 } },
  { label: "Collapse to point", matrix: { a: 0, b: 0, c: 0, d: 0 } },
];
export function TransformationPlayground() {
  const [matrix, setMatrix] = useState<Mat2>(initial),
    [v, setV] = useState<Vec2>({ x: 2, y: 1 });
  const [progress, setProgress] = useState(1),
    [playing, setPlaying] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  useEffect(() => {
    if (!playing) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches) {
      return;
    }
    const start = performance.now();
    let frame = 0;
    function tick(now: number) {
      const t = Math.min(1, (now - start) / 1600);
      setProgress(t);
      if (t < 1) frame = requestAnimationFrame(tick);
      else setPlaying(false);
    }
    function reduce() {
      if (preference.matches) {
        setProgress(1);
        setPlaying(false);
      }
    }
    preference.addEventListener("change", reduce);
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      preference.removeEventListener("change", reduce);
    };
  }, [playing]);
  function edit(next: Mat2) {
    setPlaying(false);
    setMatrix(next);
    setProgress(1);
  }
  function animate() {
    if (playing) {
      setPlaying(false);
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setProgress(1);
      return;
    }
    setProgress(0);
    setPlaying(true);
  }
  const current = interpolateMatrix(identity, matrix, progress);
  const i = applyMatrix(current, { x: 1, y: 0 }),
    j = applyMatrix(current, { x: 0, y: 1 }),
    result = applyMatrix(current, v);
  const dimension = spanDimension(i, j);
  const extent = Math.max(
    6,
    Math.abs(v.x) + 1,
    Math.abs(v.y) + 1,
    Math.abs(result.x) + 1,
    Math.abs(result.y) + 1,
  );
  const success =
    progress === 1 &&
    matrix.a === 1 &&
    matrix.c === 1 &&
    matrix.b === -1 &&
    matrix.d === 1;
  return (
    <section id="playground" className="playground">
      <div className="playground-top">
        <div>
          <span className="eyebrow">THE TRANSFORMATION LAB</span>
          <h2>Move the basis. Move the whole plane.</h2>
        </div>
        <button
          className="reset-button"
          onClick={() => {
            edit(initial);
            setV({ x: 2, y: 1 });
            setShowGrid(true);
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
                key={p.label}
                className="reset-button"
                onClick={() => edit(p.matrix)}
              >
                {p.label}
              </button>
            ))}
          </div>
          <CoordinatePlane
            bounds={{
              xMin: -extent,
              xMax: extent,
              yMin: -extent,
              yMax: extent,
            }}
            gridStep={extent > 9 ? 2 : 1}
            label="Original coordinate axes with a transformed grid, unit square, basis vectors and test vector"
          >
            {showGrid && <TransformedGrid matrix={current} />}
            <TransformedSquare matrix={current} />
            <VectorArrow
              value={v}
              variant="sum"
              dashed
              label={v.x === result.x && v.y === result.y ? undefined : "v"}
            />
            <VectorArrow value={result} variant="scaled" label="Aₜ v" />
            <VectorArrow
              value={i}
              label={i.x === 0 && i.y === 0 ? undefined : "e₁′"}
            />
            <VectorArrow
              value={j}
              variant="w"
              label={j.x === 0 && j.y === 0 ? undefined : "e₂′"}
            />
            <DragTip name="v" value={v} onChange={setV} />
          </CoordinatePlane>
          <div className="plot-footer">
            <span>Gray: original grid · green: transformed grid</span>
            <span>e₁′ = Aₜ e₁ · e₂′ = Aₜ e₂</span>
            <label>
              <input
                type="checkbox"
                checked={showGrid}
                onChange={(e) => setShowGrid(e.target.checked)}
              />{" "}
              Show mapped grid
            </label>
          </div>
          <div className="animation-controls">
            <button className="reset-button" onClick={animate}>
              {playing ? "Pause" : "↗ Animate from identity"}
            </button>
            <ScalarControl
              label="Transformation amount"
              value={Number((progress * 100).toFixed(0))}
              min={0}
              max={100}
              step={1}
              onChange={(n) => {
                setPlaying(false);
                setProgress(n / 100);
              }}
            />
          </div>
        </div>
        <aside className="control-panel">
          <span className="eyebrow">WRITE THE MOVEMENT</span>
          <h3>Four numbers. One map.</h3>
          <p>The first column moves e₁. The second moves e₂.</p>
          <fieldset className="matrix-controls">
            <legend>Target matrix A</legend>
            <div className="matrix-editor">
              {(["a", "b", "c", "d"] as const).map((key, index) => (
                <input
                  key={key}
                  aria-label={`Matrix row ${Math.floor(index / 2) + 1} column ${(index % 2) + 1}`}
                  type="number"
                  min="-2"
                  max="2"
                  step=".25"
                  value={matrix[key]}
                  onChange={(e) => {
                    if (Number.isFinite(e.target.valueAsNumber))
                      edit({
                        ...matrix,
                        [key]: Math.max(
                          -2,
                          Math.min(2, e.target.valueAsNumber),
                        ),
                      });
                  }}
                />
              ))}
            </div>
            <p>
              Columns:{" "}
              <span className="text-v">
                e₁ → ({matrix.a}, {matrix.c})
              </span>{" "}
              ·{" "}
              <span className="text-w">
                e₂ → ({matrix.b}, {matrix.d})
              </span>
            </p>
          </fieldset>
          <VectorControls name="v" value={v} onChange={setV} />
          <div className="result-card">
            <span className="eyebrow">
              CURRENT MAP · {Math.round(progress * 100)}%
            </span>
            <MathNotation formula={`A_t\\mathbf v=${vectorNotation(result)}`} />
            <p role="status">
              {dimension === 2
                ? "The current map keeps two independent directions."
                : dimension === 1
                  ? "The current map collapses the plane onto one line."
                  : "The current map sends every vector to the origin."}
            </p>
            <p className="interpolation-note">
              Animation blends the identity and A. It may pass through a
              collapse, even when A does not.
            </p>
          </div>
        </aside>
      </div>
      <div className="equation-strip">
        <MathNotation
          formula={`${matrixNotation(current)}${vectorNotation(v)}=${vectorNotation(result)}`}
        />
        <span>Current map: Aₜ = (1 − t)I + tA</span>
      </div>
      <div className={"challenge " + (success ? "challenge-success" : "")}>
        <div>
          <span className="eyebrow">A SMALL CHALLENGE</span>
          <h3>Write a map from two destinations.</h3>
          <p>
            Edit A so e₁ lands at (1, 1) and e₂ at (−1, 1). Show the full
            transformation to check your map.
          </p>
        </div>
        <span className="challenge-status" role="status">
          {success ? "✓ Both destinations matched!" : "○ Follow the columns"}
        </span>
      </div>
    </section>
  );
}
