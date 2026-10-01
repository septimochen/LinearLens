"use client";
import { useState } from "react";
import { CoordinatePlane } from "@/components/math/CoordinatePlane";
import { VectorArrow } from "@/components/math/VectorArrow";
import { DragTip, VectorControls } from "@/components/math/VectorControls";
import { ScalarControl } from "@/components/math/ScalarControl";
import { SpanRegion } from "@/components/math/SpanRegion";
import { Point } from "@/components/math/Point";
import { MathNotation } from "@/components/math/MathNotation";
import { vectorNotation } from "@/components/math/notation";
import { linearCombination, spanDimension } from "@/math/basis";
import { scale, subtract, magnitude, type Vec2 } from "@/math/vector";
const initialU = { x: 2, y: 0 },
  initialV = { x: 1, y: 2 },
  target = { x: 1, y: 3 };
export function BasisPlayground() {
  const [u, setU] = useState<Vec2>(initialU),
    [v, setV] = useState<Vec2>(initialV);
  const [a, setA] = useState(1),
    [b, setB] = useState(1),
    [showSpan, setShowSpan] = useState(true);
  const result = linearCombination(u, v, a, b),
    first = scale(u, a),
    second = scale(v, b);
  const dimension = spanDimension(u, v);
  const extent = Math.max(6, Math.abs(result.x) + 1, Math.abs(result.y) + 1);
  const success = magnitude(subtract(result, target)) < 1e-6;
  const presets = [
    { label: "Standard basis", u: { x: 1, y: 0 }, v: { x: 0, y: 1 } },
    { label: "One line", u: { x: 1, y: 1 }, v: { x: 2, y: 2 } },
    { label: "Just a point", u: { x: 0, y: 0 }, v: { x: 0, y: 0 } },
  ];
  return (
    <section className="playground" id="playground">
      <div className="playground-top">
        <div>
          <span className="eyebrow">THE BASIS LAB</span>
          <h2>Two directions. How many destinations?</h2>
        </div>
        <button
          className="reset-button"
          onClick={() => {
            setU(initialU);
            setV(initialV);
            setA(1);
            setB(1);
            setShowSpan(true);
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
                  setU(p.u);
                  setV(p.v);
                }}
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
            label="Basis vectors u and v, their scaled tip-to-tail combination, and target (1, 3)"
          >
            {showSpan && <SpanRegion u={u} v={v} />}
            <VectorArrow value={result} variant="sum" label="a u + b v" />
            <VectorArrow value={first} dashed />
            <VectorArrow start={first} value={second} dashed variant="w" />
            <VectorArrow
              value={u}
              label={u.x === result.x && u.y === result.y ? undefined : "u"}
            />
            <VectorArrow
              value={v}
              variant="w"
              label={v.x === result.x && v.y === result.y ? undefined : "v"}
            />
            <Point value={target} label={success ? undefined : "target"} />
            <DragTip value={u} onChange={setU} name="u" />
            <DragTip value={v} onChange={setV} name="v" tone="w" />
          </CoordinatePlane>
          <div className="plot-footer">
            <span>Drag u and v; adjust a and b beside the plot.</span>
            <label>
              <input
                type="checkbox"
                checked={showSpan}
                onChange={(e) => setShowSpan(e.target.checked)}
              />{" "}
              Show span
            </label>
          </div>
        </div>
        <aside className="control-panel">
          <span className="eyebrow">CHOOSE YOUR BUILDING BLOCKS</span>
          <h3>Scale. Then combine.</h3>
          <p>
            Solid arrows are the generators. Dashed arrows are your scaled
            steps.
          </p>
          <VectorControls name="u" value={u} onChange={setU} />
          <VectorControls name="v" tone="w" value={v} onChange={setV} />
          <ScalarControl label="Coefficient a" value={a} onChange={setA} />
          <ScalarControl label="Coefficient b" value={b} onChange={setB} />
          <div className="result-card">
            <span className="eyebrow">WHERE YOU LAND</span>
            <MathNotation
              formula={`a\\mathbf u+b\\mathbf v=${vectorNotation(result)}`}
            />
            <p role="status">
              {dimension === 2
                ? "These directions span the whole plane: they form a basis of ℝ²."
                : dimension === 1
                  ? "These directions span one line. They do not form a basis of ℝ²."
                  : "Both generators are zero. Their span is just the origin."}
            </p>
          </div>
        </aside>
      </div>
      <div className="equation-strip">
        <MathNotation
          formula={`${a}\\,${vectorNotation(u)}+${b}\\,${vectorNotation(v)}=${vectorNotation(result)}`}
        />
        <span>Every coefficient is a signed amount of movement.</span>
      </div>
      <div className={"challenge " + (success ? "challenge-success" : "")}>
        <div>
          <span className="eyebrow">A SMALL CHALLENGE</span>
          <h3>Land on (1, 3).</h3>
          <p>
            Keep the starting generators and find coefficients that reach the
            target. Then try the “One line” preset: is the target still
            reachable?
          </p>
        </div>
        <span className="challenge-status" role="status">
          {success ? "✓ Target reached!" : "○ Find your combination"}
        </span>
      </div>
    </section>
  );
}
