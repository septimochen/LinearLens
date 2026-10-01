import { LessonShell } from "@/components/lesson/LessonShell";
import { CompositionPlayground } from "@/chapters/composition/CompositionPlayground";
import { notes, experiments } from "@/chapters/composition/content";
export const metadata = { title: "Matrix multiplication" };
export default function CompositionLesson() {
  return (
    <LessonShell
      number="04"
      title="Matrix multiplication"
      subtitle="A journey in two steps."
      description="Compose a pair of transformations. Follow the grid through both maps and discover why their order matters."
      intuition="A matrix can act on the result of another matrix. Instead of tracking two separate maps forever, record where their combined action sends the basis. Those destinations define the product."
      formula={"(AB)\\mathbf v=A(B\\mathbf v)"}
      notes={notes}
      experiments={experiments}
      summaryTitle="A product records a composition."
      summary="In AB, B acts first and A acts second. Apply A to each column of B to build the product. Changing the order can change every destination. Grouping three maps differently leaves their combined action unchanged, as long as their order stays fixed."
      next={{ href: "/chapters/05-determinant", title: "Determinant" }}
      previous={{
        href: "/chapters/03-linear-transformations",
        title: "Linear maps",
      }}
    >
      <CompositionPlayground />
    </LessonShell>
  );
}
