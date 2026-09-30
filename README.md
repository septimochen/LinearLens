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

- `src/math/`: pure TypeScript vector operations and coordinate conversion, plus tests.
- `src/components/math/`: CoordinatePlane, Grid, VectorArrow, Point, and MathNotation.
- `src/chapters/vectors/`: lesson content and local playground interaction state.
- `src/app/`: course home, Chapter 1 route, shared layout, and responsive styles.
- `src/components/layout/`: shared navigation.

The dependency flow is **math → visualization → interaction → lesson**.
CoordinatePlane provides a shared SVG coordinate context. Equal scale on each
axis preserves geometry, and y is inverted centrally to map mathematical
coordinates to SVG. The square viewBox resizes without changing vector angles.
VectorArrow accepts a start and either an end or a displacement, supporting
translated vectors and dashed variants. These primitives can support future
basis and transformation lessons without coupling the math to React.

### Mathematical conventions

Vec2 values are readonly; operations return fresh values. Normalizing a zero
vector returns (0, 0): it has no direction, so we avoid inventing one or returning
NaN. All operations assume finite numeric inputs. Normalize uses Euclidean
length from Math.hypot.

### Interaction

Vector components range from −4 to 4. Tips drag with mouse or touch and snap to
half-unit increments; sliders and numeric controls are always available. Scalars
range from −2 to 2. The plot expands to fit the resulting vector. A translated,
dashed copy of w shows tip-to-tail addition. The origin challenge detects any
pair whose sum is zero within a 1e−6 tolerance. Reset restores vectors and scalar.
Reduced-motion preferences disable smooth scrolling.

## Roadmap

Only Chapter 1 has a route. The other chapters are planned.

1. **Vectors — implemented**
2. Linear combinations, span and basis
3. Linear transformations and matrices
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

The next step is Chapter 2: draggable basis vectors and two coefficients that
form a linear combination, followed by visual experiments with span and linear
independence. Add matrix operations only when the transformation lessons need
them.

## Current scope

The initial playground is two-dimensional and bounded. Direct dragging is a
visual convenience; labeled inputs provide keyboard access. Lessons do not save
progress. Tests cover pure math and coordinate conversion, not browser gestures
or visual styling.
