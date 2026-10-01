import { AdvancedLesson } from "@/chapters/advanced/AdvancedLesson";
import { chapters } from "@/chapters/course";
export const metadata = { title: chapters[6].title };
export default function Lesson() {
  return <AdvancedLesson number={7} />;
}
