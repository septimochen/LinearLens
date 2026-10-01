import { LessonShell } from "@/components/lesson/LessonShell";
import { chapters, chapterLink } from "@/chapters/course";
import { lessons } from "./content";
import { DeterminantPlayground } from "./DeterminantPlayground";
import { InversePlayground } from "./InversePlayground";
import { DotPlayground } from "./DotPlayground";
import { CrossPlayground } from "./CrossPlayground";
import { CramerPlayground } from "./CramerPlayground";
import { ChangeBasisPlayground } from "./ChangeBasisPlayground";
import { EigenPlayground } from "./EigenPlayground";
import { AbstractPlayground } from "./AbstractPlayground";
const playgrounds = [
  DeterminantPlayground,
  InversePlayground,
  DotPlayground,
  CrossPlayground,
  () => <CrossPlayground transformation />,
  CramerPlayground,
  ChangeBasisPlayground,
  EigenPlayground,
  AbstractPlayground,
];
export function AdvancedLesson({ number }: { number: number }) {
  const lesson = lessons.find((l) => l.number === number);
  if (!lesson) throw new Error(`Unknown chapter ${number}`);
  const Playground = playgrounds[number - 5];
  return (
    <LessonShell
      {...lesson}
      number={String(number).padStart(2, "0")}
      description={chapters[number - 1].description}
      previous={chapterLink(number - 2)}
      next={number < chapters.length ? chapterLink(number) : undefined}
    >
      <Playground />
    </LessonShell>
  );
}
