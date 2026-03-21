import type { Notice } from "@/types/notice";

const notices: Notice[] = [
  {
    id: "notice1",
    title: "Exam Schedule Update",
    content: "Final exams will start next Monday. Check your emails for details.",
    type: "official",
    createdAt: new Date().toISOString(),
    authorName: "Admin",
    isPinned: true,
  },
  {
    id: "notice2",
    title: "Group Project Deadline",
    content: "Submit your group projects by Friday.",
    type: "department",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    authorName: "Prof. Silva",
  },
  {
    id: "notice3",
    title: "Internship Opportunity",
    content: "TechCorp is hiring interns. Apply now!",
    type: "general",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    authorName: "HR Team",
  },
];

export const mockGetNotices = (): Promise<Notice[]> => {
  return Promise.resolve(notices);
};