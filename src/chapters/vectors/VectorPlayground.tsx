"use client";
import { useState } from "react";
import { add, scale, magnitude, type Vec2 } from "@/math/vector";
import { CoordinatePlane } from "@/components/math/CoordinatePlane";
import { VectorArrow } from "@/components/math/VectorArrow";
import { MathNotation } from "@/components/math/MathNotation";
import { DragTip, VectorControls } from "@/components/math/VectorControls";
const initialV = { x: 3, y: 2 },
  initialW = { x: -1, y: 2 };
export function VectorPlayground() {
  const [v, setV] = useState<Vec2>(initialV),
    [w, setW] = useState<Vec2>(initialW);
  const [scalar, setScalar] = useState(1.5);
  const [mode, setMode] = useState<"addition" | "scaling">("addition");
  const sum = add(v, w),
    scaled = scale(v, scalar);
  const result = mode === "addition" ? sum : scaled;
  const extent = Math.max(6, Math.abs(result.x) + 1, Math.abs(result.y) + 1);
  const success = magnitude(sum) < 0.000001;
  const tuple = (p: Vec2) => `\\begin{pmatrix}${p.x}\\\\${p.y}\\end{pmatrix}`;
  return (
    <section id="playground" className="playground">
      <div className="playground-top">
        <div>
          <span className="eyebrow">THE VECTOR LAB</span>
          <h2>A little movement. A lot of intuition.</h2>
        </div>
        <button
          className="reset-button"
          onClick={() => {
            setV(initialV);
            setW(initialW);
            setScalar(1.5);
          }}
        >
          ↺ Reset
        </button>
      </div>
      <div className="lab-body">
        <div className="visual-panel">
          <div
            className="mode-switch"
            role="group"
            aria-label="Visualization mode"
          >
            <button
              aria-pressed={mode === "addition"}
              onClick={() => setMode("addition")}
            >
              Vector addition
            </button>
            <button
              aria-pressed={mode === "scaling"}
              onClick={() => setMode("scaling")}
            >
              Scalar multiplication
            </button>
          </div>
          <CoordinatePlane
            bounds={{
              xMin: -extent,
              xMax: extent,
              yMin: -extent,
              yMax: extent,
            }}
            label={
              mode === "addition"
                ? "Vectors v and w, with w translated to the tip of v and their sum"
                : "Vector v and its scalar multiple"
            }
          >
            {mode === "addition" ? (
              <>
                <VectorArrow value={sum} variant="sum" label="v + w" />
                <VectorArrow value={w} variant="w" label="w" />
                <VectorArrow start={v} value={w} variant="w" dashed />
                <VectorArrow value={v} label="v" />
                <DragTip value={w} onChange={setW} name="w" />
              </>
            ) : (
              <>
                <VectorArrow value={scaled} variant="scaled" label="a v" />
                <VectorArrow value={v} dashed label="v" />
              </>
            )}
            <DragTip value={v} onChange={setV} name="v" />
          </CoordinatePlane>
          <div className="plot-footer">
            <span>
              <span className="tiny-ring" /> Drag the vector tips to explore
            </span>
            <span>1 grid square = 1 unit</span>
          </div>
        </div>
        <aside className="control-panel">
          <span className="eyebrow">MAKE IT YOURS</span>
          <h3>Move the numbers.</h3>
          <p>The arrows follow your lead.</p>
          <VectorControls name="v" value={v} onChange={setV} />
          {mode === "addition" ? (
            <VectorControls name="w" value={w} onChange={setW} />
          ) : (
            <fieldset className="scalar-controls">
              <legend>
                Scalar <i>a</i>
                <span className="coordinate-value">{scalar}</span>
              </legend>
              <label htmlFor="scalar">Scale factor</label>
              <div className="control-row">
                <input
                  id="scalar"
                  type="range"
                  min="-2"
                  max="2"
                  step="0.25"
                  value={scalar}
                  onChange={(e) => setScalar(Number(e.target.value))}
                />
                <input
                  aria-label="Scalar numeric value"
                  type="number"
                  min="-2"
                  max="2"
                  step="0.25"
                  value={scalar}
                  onChange={(e) => {
                    if (Number.isFinite(e.target.valueAsNumber))
                      setScalar(
                        Math.max(-2, Math.min(2, e.target.valueAsNumber)),
                      );
                  }}
                />
              </div>
              <p>
                {scalar < 0
                  ? "A negative scalar reverses the direction."
                  : scalar === 0
                    ? "Zero brings every component to zero."
                    : "Scale the length, keep the direction."}
              </p>
            </fieldset>
          )}
          <div className="result-card">
            <span className="eyebrow">
              {mode === "addition"
                ? "THE COMBINED MOVEMENT"
                : "THE SCALED MOVEMENT"}
            </span>
            <MathNotation
              formula={
                mode === "addition"
                  ? `\\mathbf v + \\mathbf w = ${tuple(sum)}`
                  : `${scalar}\\mathbf v = ${tuple(scaled)}`
              }
            />
            <p>
              {mode === "addition"
                ? "Follow v, then follow w. This is where you land."
                : "Every component is multiplied by the same number."}
            </p>
          </div>
        </aside>
      </div>
      <div className="equation-strip">
        <MathNotation
          formula={
            mode === "addition"
              ? `${tuple(v)} + ${tuple(w)} = ${tuple(sum)}`
              : `${scalar}\\, ${tuple(v)} = ${tuple(scaled)}`
          }
        />
        <span>
          {mode === "addition"
            ? "Add matching components."
            : "Multiply both components."}
        </span>
      </div>
      <div className={"challenge " + (success ? "challenge-success" : "")}>
        <div>
          <span className="eyebrow">A SMALL CHALLENGE</span>
          <h3>Can you get back to the origin?</h3>
          <p>
            Adjust v and w until their sum is (0, 0). Find a pair that cancels.
          </p>
        </div>
        {mode === "scaling" && (
          <button className="reset-button" onClick={() => setMode("addition")}>
            Try in addition mode →
          </button>
        )}
        <span role="status" className="challenge-status">
          {success ? "✓ You found a pair!" : "○ Keep exploring"}
        </span>
      </div>
    </section>
  );
}
