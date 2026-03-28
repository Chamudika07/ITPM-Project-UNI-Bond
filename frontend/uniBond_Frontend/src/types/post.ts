export type Post = {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorRole: "student" | "lecturer" | "company" | "tech_lead" | "admin";
  content: string;
  mediaType?: "image" | "video";
  mediaUrl?: string;
  likes: number;
  commentsCount: number;
  reposts: number;
  isLikedByUser?: boolean;
  isRepostedByUser?: boolean;
  comments?: any[];
  createdAt: string;
};