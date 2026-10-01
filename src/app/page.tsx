import Link from "next/link";
import { chapters } from "@/chapters/course";
export default function Home() {
  return (
    <main className="home-page">
      <section className="home-hero">
        <div>
          <span className="eyebrow">
            <span className="green-dot" /> AN INTERACTIVE MATHEMATICAL NOTEBOOK
          </span>
          <h1>
            Interactive
            <br />
            <span className="serif-italic">Linear Algebra.</span>
          </h1>
          <p>
            Build intuition by manipulating vectors, matrices, and
            transformations.
          </p>
          <Link className="primary-link" href="/chapters/01-vectors">
            Start with vectors <span>↗</span>
          </Link>
          <div className="home-caption">13 ideas. A new way of seeing.</div>
        </div>
        <div className="hero-illustration" aria-hidden="true">
          <svg viewBox="0 0 420 420">
            <defs>
              <pattern
                id="home-grid"
                width="35"
                height="35"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 35 0 L 0 0 0 35"
                  fill="none"
                  stroke="var(--grid)"
                  strokeWidth="1"
                />
              </pattern>
              <marker
                id="home-arrow"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="5"
                markerHeight="5"
                orient="auto"
              >
                <path d="M0 0L10 5L0 10" fill="context-stroke" />
              </marker>
            </defs>
            <rect width="420" height="420" fill="url(#home-grid)" />
            <path d="M0 280H420 M140 0V420" stroke="var(--axis)" />
            <path
              d="M140 280L315 175"
              stroke="var(--green)"
              strokeWidth="4"
              markerEnd="url(#home-arrow)"
            />
            <path
              d="M315 175L245 70"
              stroke="var(--orange)"
              strokeWidth="3"
              strokeDasharray="6 5"
              markerEnd="url(#home-arrow)"
            />
            <path
              d="M140 280L245 70"
              stroke="var(--purple)"
              strokeWidth="4"
              markerEnd="url(#home-arrow)"
            />
            <text
              x="313"
              y="204"
              fill="var(--green)"
              fontSize="23"
              fontStyle="italic"
            >
              v
            </text>
            <text
              x="269"
              y="109"
              fill="var(--orange)"
              fontSize="23"
              fontStyle="italic"
            >
              w
            </text>
            <text
              x="190"
              y="130"
              fill="var(--purple)"
              fontSize="23"
              fontStyle="italic"
            >
              v + w
            </text>
            <circle cx="140" cy="280" r="5" fill="var(--ink)" />
          </svg>
          <span>MOVE A VECTOR. CHANGE YOUR PERSPECTIVE.</span>
        </div>
      </section>
      <section className="course-list">
        <div className="section-heading">
          <div>
            <span className="eyebrow">THE LEARNING PATH</span>
            <h2>Small ideas. Bigger picture.</h2>
          </div>
          <span className="muted">13 chapters ready to explore</span>
        </div>
        {chapters.map((chapter, index) => (
          <Link
            href={`/chapters/${chapter.slug}`}
            className="chapter-row available"
            key={chapter.slug}
          >
            <span className="chapter-index">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <h3>{chapter.title}</h3>
              <p>{chapter.description}</p>
            </div>
            <span className="chapter-badge">
              EXPLORE <span>↗</span>
            </span>
          </Link>
        ))}
      </section>
      <section className="home-note">
        <span className="eyebrow">THE PHILOSOPHY</span>
        <h2>
          Learn linear algebra by manipulating it
          <br />
          and seeing what happens.
        </h2>
        <p>
          Original lessons inspired by studying 3Blue1Brown’s Essence of Linear
          Algebra.
        </p>
      </section>
    </main>
  );
}
