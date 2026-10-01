# LinearLens — Interactive Linear Algebra

Build intuition by manipulating vectors, matrices, and transformations.

LinearLens is an original interactive mathematical notebook inspired by studying
3Blue1Brown’s _Essence of Linear Algebra_. The notes, code, visualizations, and
exercises are original; this project does not reproduce the videos or transcripts.

## Learning philosophy

Learn linear algebra by manipulating it and seeing what happens. Each lesson
connects a short conceptual explanation, mathematical notation, a live visual
playground, and small experiments. Chapter 1 introduces vectors as displacements
and ordered pairs, components, tip-to-tail addition, and scalar multiplication.
Chapter 2 explores linear combinations, span, independence, and basis. Chapter 3
connects matrix columns to basis images and transforms an SVG coordinate grid.

## Local development

Requires Node.js 20.9 or newer and npm.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Start the lesson at /chapters/01-vectors.

```sh
npm test              # Pure math unit tests
npm run lint          # ESLint and Next.js accessibility rules
npm run typecheck     # Strict TypeScript
npm run format        # Prettier
npm run build         # Production build
npm start             # Serve the production build
make check            # Tests, lint, type checking, production build
```

## Stack and architecture

Next.js App Router, React, strict TypeScript, Tailwind CSS, SVG, KaTeX, and Vitest.
No backend, charting library, global state library, or third-party math library.
Production builds use Next.js’s Webpack option to support development sandboxes
that restrict Turbopack’s worker ports; development uses the default Turbopack.

- `src/math/`: pure TypeScript vector, linear-combination, span, matrix-vector, determinant, and interpolation operations, plus tests.
- `src/components/math/`: shared SVG primitives, span region, transformed grid and square, controls, and notation.
- `src/chapters/{vectors,basis,transformations}/`: original content and local playground interaction state.
- `src/components/lesson/`: shared lesson layout for Chapters 2 and 3.
- `src/app/`: course home, Chapters 1–3 routes, shared layout, and responsive styles.
- `src/components/layout/`: shared navigation.

The dependency flow is **math → visualization → interaction → lesson**.
CoordinatePlane provides a shared SVG coordinate context. Equal scale on each
axis preserves geometry, and y is inverted centrally to map mathematical
coordinates to SVG. The square viewBox resizes without changing vector angles.
VectorArrow accepts a start and either an end or a displacement, supporting
translated vectors and dashed variants. The same primitives support all three chapters; SVG clipping keeps infinite span
lines and transformed grids inside the plane.

### Mathematical conventions

Vec2 values are readonly; operations return fresh values. Normalizing a zero
vector returns (0, 0): it has no direction, so we avoid inventing one or returning
NaN. All operations assume finite numeric inputs. Normalize uses Euclidean
length from Math.hypot.

Mat2 uses named row-major entries `{a, b, c, d}` for [[a,b],[c,d]]. Matrix columns
(a,c) and (b,d) are standard basis images. Span classification uses the signed
area of normalized generators with a relative angular tolerance of 1e−9.
Determinants support this geometry; a full determinant lesson is still planned.

### Interaction

Vector components range from −4 to 4. Tips drag with mouse or touch and snap to
half-unit increments; sliders and numeric controls are always available. Scalars
range from −2 to 2. The plot expands to fit the resulting vector. A translated,
dashed copy of w shows tip-to-tail addition. The origin challenge detects any
pair whose sum is zero within a 1e−6 tolerance. Reset restores vectors and scalar.
Reduced-motion preferences disable smooth scrolling and automatic grid animation.

Chapter 2 adds draggable generators, coefficients from −3 to 3, plane/line/point
span shading, presets, and a (1,3) target challenge. Shading represents all real
combinations even though controls are bounded.

Chapter 3 has an editable 2×2 matrix (entries −2 to 2), a draggable test vector,
a transformed grid and unit square, six presets, and a basis-image challenge.
Animation and a 0–100% scrubber interpolate from identity: Aₜ = (1−t)I+tA.
This is a path through linear maps, not a rigid-motion simulation: intermediate
matrices can collapse space even if the final matrix is invertible. Matrix edits
stop animation and show the final map immediately. Displayed live equations round
to three decimal places; math operations retain full precision.

## Roadmap

Chapters 1–3 have routes. The other chapters are planned.

- /chapters/01-vectors
- /chapters/02-span-and-basis
- /chapters/03-linear-transformations

1. **Vectors — implemented**
2. **Linear combinations, span and basis — implemented**
3. **Linear transformations and matrices — implemented**
4. Matrix multiplication
5. Determinant
6. Inverse, column space and null space
7. Dot product
8. Cross product
9. Cross products as transformations
10. Cramer’s rule
11. Change of basis
12. Eigenvectors and eigenvalues
13. Abstract vector spaces

The next step is Chapter 4: compose two transformations and connect their
sequential action to matrix multiplication. Matrix-matrix multiplication has not
been implemented yet.

## Current scope

The initial playground is two-dimensional and bounded. Direct dragging is a
visual convenience; labeled inputs provide keyboard access. Lessons do not save
progress. Tests cover pure math and coordinate conversion, not browser gestures
or visual styling.
