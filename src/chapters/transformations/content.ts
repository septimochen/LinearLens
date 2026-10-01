export const notes = [
  {
    title: "Choose two destinations. The rest follows.",
    text: "The standard basis is e₁ = (1, 0), e₂ = (0, 1). Every vector is x e₁ + y e₂. For a linear map, its image must be x times the image of e₁ plus y times the image of e₂.",
    formula: "T(xe_1+ye_2)=xT(e_1)+yT(e_2)",
  },
  {
    title: "Read a matrix by its columns.",
    text: "The first column stores the destination of e₁, the second stores the destination of e₂. Multiplying a matrix by a vector weights those columns with the vector’s components and adds them.",
    formula:
      "\\begin{pmatrix}a&b\\\\c&d\\end{pmatrix}\\begin{pmatrix}x\\\\y\\end{pmatrix}=\\begin{pmatrix}ax+by\\\\cx+dy\\end{pmatrix}",
  },
  {
    title: "Linear means combinations are preserved.",
    text: "Linear maps preserve vector addition and scalar multiplication. The origin stays fixed. Straight grid lines remain straight, although a map can collapse entire lines to points. A translation that moves the origin is not linear.",
    formula: "T(u+v)=T(u)+T(v),\\qquad T(ku)=kT(u)",
  },
  {
    title: "Two directions can become one.",
    text: "If the image columns are parallel, every transformed vector lies on their common line. If both columns are zero, every vector lands at the origin. Independent image columns preserve a two-dimensional range.",
    formula:
      "T(x,y)=x\\begin{pmatrix}a\\\\c\\end{pmatrix}+y\\begin{pmatrix}b\\\\d\\end{pmatrix}",
  },
];
export const experiments = [
  {
    title: "Predict before you move",
    text: "Try the shear preset. Predict where (2, 1) lands using the two columns, then compare with the purple arrow.",
  },
  {
    title: "Turn a quarter",
    text: "Choose “Quarter turn.” Where do the basis arrows land? Compare the final grid with the animation’s intermediate maps.",
  },
  {
    title: "Flatten the plane",
    text: "Choose “Collapse to line.” Change v’s y component. Does its image change? Which input vectors land at zero?",
  },
  {
    title: "Fix the origin",
    text: "Try reflection, zero, or your own matrix. Set v = (0, 0). Can a matrix move it away from the origin?",
  },
];
