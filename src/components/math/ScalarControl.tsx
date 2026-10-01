"use client";
import { useId } from "react";
export function ScalarControl({
  label,
  value,
  onChange,
  min = -3,
  max = 3,
  step = 0.25,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  const id = useId();
  return (
    <div className="scalar-control">
      <label htmlFor={id}>
        {label}
        <span>{value}</span>
      </label>
      <div className="control-row">
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        <input
          aria-label={label + " numeric value"}
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => {
            if (Number.isFinite(e.target.valueAsNumber))
              onChange(Math.max(min, Math.min(max, e.target.valueAsNumber)));
          }}
        />
      </div>
    </div>
  );
}
