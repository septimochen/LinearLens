"use client";
import { useState } from "react";
import { Lab, FunctionPlot } from "./Lab";
import { ScalarControl } from "@/components/math/ScalarControl";
import { MathNotation } from "@/components/math/MathNotation";
import { formatNumber } from "@/components/math/notation";
import {
  combinePolynomials,
  derivative,
  evaluatePolynomial,
  type Polynomial,
} from "@/math/advanced";
const initialP: Polynomial = [0, 0, 1],
  initialQ: Polynomial = [1, 1, 0];
function PolynomialControls({
  name,
  value,
  onChange,
}: {
  name: string;
  value: Polynomial;
  onChange: (p: Polynomial) => void;
}) {
  return (
    <fieldset className="vector-controls">
      <legend>Polynomial {name} · basis (1, t, t²)</legend>
      {value.map((n, i) => (
        <ScalarControl
          key={i}
          label={`${name} coefficient of ${["1", "t", "t²"][i]}`}
          value={n}
          min={-2}
          max={2}
          step={0.25}
          onChange={(next) => {
            const copy: [number, number, number] = [...value];
            copy[i] = next;
            onChange(copy);
          }}
        />
      ))}
    </fieldset>
  );
}
const notation = (p: Polynomial) =>
  String.raw`${formatNumber(p[0])}+(${formatNumber(p[1])})t+(${formatNumber(p[2])})t^2`;
export function AbstractPlayground() {
  const [p, setP] = useState<Polynomial>(initialP),
    [q, setQ] = useState<Polynomial>(initialQ),
    [a, setA] = useState(1),
    [b, setB] = useState(1),
    [showDerivative, setShowDerivative] = useState(false);
  const sum = combinePolynomials(p, q, a, b),
    dp = derivative(p),
    dq = derivative(q),
    ds = derivative(sum);
  const curves = (showDerivative ? [dp, dq, ds] : [p, q, sum]).map((poly) =>
    Array.from({ length: 121 }, (_, i) => {
      const x = -2 + i / 30;
      return { x, y: evaluatePolynomial(poly, x) };
    }),
  );
  const success =
    p.some((n) => Math.abs(n) > 1e-6) && dp.every((n) => Math.abs(n) < 1e-6);
  return (
    <Lab
      title="A vector can be a function."
      subtitle="THE POLYNOMIAL LAB"
      reset={() => {
        setP(initialP);
        setQ(initialQ);
        setA(1);
        setB(1);
        setShowDerivative(false);
      }}
      presets={[
        {
          label: "Quadratic + line",
          action: () => {
            setP(initialP);
            setQ(initialQ);
            setA(1);
            setB(1);
          },
        },
        {
          label: "Cancellation",
          action: () => {
            setP([0, 0, 1]);
            setQ([0, 0, -1]);
            setA(1);
            setB(1);
          },
        },
        {
          label: "Constant kernel",
          action: () => {
            setP([2, 0, 0]);
            setQ([0, 1, 0]);
            setA(1);
            setB(1);
          },
        },
      ]}
      visual={
        <>
          <div
            className="preset-row"
            role="group"
            aria-label="Polynomial plot mode"
          >
            <button
              className="reset-button"
              aria-pressed={!showDerivative}
              onClick={() => setShowDerivative(false)}
            >
              Functions
            </button>
            <button
              className="reset-button"
              aria-pressed={showDerivative}
              onClick={() => setShowDerivative(true)}
            >
              Derivatives
            </button>
          </div>
          <FunctionPlot
            curves={curves}
            labels={
              showDerivative ? ["Dp", "Dq", "D(ap+bq)"] : ["p", "q", "ap+bq"]
            }
          />
          <div className="plot-footer">
            Green: {showDerivative ? "Dp" : "p"} · orange:{" "}
            {showDerivative ? "Dq" : "q"} · purple:{" "}
            {showDerivative ? "D(ap + bq)" : "ap + bq"}. Curves sampled for −2 ≤
            t ≤ 2; horizontal axis is t.
          </div>
        </>
      }
      controls={
        <>
          <PolynomialControls name="p" value={p} onChange={setP} />
          <PolynomialControls name="q" value={q} onChange={setQ} />
          <ScalarControl
            label="Coefficient a"
            value={a}
            onChange={setA}
            min={-2}
            max={2}
            step={0.25}
          />
          <ScalarControl
            label="Coefficient b"
            value={b}
            onChange={setB}
            min={-2}
            max={2}
            step={0.25}
          />
          <div className="result-card">
            <MathNotation formula={String.raw`p(t)=${notation(p)}`} />
            <MathNotation formula={String.raw`q(t)=${notation(q)}`} />
            <MathNotation formula={String.raw`ap+bq=${notation(sum)}`} />
            <MathNotation formula={String.raw`D(ap+bq)=${notation(ds)}`} />
            <p role="status">
              Differentiation preserves linear combinations. Its kernel consists
              of constants; its image is all polynomials of degree at most one.
            </p>
          </div>
        </>
      }
      equations={
        <MathNotation
          formula={String.raw`D(ap+bq)=aDp+bDq,\qquad [D]_{(1,t,t^2)\to(1,t)}=\begin{pmatrix}0&1&0\\0&0&2\end{pmatrix}`}
        />
      }
      challenge={{
        title: "Find a nonzero function sent to zero.",
        text: "Edit p so it is nonzero but Dp is the zero function. Switch to derivatives to see the erased information.",
        hint: "○ Make p ≠ 0 and Dp = 0",
      }}
      success={success}
    />
  );
}
