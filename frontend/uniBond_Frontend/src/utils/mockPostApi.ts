import type { Post, Comment } from "@/types/post";

let posts: Post[] = [
  {
    id: "1",
    authorName: "Chamudika",
    authorRole: "student",
    content: "Welcome to UniBond! This is my first post.",
    likes: 2,
    comments: [
      {
        id: "c1",
        username: "Nimal",
        text: "Nice post!",
        createdAt: new Date().toISOString(),
      },
    ],
    reposts: 0,
    createdAt: new Date().toISOString(),
  },
];

export const mockCreatePost = (
  newPost: Omit<Post, "id" | "likes" | "comments" | "reposts" | "createdAt">
): Promise<{ message: string; post: Post }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const post: Post = {
        id: crypto.randomUUID(),
        ...newPost,
        likes: 0,
        comments: [],
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
  commentText: string,
  username: string
): Promise<Post> => {
  return new Promise((resolve, reject) => {
    const post = posts.find((p) => p.id === postId);
    if (!post) return reject(new Error("Post not found"));

    const newComment: Comment = {
      id: crypto.randomUUID(),
      username,
      text: commentText,
      createdAt: new Date().toISOString(),
    };

    const updated = { ...post, comments: [...post.comments, newComment] };
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