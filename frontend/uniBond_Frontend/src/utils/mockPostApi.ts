import type { Post } from "@/types/post";

let posts: Post[] = [
  {
    id: "1",
    authorId: "user1",
    authorName: "Chamudika",
    authorAvatar: "https://via.placeholder.com/40",
    authorRole: "student",
    content: "Welcome to UniBond! This is my first post.",
    likes: 2,
    commentsCount: 1,
    reposts: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    authorId: "user2",
    authorName: "Dr. Nimal",
    authorAvatar: "https://via.placeholder.com/40",
    authorRole: "lecturer",
    content: "Excited to share knowledge with students.",
    likes: 5,
    commentsCount: 0,
    reposts: 1,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
];

export const mockCreatePost = (
  newPost: Omit<Post, "id" | "likes" | "commentsCount" | "reposts" | "createdAt">
): Promise<{ message: string; post: Post }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const post: Post = {
        id: crypto.randomUUID(),
        ...newPost,
        likes: 0,
        commentsCount: 0,
        reposts: 0,
        createdAt: new Date().toISOString(),
      };
      posts = [post, ...posts];
      resolve({ message: "Post created successfully", post });
    }, 300);
  });
};

export const mockGetPosts = (): Promise<Post[]> => {
  return Promise.resolve(posts);
};

export const mockLikePost = (postId: string): Promise<Post> => {
  return new Promise((resolve, reject) => {
    const post = posts.find((p) => p.id === postId);
    if (!post) return reject(new Error("Post not found"));

    const updated = { ...post, likes: post.likes + 1 };
    posts = posts.map((p) => (p.id === postId ? updated : p));
    resolve(updated);
  });
};

export const mockAddComment = (
  postId: string,
  _commentText: string,
  _username: string
): Promise<Post> => {
  return new Promise((resolve, reject) => {
    const post = posts.find((p) => p.id === postId);
    if (!post) return reject(new Error("Post not found"));

    const updated = { ...post, commentsCount: post.commentsCount + 1 };
    posts = posts.map((p) => (p.id === postId ? updated : p));
    resolve(updated);
  });
};

export const mockRepostPost = (postId: string): Promise<Post> => {
  return new Promise((resolve, reject) => {
    const post = posts.find((p) => p.id === postId);
    if (!post) return reject(new Error("Post not found"));

    const updated = { ...post, reposts: post.reposts + 1 };
    posts = posts.map((p) => (p.id === postId ? updated : p));
    resolve(updated);
  });
};