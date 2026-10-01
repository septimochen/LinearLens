import type { Metadata } from "next";
import "katex/dist/katex.min.css";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { themeInitScript } from "@/components/layout/theme-init";
export const metadata: Metadata = {
  title: {
    default: "LinearLens · Interactive Linear Algebra",
    template: "%s · LinearLens",
  },
  description:
    "Build intuition by manipulating vectors, matrices, and transformations.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="antialiased">
        <Header />
        {children}
        <footer className="site-footer">
          <span>
            LinearLens <span className="footer-dot">/</span> Mathematics, made
            tangible.
          </span>
          <span>Learn by moving things.</span>
        </footer>
      </body>
    </html>
  );
}
