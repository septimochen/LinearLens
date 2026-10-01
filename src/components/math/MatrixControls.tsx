"use client";
import type { Mat2 } from "@/math/matrix";
export function MatrixControls({
  name,
  value,
  onChange,
}: {
  name: string;
  value: Mat2;
  onChange: (value: Mat2) => void;
}) {
  return (
    <fieldset className="matrix-controls">
      <legend>Matrix {name}</legend>
      <div className="matrix-editor">
        {(["a", "b", "c", "d"] as const).map((key, index) => (
          <input
            key={key}
            aria-label={`${name} row ${Math.floor(index / 2) + 1} column ${(index % 2) + 1}`}
            type="number"
            min={-2}
            max={2}
            step={0.25}
            value={value[key]}
            onChange={(e) => {
              const n = e.target.valueAsNumber;
              if (Number.isFinite(n))
                onChange({ ...value, [key]: Math.max(-2, Math.min(2, n)) });
            }}
          />
        ))}
      </div>
      <p>
        Columns: ({value.a}, {value.c}) · ({value.b}, {value.d})
      </p>
    </fieldset>
  );
}
