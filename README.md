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
npx wrangler login          # First-time Cloudflare authentication
npm run build:static       # Export pages, scripts, styles, and favicon into out/
npm run preview:workers    # Build and preview with the local Workers runtime
npm run deploy:workers     # Build and publish the linearlens Worker
# Equivalent Make targets: build-static, preview-workers, deploy-workers
```

`wrangler.jsonc` serves `out/`, preserves directory-index routing, and returns
the exported 404 page for unknown paths. Build output and local Wrangler state
are ignored by Git. Authentication stays in Wrangler’s local configuration.

For Cloudflare Git builds, use `npm run build:static` as the build command and
`npx wrangler deploy` as the deploy command. Future request-time server features
would require revisiting the static export deployment.

## Stack and architecture

Next.js App Router, React, strict TypeScript, Tailwind CSS, SVG, KaTeX, and Vitest.
No backend, charting library, global state library, or third-party math library.
Production builds use Next.js’s Webpack option to support development sandboxes
that restrict Turbopack’s worker ports; development uses the default Turbopack.

- `src/math/`: pure TypeScript vector, linear-combination, span, matrix-vector, matrix multiplication, determinant, and interpolation operations, plus tests.
- `src/components/math/`: shared SVG primitives, span region, transformed grid and square, controls, and notation.
- `src/chapters/{vectors,basis,transformations,composition}/`: original content and local playground interaction state.
- `src/components/lesson/`: shared lesson layout for Chapters 2–4.
- `src/app/`: course home, Chapters 1–4 routes, shared layout, and responsive styles.
- `src/components/layout/`: shared navigation.

The dependency flow is **math → visualization → interaction → lesson**.
CoordinatePlane provides a shared SVG coordinate context. Equal scale on each
axis preserves geometry, and y is inverted centrally to map mathematical
coordinates to SVG. The square viewBox resizes without changing vector angles.
VectorArrow accepts a start and either an end or a displacement, supporting
translated vectors and dashed variants. The same primitives support all four chapters; SVG clipping keeps infinite span
lines and transformed grids inside the plane.

### Mathematical conventions

Vec2 values are readonly; operations return fresh values. Normalizing a zero
vector returns (0, 0): it has no direction, so we avoid inventing one or returning
NaN. All operations assume finite numeric inputs. Normalize uses Euclidean
length from Math.hypot.

Mat2 uses named row-major entries `{a, b, c, d}` for [[a,b],[c,d]]. Matrix columns
(a,c) and (b,d) are standard basis images. Span classification uses the signed
area of normalized generators with a relative angular tolerance of 1e−9.
multiplyMatrices(A, B) applies B first, then A. Product columns are A applied
to B’s columns. Determinants support this geometry; a full determinant lesson is still planned.

### Appearance

The header theme dropdown offers Light, Dark, and System. System follows
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

## Roadmap

Chapters 1–4 have routes. The other chapters are planned.

- /chapters/01-vectors
- /chapters/02-span-and-basis
- /chapters/03-linear-transformations
- /chapters/04-matrix-multiplication

1. **Vectors — implemented**
2. **Linear combinations, span and basis — implemented**
3. **Linear transformations and matrices — implemented**
4. **Matrix multiplication — implemented**
5. Determinant
6. Inverse, column space and null space
7. Dot product
8. Cross product
9. Cross products as transformations
10. Cramer’s rule
11. Change of basis
12. Eigenvectors and eigenvalues
13. Abstract vector spaces

The next step is Chapter 5: explore determinant as signed area scaling using
the existing transformed unit square.

## Current scope

The initial playground is two-dimensional and bounded. Direct dragging is a
visual convenience; labeled inputs provide keyboard access. Lessons do not save
progress. Tests cover pure math and coordinate conversion, not browser gestures
or visual styling.
