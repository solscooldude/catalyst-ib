import {
  inferSubjectId,
  subjectLabel,
  type SchoolTask,
} from "@/lib/school-tasks";

export const SAMPLE_CLASSROOM_TASKS: SchoolTask[] = [
  {
    id: "cls-math-aa-8",
    title: "Math AA problem set 8",
    subject: "Mathematics AA HL",
    subjectId: "math-aa",
    due: "Tomorrow",
    detail: "Integration by parts, questions 4–9. Sample Classroom coursework.",
    source: "classroom",
    courseName: "Mathematics AA HL",
    done: false,
  },
  {
    id: "cls-chem-energy",
    title: "Chemistry SL — energetics review",
    subject: "Chemistry SL",
    subjectId: "chemistry",
    due: "Wed",
    detail: "Hess’s law worksheet. Sample Classroom coursework.",
    source: "classroom",
    courseName: "Chemistry SL",
    done: false,
  },
  {
    id: "cls-eng-io",
    title: "English A IO practice",
    subject: "English A",
    subjectId: "english",
    due: "Thu",
    detail: "Guiding question and extract notes.",
    source: "classroom",
    courseName: "English A Language & Literature",
    done: false,
  },
];

export type ClassroomWork = {
  id: string;
  title: string;
  description?: string;
  dueDate?: { year: number; month: number; day: number };
  courseName?: string;
};

export function classroomWorkToTasks(
  items: ClassroomWork[],
): SchoolTask[] {
  return items.slice(0, 40).map((item) => {
    const title = item.title.trim() || "Classroom task";
    const due = item.dueDate
      ? `${item.dueDate.year}-${String(item.dueDate.month).padStart(2, "0")}-${String(item.dueDate.day).padStart(2, "0")}`
      : "Soon";
    return {
      id: item.id.startsWith("cls-") ? item.id : `cls-${item.id}`.slice(0, 64),
      title: title.slice(0, 120),
      subject:
        item.courseName?.slice(0, 48) || subjectLabel(inferSubjectId(title)),
      subjectId: inferSubjectId(`${item.courseName ?? ""} ${title}`),
      due,
      detail: (item.description || "Synced from Google Classroom.").slice(0, 200),
      source: "classroom" as const,
      courseName: item.courseName?.slice(0, 80),
      done: false,
    };
  });
}
