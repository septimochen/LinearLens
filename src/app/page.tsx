import Link from "next/link";
import { roadmap } from "@/chapters/vectors/content";
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
                  stroke="#deded3"
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
            <path d="M0 280H420 M140 0V420" stroke="#a6aaa0" />
            <path
              d="M140 280L315 175"
              stroke="#397462"
              strokeWidth="4"
              markerEnd="url(#home-arrow)"
            />
            <path
              d="M315 175L245 70"
              stroke="#bf7851"
              strokeWidth="3"
              strokeDasharray="6 5"
              markerEnd="url(#home-arrow)"
            />
            <path
              d="M140 280L245 70"
              stroke="#737ca6"
              strokeWidth="4"
              markerEnd="url(#home-arrow)"
            />
            <text
              x="313"
              y="204"
              fill="#397462"
              fontSize="23"
              fontStyle="italic"
            >
              v
            </text>
            <text
              x="269"
              y="109"
              fill="#bf7851"
              fontSize="23"
              fontStyle="italic"
            >
              w
            </text>
            <text
              x="190"
              y="130"
              fill="#737ca6"
              fontSize="23"
              fontStyle="italic"
            >
              v + w
            </text>
            <circle cx="140" cy="280" r="5" fill="#303d34" />
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
          <span className="muted">01 chapter ready to explore</span>
        </div>
        {roadmap.map((title, index) =>
          index === 0 ? (
            <Link
              href="/chapters/01-vectors"
              className="chapter-row available"
              key={title}
            >
              <span className="chapter-index">01</span>
              <div>
                <h3>{title}</h3>
                <p>Movements, components, and the art of adding arrows.</p>
              </div>
              <span className="chapter-badge">
                EXPLORE <span>↗</span>
              </span>
            </Link>
          ) : (
            <div className="chapter-row" key={title}>
              <span className="chapter-index">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3>{title}</h3>
              <span className="coming-later">Coming later</span>
            </div>
          ),
        )}
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
