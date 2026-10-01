import Link from "next/link";
import { VectorPlayground } from "@/chapters/vectors/VectorPlayground";
import { experiments } from "@/chapters/vectors/content";
import { MathNotation } from "@/components/math/MathNotation";
export const metadata = { title: "Vectors — What even are they?" };
export default function VectorLesson() {
  return (
    <main className="lesson-page">
      <div className="breadcrumb">
        <Link href="/">THE COURSE</Link>
        <span>/</span>
        <span>01 — VECTORS</span>
      </div>
      <section className="chapter-hero">
        <div>
          <span className="eyebrow">
            <span className="green-dot" /> CHAPTER 01 · THE STARTING POINT
          </span>
          <h1>
            Vectors.
            <br />
            <span className="serif-italic">What even are they?</span>
          </h1>
          <p>
            Think of a vector as a little instruction: move this far across,
            <br className="desktop-break" /> then this far up. Let’s see where
            that takes us.
          </p>
        </div>
        <div className="chapter-stamp">
          <span>01</span>
          <p>
            DIRECTION
            <br />
            MEETS MAGNITUDE
          </p>
        </div>
      </section>
      <div className="lesson-meta">
        <span>↗ 2D VECTORS</span>
        <span>◷ 10 MIN EXPLORATION</span>
        <span>NO PREREQUISITES</span>
      </div>
      <section className="intuition">
        <span className="section-number">01 / INTUITION</span>
        <div>
          <h2>A vector is a movement, written down.</h2>
          <p>
            The vector <MathNotation formula={"\\mathbf v = (3, 2)"} /> says “3
            units right, 2 units up.” Its arrow shows direction and length. Move
            the whole arrow somewhere else, and it still describes the same
            displacement.
          </p>
          <div className="component-note">
            <span>
              <b className="text-v">3</b> across
            </span>
            <span>+</span>
            <span>
              <b className="text-w">2</b> up
            </span>
            <span>→</span>
            <span>one vector</span>
          </div>
        </div>
      </section>
      <VectorPlayground />
      <section className="explanation-grid">
        <article>
          <span className="section-number">02 / ADDING MOVEMENTS</span>
          <h2>One step. Then another.</h2>
          <p>
            To add two vectors, put the tail of the second at the tip of the
            first. The dotted arrow in the lab is the same w, just moved. The
            sum connects your starting point to your final destination.
          </p>
          <MathNotation formula="(v_x, v_y) + (w_x, w_y) = (v_x + w_x, v_y + w_y)" />
        </article>
        <article>
          <span className="section-number">03 / SCALING MOVEMENTS</span>
          <h2>Same line. Different journey.</h2>
          <p>
            A scalar is an ordinary number that multiplies every component. A
            factor of 2 doubles the length; a factor of −1 keeps the length and
            reverses direction. Switch modes in the lab to try it.
          </p>
          <MathNotation formula="a(v_x, v_y) = (av_x, av_y)" />
        </article>
      </section>
      <section className="experiments">
        <div className="section-heading">
          <div>
            <span className="eyebrow">LESS READING. MORE DISCOVERY.</span>
            <h2>Try it. Notice what changes.</h2>
          </div>
          <a href="#playground">Back to the lab ↑</a>
        </div>
        <div className="experiment-grid">
          {experiments.map((experiment, index) => (
            <article key={experiment.title}>
              <span className="experiment-number">0{index + 1}</span>
              <h3>{experiment.title}</h3>
              <p>{experiment.text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="summary">
        <span className="eyebrow">TAKE THIS WITH YOU</span>
        <h2>Numbers describe it. Geometry explains it.</h2>
        <p>
          A vector is an ordered list of components and a geometric
          displacement. Addition combines movements. Scalar multiplication
          changes their size and, sometimes, their direction.
        </p>
        <Link href="/chapters/02-span-and-basis">
          Next: Span &amp; basis <span>→</span>
        </Link>
      </section>
    </main>
  );
}
