import { LessonShell } from "@/components/lesson/LessonShell";
import { BasisPlayground } from "@/chapters/basis/BasisPlayground";
import { notes, experiments } from "@/chapters/basis/content";
export const metadata = { title: "Linear combinations, span and basis" };
export default function BasisLesson() {
  return (
    <LessonShell
      number="02"
      title="Span & basis"
      subtitle="What can you reach?"
      description="Choose your directions. Mix your movements. Discover when two arrows can take you anywhere."
      intuition="You already know how to scale and add vectors. Now pick two generators and ask a bigger question: what destinations can all their combinations reach?"
      formula={"\\mathbf r=a\\mathbf u+b\\mathbf v"}
      notes={notes}
      experiments={experiments}
      summaryTitle="A basis is a set of directions with no spare parts."
      summary="Linear combinations build vectors from chosen generators. Span is every possible destination. A basis spans the space with independent directions, so each destination has a unique recipe."
      previous={{ href: "/chapters/01-vectors", title: "Vectors" }}
      next={{
        href: "/chapters/03-linear-transformations",
        title: "Transformations & matrices",
      }}
    >
      <BasisPlayground />
    </LessonShell>
  );
}
