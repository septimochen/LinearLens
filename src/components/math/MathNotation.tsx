import katex from "katex";
export function MathNotation({
  formula,
  display = false,
}: {
  formula: string;
  display?: boolean;
}) {
  return (
    <span
      className="math-notation"
      dangerouslySetInnerHTML={{
        __html: katex.renderToString(formula, {
          displayMode: display,
          throwOnError: false,
          output: "htmlAndMathml",
        }),
      }}
    />
  );
}
