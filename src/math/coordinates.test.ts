import { expect, it } from "vitest";
import { coordinateSystem } from "./coordinates";
it("inverts y and round-trips negative coordinates", () => {
  const system = coordinateSystem({ xMin: -6, xMax: 6, yMin: -6, yMax: 6 });
  expect(system.toSvg({ x: 0, y: 1 }).y).toBeLessThan(
    system.toSvg({ x: 0, y: 0 }).y,
  );
  expect(system.fromSvg(system.toSvg({ x: -3, y: 2 }))).toEqual({
    x: -3,
    y: 2,
  });
});
