import { describe, expect, it } from "vitest";
import katex from "katex";
import { chapters } from "./course";
import { lessons } from "./advanced/content";
import { existsSync } from "node:fs";
describe("complete course", () => {
  it("links all thirteen implemented routes in order", () => {
    expect(chapters).toHaveLength(13);
    expect(new Set(chapters.map((c) => c.slug)).size).toBe(13);
    for (const [i, chapter] of chapters.entries()) {
      expect(chapter.slug.startsWith(String(i + 1).padStart(2, "0"))).toBe(
        true,
      );
      expect(existsSync(`src/app/chapters/${chapter.slug}/page.tsx`)).toBe(
        true,
      );
    }
    expect(lessons.map((l) => l.number)).toEqual([
      5, 6, 7, 8, 9, 10, 11, 12, 13,
    ]);
  });
  it("renders all lesson formulas with strict KaTeX parsing", () => {
    for (const lesson of lessons) {
      for (const formula of [
        lesson.formula,
        ...lesson.notes.map((n) => n.formula),
      ]) {
        expect(() =>
          katex.renderToString(formula, { throwOnError: true }),
        ).not.toThrow();
      }
    }
  });
});
