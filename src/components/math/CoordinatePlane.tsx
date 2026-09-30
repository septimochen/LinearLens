"use client";
import { createContext, useContext, type ReactNode } from "react";
import { coordinateSystem, type Bounds } from "@/math/coordinates";
import { Grid } from "./Grid";
const PlaneContext = createContext<ReturnType<typeof coordinateSystem> | null>(
  null,
);
export function useCoordinates() {
  const context = useContext(PlaneContext);
  if (!context)
    throw new Error("SVG primitives must be inside CoordinatePlane");
  return context;
}
export function CoordinatePlane({
  children,
  bounds = { xMin: -6, xMax: 6, yMin: -6, yMax: 6 },
  gridStep = 1,
  label = "Interactive coordinate plane",
}: {
  children: ReactNode;
  bounds?: Bounds;
  gridStep?: number;
  label?: string;
}) {
  const system = coordinateSystem(bounds);
  return (
    <PlaneContext.Provider value={system}>
      <svg
        className="coordinate-plane"
        viewBox="0 0 600 600"
        role="group"
        aria-label={label}
      >
        <Grid step={gridStep} />
        {children}
      </svg>
    </PlaneContext.Provider>
  );
}
