export interface Comment {
  id: string;
  username: string;
  text: string;
  createdAt: string;
}

export interface Post {
  id: string;
  authorName: string;
  authorRole: "student" | "lecturer" | "company";
  content: string;
  mediaUrl?: string;
  mediaType?: "image" | "video";
  likes: number;
  comments: Comment[];
  reposts: number;
  createdAt: string;
}