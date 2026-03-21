export type Notice = {
  id: string;
  title: string;
  content: string;
  category: "study" | "task" | "position";
  createdAt: string;
  authorName: string;
  authorRole: "student" | "lecturer" | "company";
};