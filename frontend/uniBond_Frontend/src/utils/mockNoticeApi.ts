import type { Notice } from "@/types/notice";

let notices: Notice[] = [
  {
    id: "notice1",
    title: "Exam Schedule Update",
    content: "Final exams will start next Monday. Check your emails for details.",
    category: "study",
    createdAt: new Date().toISOString(),
    authorName: "Admin",
    authorRole: "lecturer",
  },
  {
    id: "notice2",
    title: "Group Project Deadline",
    content: "Submit your group projects by Friday.",
    category: "task",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    authorName: "Prof. Silva",
    authorRole: "lecturer",
  },
  {
    id: "notice3",
    title: "Internship Opportunity",
    content: "TechCorp is hiring interns. Apply now!",
    category: "position",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    authorName: "HR Team",
    authorRole: "company",
  },
];

export const mockGetNotices = (): Promise<Notice[]> => {
  return Promise.resolve(notices);
};