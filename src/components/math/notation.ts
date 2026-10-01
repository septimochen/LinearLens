import type { Vec2 } from "@/math/vector";
import type { Mat2 } from "@/math/matrix";
export const formatNumber = (value: number) => String(Number(value.toFixed(3)));
export const vectorNotation = (v: Vec2) =>
  `\\begin{pmatrix}${formatNumber(v.x)}\\\\${formatNumber(v.y)}\\end{pmatrix}`;
export const matrixNotation = (m: Mat2) =>
  `\\begin{pmatrix}${formatNumber(m.a)}&${formatNumber(m.b)}\\\\${formatNumber(m.c)}&${formatNumber(m.d)}\\end{pmatrix}`;
