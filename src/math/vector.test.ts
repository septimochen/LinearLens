import { describe, expect, it } from "vitest";
import { add, subtract, scale, magnitude, normalize } from "./vector";
describe("2D vectors", () => {
  it("adds components", () =>
    expect(add({ x: 3, y: 2 }, { x: -1, y: 2 })).toEqual({ x: 2, y: 4 }));
  it("subtracts components", () =>
    expect(subtract({ x: 3, y: 2 }, { x: -1, y: 2 })).toEqual({ x: 4, y: 0 }));
  it("scales, reverses and collapses vectors", () => {
    expect(scale({ x: 3, y: -2 }, 2)).toEqual({ x: 6, y: -4 });
    expect(scale({ x: 3, y: -2 }, -1)).toEqual({ x: -3, y: 2 });
    expect(magnitude(scale({ x: 3, y: 2 }, 0))).toBe(0);
  });
  it("measures Euclidean length", () =>
    expect(magnitude({ x: -3, y: 4 })).toBe(5));
  it("normalizes without changing direction", () => {
    const unit = normalize({ x: 3, y: 4 });
    expect(unit.x).toBeCloseTo(0.6);
    expect(unit.y).toBeCloseTo(0.8);
    expect(magnitude(normalize({ x: -2, y: 7 }))).toBeCloseTo(1);
  });
  it("normalizes zero to zero", () =>
    expect(normalize({ x: 0, y: 0 })).toEqual({ x: 0, y: 0 }));
});
