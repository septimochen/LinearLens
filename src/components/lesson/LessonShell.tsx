import Link from "next/link";
import type { ReactNode } from "react";
import { MathNotation } from "@/components/math/MathNotation";
type Note = { title: string; text: string; formula: string };
export function LessonShell({
  number,
  title,
  subtitle,
  description,
  intuition,
  formula,
  children,
  notes,
  experiments,
  summary,
  summaryTitle,
  next,
  previous,
}: {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  intuition: string;
  formula: string;
  children: ReactNode;
  notes: Note[];
  experiments: { title: string; text: string }[];
  summary: string;
  summaryTitle: string;
  next?: { href: string; title: string };
  previous: { href: string; title: string };
}) {
  return (
    <main className="lesson-page">
      <div className="breadcrumb">
        <Link href="/">THE COURSE</Link>
        <span>/</span>
        <span>
          {number} — {title.toUpperCase()}
        </span>
      </div>
      <section className="chapter-hero">
        <div>
          <span className="eyebrow">
            <span className="green-dot" /> CHAPTER {number} · BUILD ON YOUR
            INTUITION
          </span>
          <h1>
            {title}.<br />
            <span className="serif-italic">{subtitle}</span>
          </h1>
          <p>{description}</p>
        </div>
        <div className="chapter-stamp">
          <span>{number}</span>
          <p>
            EXPLORE
            <br />
            THEN UNDERSTAND
          </p>
        </div>
      </section>
      <div className="lesson-meta">
        <span>↗ INTERACTIVE 2D LAB</span>
        <span>◷ 15 MIN EXPLORATION</span>
        <Link href={previous.href}>
          PREVIOUS: {previous.title.toUpperCase()}
        </Link>
      </div>
      <section className="intuition">
        <span className="section-number">01 / INTUITION</span>
        <div>
          <h2>{notes[0].title}</h2>
          <p>{intuition}</p>
          <div className="lesson-formula">
            <MathNotation formula={formula} />
          </div>
        </div>
      </section>
      {children}
      <section className="explanation-grid">
        {notes.map((note, index) => (
          <article key={note.title}>
            <span className="section-number">0{index + 2} / THE IDEA</span>
            <h2>{note.title}</h2>
            <p>{note.text}</p>
            <MathNotation formula={note.formula} />
          </article>
        ))}
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
          {experiments.map((e, index) => (
            <article key={e.title}>
              <span className="experiment-number">0{index + 1}</span>
              <h3>{e.title}</h3>
              <p>{e.text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="summary">
        <span className="eyebrow">TAKE THIS WITH YOU</span>
        <h2>{summaryTitle}</h2>
        <p>{summary}</p>
        <div className="chapter-navigation">
          <Link href={previous.href}>← {previous.title}</Link>
          <Link href={next?.href ?? "/"}>
            {next?.title ?? "Explore the course"} →
          </Link>
        </div>
      </section>
    </main>
  );
}
