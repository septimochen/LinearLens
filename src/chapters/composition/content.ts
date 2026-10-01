export const notes = [
  {
    title: "One movement after another.",
    text: "Feed the output of one linear map into another. The combined action is still linear, so a single matrix can describe the entire journey.",
    formula: "C\\mathbf v=A(B\\mathbf v),\\qquad C=AB",
  },
  {
    title: "Follow the columns through both maps.",
    text: "B’s columns are where the standard basis lands after the first map. Apply A to each of those destinations. The results are the columns of AB.",
    formula: "AB=[\\,A(B e_1)\\quad A(B e_2)\\,]",
  },
  {
    title: "Rows meet columns.",
    text: "Each entry combines one row of A with one column of B. This arithmetic is simply matrix-vector multiplication performed once for each column.",
    formula:
      "\\begin{pmatrix}a&b\\\\c&d\\end{pmatrix}\\begin{pmatrix}e&f\\\\g&h\\end{pmatrix}=\\begin{pmatrix}ae+bg&af+bh\\\\ce+dg&cf+dh\\end{pmatrix}",
  },
  {
    title: "The order is part of the operation.",
    text: "A shear changes what a later rotation acts on. Reversing their order generally gives a different map. Some pairs do commute, including two uniform scalings. Matrix multiplication is associative: grouping can change, but the order stays fixed.",
    formula: "AB\\ne BA\\text{ in general},\\qquad (AB)C=A(BC)",
  },
];
export const experiments = [
  {
    title: "Trace one arrow",
    text: "Choose shear and turn. Stop at 100% to read Bv, then advance to 200%. Predict the final arrow before applying A.",
  },
  {
    title: "Reverse the journey",
    text: "Compare AB and BA. Does this vector land at the same place? Try other vectors too: agreement for one input does not prove two maps are equal.",
  },
  {
    title: "Find an exception",
    text: "Try the two scales preset. Compare both orders, then edit off-diagonal entries in both matrices. When does the agreement disappear?",
  },
  {
    title: "Can lost information return?",
    text: "Choose collapse then shear. Change the test vector’s y component. Can the second map recover the direction the first one erased?",
  },
];
