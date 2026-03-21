export type Post = {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorRole: "student" | "lecturer" | "company";
  content: string;
  mediaType?: "image" | "video";
  mediaUrl?: string;
  likes: number;
  commentsCount: number;
  reposts: number;
  createdAt: string;
};