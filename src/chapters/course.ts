/** Shared by the course index and sequential lesson navigation. */
export const chapters = [
  {
    slug: "01-vectors",
    title: "Vectors",
    description: "Movements, components, and the art of adding arrows.",
  },
  {
    slug: "02-span-and-basis",
    title: "Linear combinations, span and basis",
    description: "Build vectors, explore span, and choose a basis.",
  },
  {
    slug: "03-linear-transformations",
    title: "Linear transformations and matrices",
    description: "Map the basis and transform the whole coordinate grid.",
  },
  {
    slug: "04-matrix-multiplication",
    title: "Matrix multiplication",
    description: "Compose two maps and discover why order matters.",
  },
  {
    slug: "05-determinant",
    title: "Determinant",
    description: "Measure signed area, orientation, and collapse.",
  },
  {
    slug: "06-inverse-column-space-null-space",
    title: "Inverse, column space and null space",
    description: "Find preimages and explore the directions a map erases.",
  },
  {
    slug: "07-dot-product",
    title: "Dot product",
    description: "Read alignment, angles, and orthogonal projection.",
  },
  {
    slug: "08-cross-product",
    title: "Cross product",
    description: "Turn an oriented area in 3D into a perpendicular arrow.",
  },
  {
    slug: "09-cross-product-transformations",
    title: "Cross products as transformations",
    description:
      "Fix one vector and discover a linear map in three dimensions.",
  },
  {
    slug: "10-cramers-rule",
    title: "Cramer’s rule",
    description: "Recover unknown coefficients with signed area ratios.",
  },
  {
    slug: "11-change-of-basis",
    title: "Change of basis",
    description: "Translate vectors and maps into a new coordinate language.",
  },
  {
    slug: "12-eigenvectors-and-eigenvalues",
    title: "Eigenvectors and eigenvalues",
    description: "Find the directions a transformation keeps on their lines.",
  },
  {
    slug: "13-abstract-vector-spaces",
    title: "Abstract vector spaces",
    description:
      "Add functions, choose a polynomial basis, and differentiate vectors.",
  },
];
export const chapterLink = (index: number) => ({
  href: `/chapters/${chapters[index].slug}`,
  title: chapters[index].title,
});
