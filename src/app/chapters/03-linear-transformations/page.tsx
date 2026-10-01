import { LessonShell } from "@/components/lesson/LessonShell";
import { TransformationPlayground } from "@/chapters/transformations/TransformationPlayground";
import { notes, experiments } from "@/chapters/transformations/content";
export const metadata = { title: "Linear transformations and matrices" };
export default function TransformationLesson() {
  return (
    <LessonShell
      number="03"
      title="Linear maps"
      subtitle="A new shape for space."
      description="Give the basis vectors new destinations. Watch the grid, and every vector on it, follow along."
      intuition="A linear transformation changes vectors while preserving how they combine. Once you decide where the two standard basis vectors land, linearity determines where every other vector must go."
      formula={"T(x,y)=xT(1,0)+yT(0,1)"}
      notes={notes}
      experiments={experiments}
      summaryTitle="A matrix records where the basis goes."
      summary="A 2×2 matrix stores the images of the standard basis in its columns. Matrix-vector multiplication forms their linear combination. A linear map fixes zero and preserves sums and scaling; it can stretch, shear, turn, reflect, or collapse space."
      next={{
        href: "/chapters/04-matrix-multiplication",
        title: "Matrix multiplication",
      }}
      previous={{ href: "/chapters/02-span-and-basis", title: "Span & basis" }}
    >
      <TransformationPlayground />
    </LessonShell>
  );
}
