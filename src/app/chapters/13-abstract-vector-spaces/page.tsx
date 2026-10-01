import { AdvancedLesson } from "@/chapters/advanced/AdvancedLesson";
import { chapters } from "@/chapters/course";
export const metadata = { title: chapters[12].title };
export default function Lesson() {
  return <AdvancedLesson number={13} />;
}
