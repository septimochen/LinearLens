import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
export function Header() {
  return (
    <header className="site-header">
      <Link className="brand" href="/">
        <span className="brand-mark">↗</span>Linear
        <span className="brand-light">Lens</span>
      </Link>
      <nav aria-label="Main navigation">
        <Link href="/">The course</Link>
        <Link href="/chapters/01-vectors">
          Vector lab <span aria-hidden="true">↗</span>
        </Link>
      </nav>
      <div className="header-controls">
        <span className="header-note">A NEW WAY TO SEE MATH</span>
        <ThemeToggle />
      </div>
    </header>
  );
}
