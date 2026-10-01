"use client";
import { useState } from "react";
import { Lab, Plane } from "./Lab";
import { MatrixControls } from "@/components/math/MatrixControls";
import { VectorControls, DragTip } from "@/components/math/VectorControls";
import { VectorArrow } from "@/components/math/VectorArrow";
import { TransformedGrid } from "@/components/math/TransformedGrid";
import { MathNotation } from "@/components/math/MathNotation";
import { matrixNotation, vectorNotation } from "@/components/math/notation";
import { applyMatrix, type Mat2 } from "@/math/matrix";
import { changeBasis, columns, inverse } from "@/math/advanced";
import { type Vec2, magnitude, subtract } from "@/math/vector";
const initial: Mat2 = { a: 1, b: 1, c: 0, d: 1 };
const initialMap: Mat2 = { a: 2, b: 0, c: 0, d: 1 };
export function ChangeBasisPlayground() {
  const [basis, setBasis] = useState<Mat2>(initial),
    [map, setMap] = useState<Mat2>(initialMap),
    [v, setV] = useState<Vec2>({ x: 3, y: 1 });
  const inv = inverse(basis),
    coords = inv && applyMatrix(inv, v),
    transformed = applyMatrix(map, v),
    newMap = changeBasis(map, basis),
    [u, w] = columns(basis);
  const mappedCoords = newMap && coords && applyMatrix(newMap, coords);
  return (
    <Lab
      title="One arrow. Two coordinate languages."
      subtitle="THE CHANGE OF BASIS LAB"
      reset={() => {
        setBasis(initial);
        setMap(initialMap);
        setV({ x: 3, y: 1 });
      }}
      presets={[
        { label: "Sheared basis", action: () => setBasis(initial) },
        {
          label: "Rotated basis",
          action: () => setBasis({ a: 0, b: -1, c: 1, d: 0 }),
        },
        {
          label: "Eigenbasis",
          action: () => {
            setMap({ a: 1, b: 1, c: 1, d: 1 });
            setBasis({ a: 1, b: -1, c: 1, d: 1 });
          },
        },
        {
          label: "Dependent columns",
          action: () => setBasis({ a: 1, b: 2, c: 1, d: 2 }),
        },
      ]}
      visual={
        <>
          <Plane
            points={[u, w, v, transformed]}
            label="Basis grid with the same physical vector and its transformed image"
          >
            <TransformedGrid matrix={basis} />
            <VectorArrow value={u} label="b₁" />
            <VectorArrow value={w} label="b₂" variant="w" />
            <VectorArrow value={v} label="v" variant="scaled" />
            <VectorArrow
              value={transformed}
              label="Av"
              variant="scaled"
              dashed
            />
            <DragTip name="v" value={v} onChange={setV} />
          </Plane>
          <div className="plot-footer">
            Gray: standard grid · green: B grid · v stays in the same place when
            B changes
          </div>
        </>
      }
      controls={
        <>
          <MatrixControls name="B (basis)" value={basis} onChange={setBasis} />
          <VectorControls name="v" value={v} onChange={setV} />
          <MatrixControls
            name="A (standard map)"
            value={map}
            onChange={setMap}
          />
          <div className="result-card">
            {coords && newMap && mappedCoords ? (
              <>
                <MathNotation
                  formula={String.raw`[v]_B=B^{-1}v=${vectorNotation(coords)}`}
                />
                <MathNotation
                  formula={String.raw`[A]_B=B^{-1}AB=${matrixNotation(newMap)}`}
                />
                <MathNotation
                  formula={String.raw`[Av]_B=${vectorNotation(mappedCoords)}`}
                />
                <p role="status">
                  B converts basis coordinates to standard coordinates; B⁻¹
                  translates back.
                </p>
              </>
            ) : (
              <p role="status">
                These columns do not form a basis. B has no inverse, so unique
                basis coordinates and B⁻¹AB are unavailable.
              </p>
            )}
          </div>
        </>
      }
      equations={
        <MathNotation
          formula={String.raw`v=B[v]_B,\qquad Av=B\bigl([A]_B[v]_B\bigr)`}
        />
      }
      challenge={{
        title: "Describe (2, 1) as (1, 1).",
        text: "Choose an invertible B and set v = (2, 1) so its B coordinates are (1, 1). Think of adding the basis columns.",
        hint: "○ Match the vector and new coordinates",
      }}
      success={
        coords !== null &&
        magnitude(subtract(v, { x: 2, y: 1 })) < 1e-6 &&
        magnitude(subtract(coords, { x: 1, y: 1 })) < 1e-6
      }
    />
  );
}
