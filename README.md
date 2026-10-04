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
Chapter 4 composes two editable maps, follows their action in stages, and compares multiplication order.
Chapters 5–7 connect signed area, solution spaces, and projection. Chapters 8–9
explore oriented area and cross-product maps in a labeled 3D projection. Chapters
10–12 cover area-based solving, basis translation, and real/complex eigenstructure.
Chapter 13 applies the same ideas to polynomials and differentiation.

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

## Docker

The multi-stage Dockerfile installs locked dependencies, builds Next.js, and
copies only its standalone server, static files, and public assets into a
Node.js 24 runtime image. The server runs as the unprivileged `node` user.
The whitelist-style `.dockerignore` excludes local dependencies, build output,
Git history, and unrelated files from the build context.

```sh
docker build -t linearlens .
docker run --rm -p 3000:3000 linearlens
# Or: make docker-build && make docker-run
```

Open http://localhost:3000. To use a different host port, change the mapping,
for example `-p 8080:3000`. The container listens on all interfaces on port 3000.
Next.js automatically discovers `src/app/icon.svg` as the browser favicon.

## Cloudflare Workers

Workers serves a static Next.js export. The lessons and playgrounds run in the
browser, so this deployment needs no Next.js adapter or server-side Worker code.
The default build still produces the standalone server used by Docker.

```sh
npx cf auth login          # First-time Cloudflare authentication
npm run build:static       # Export pages, scripts, styles, and favicon into out/
npm run preview:workers    # Build and start the CLI-selected development server
npm run deploy:workers     # Build and publish the linearlens Worker
# Equivalent Make targets: build-static, preview-workers, deploy-workers
```

`cloudflare.config.ts` defines the Worker and asset routing.
`wrangler.config.ts` points the CLI implementation at `out/`. Both configurations
are tracked; build output and local Cloudflare state are ignored by Git.
Cloudflare CLI requires Node.js 22 or newer. Use `make check-workers` to validate
a deployment without uploading it.

For Cloudflare Git builds, use `npm run build:workers` as the build command and
`npx cf deploy --prebuilt` as the deploy command. Future request-time server features
would require revisiting the static export deployment.

## Stack and architecture

Next.js App Router, React, strict TypeScript, Tailwind CSS, SVG, KaTeX, and Vitest.
No backend, charting library, global state library, or third-party math library.
Production builds use Next.js’s Webpack option to support development sandboxes
that restrict Turbopack’s worker ports; development uses the default Turbopack.

- `src/math/`: pure TypeScript vector, matrix, determinant, inverse, solution-space, projection, cross-product, basis translation, eigenstructure, and polynomial operations, plus tests.
- `src/components/math/`: shared SVG primitives, span region, transformed grid and square, controls, and notation.
- `src/chapters/`: original lesson content, local playground state, and a shared course registry. Chapters 5–13 live in `advanced/`.
- `src/components/lesson/`: shared lesson layout for Chapters 2–13 with appropriate lab labels.
- `src/app/`: course home, all thirteen chapter routes, shared layout, and responsive styles.
- `src/components/layout/`: shared navigation.

The dependency flow is **math → visualization → interaction → lesson**.
CoordinatePlane provides a shared SVG coordinate context. Equal scale on each
axis preserves geometry, and y is inverted centrally to map mathematical
coordinates to SVG. The square viewBox resizes without changing vector angles.
VectorArrow accepts a start and either an end or a displacement, supporting
translated vectors and dashed variants. The same primitives support the planar lessons; SVG clipping keeps span lines
and transformed grids inside the plane. The spatial lessons use a separate
oblique projection with labeled x, y, z axes. Function plots use independent
axis scales to keep the sampled interval legible.

### Mathematical conventions

Vec2 values are readonly; operations return fresh values. Normalizing a zero
vector returns (0, 0): it has no direction, so we avoid inventing one or returning
NaN. All operations assume finite numeric inputs. Normalize uses Euclidean
length from Math.hypot.

Mat2 uses named row-major entries `{a, b, c, d}` for [[a,b],[c,d]]. Matrix columns
(a,c) and (b,d) are standard basis images. Span classification uses the signed
area of normalized generators with a relative angular tolerance of 1e−9.
multiplyMatrices(A, B) applies B first, then A. Product columns are A applied
to B’s columns. The determinant lesson measures signed area. Inverses and solution spaces share
the span classifier’s relative angular tolerance: numerically dependent columns
are treated as singular. A zero matrix has rank zero and the whole input plane
as its kernel. Eigenvalue discriminants use a relative tolerance of 1e−10;
values within that tolerance are treated as repeated. Numeric displays round to
three decimals while calculations retain full precision.

### Appearance

The header’s compact appearance switch uses sun, moon, and monitor icons for
Light, Dark, and System, with a raised selected segment. The native radio group
supports Tab and arrow keys, labeled tooltips, and a visible focus ring. System follows
the operating system and updates when its appearance changes. The preference
is saved locally and synchronized across tabs. A small script applies the theme
before first paint to avoid a flash; theme controls also work when storage is
unavailable. SVG colors and mathematical notation use the same theme palette.

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

Chapter 4 provides two editable matrices, order comparison (AB versus BA),
a draggable test vector, stage buttons, and a manual 0–200% journey scrubber.
The second stage applies the second map to the first map’s output. Presets
include noncommuting maps, commuting scales, and a collapse. A challenge checks
that two nonidentity matrices compose to identity within a 1e−6 tolerance.
There is no automatic animation in this chapter.

## Complete course

All thirteen chapters are implemented and linked from the course home, with
previous/next navigation through the learning path.

| Chapter                   | Route                                        | Playground                                  |
| ------------------------- | -------------------------------------------- | ------------------------------------------- |
| 01 Vectors                | /chapters/01-vectors                         | Addition and scaling                        |
| 02 Span and basis         | /chapters/02-span-and-basis                  | Linear combinations and reachable targets   |
| 03 Linear transformations | /chapters/03-linear-transformations          | Basis images and mapped grids               |
| 04 Matrix multiplication  | /chapters/04-matrix-multiplication           | Composition and order                       |
| 05 Determinant            | /chapters/05-determinant                     | Signed area, orientation, collapse          |
| 06 Inverse and spaces     | /chapters/06-inverse-column-space-null-space | Unique, infinite, and impossible preimages  |
| 07 Dot product            | /chapters/07-dot-product                     | Alignment, angle, orthogonal projection     |
| 08 Cross product          | /chapters/08-cross-product                   | 3D area and normal direction                |
| 09 Cross product maps     | /chapters/09-cross-product-transformations   | Skew matrix, kernel, image plane            |
| 10 Cramer’s rule          | /chapters/10-cramers-rule                    | Column replacement and signed area ratios   |
| 11 Change of basis        | /chapters/11-change-of-basis                 | Vector coordinates and B⁻¹AB                |
| 12 Eigenvectors           | /chapters/12-eigenvectors-and-eigenvalues    | Real eigenspaces and complex pairs          |
| 13 Abstract spaces        | /chapters/13-abstract-vector-spaces          | Polynomial combinations and differentiation |

The new labs include labeled keyboard controls, presets, reset actions, live
formulas, experiments, and challenges. Singular systems never divide by zero:
the inverse and Cramer labs distinguish no solution from infinitely many.
Dependent basis columns disable coordinate translation. The dot-product lab
omits undefined angles and projections for zero directions. The eigenvector lab
excludes the zero vector, handles scalar and defective repeated-eigenvalue maps,
and reports complex pairs when no real eigenvectors exist.

Cross-product components range from −3 to 3. The drawing is an oblique projection
of 3D vectors: projected lengths and angles are distorted, so component, area,
and orthogonality readouts use actual 3D calculations. Chapter 9 holds u fixed to
view v ↦ u × v as a matrix action. Polynomial coefficients and combination weights
range from −2 to 2. Curves are sampled on −2 ≤ t ≤ 2; the derivative matrix maps
three input coefficients in P₂ to two output coefficients in P₁.

## Current scope

Planar vectors and matrices remain bounded interactive examples. The spatial
labs use a fixed 3D projection rather than a camera with orbit controls. Direct
dragging is a visual convenience; labeled inputs provide keyboard access.
Lessons do not save progress. Unit tests cover pure math, degenerate cases,
course-route coverage, and strict parsing of lesson formulas. Browser checks
verify representative controls and live outputs; gesture automation is not
part of the unit test suite.
