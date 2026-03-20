import type { Post, Comment } from "../types/post";

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
    }, 500);
  });
};

export const mockGetPosts = (): Promise<Post[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(posts);
    }, 500);
  });
};

export const mockLikePost = (postId: string): Promise<Post[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      posts = posts.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      );
      resolve(posts);
    }, 300);
  });
};

export const mockAddComment = (
  postId: string,
  commentText: string,
  username: string
): Promise<Post[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newComment: Comment = {
        id: crypto.randomUUID(),
        username,
        text: commentText,
        createdAt: new Date().toISOString(),
      };

      posts = posts.map((post) =>
        post.id === postId
          ? { ...post, comments: [...post.comments, newComment] }
          : post
      );

      resolve(posts);
    }, 300);
  });
};

export const mockRepostPost = (postId: string): Promise<Post[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      posts = posts.map((post) =>
        post.id === postId ? { ...post, reposts: post.reposts + 1 } : post
      );
      resolve(posts);
    }, 300);
  });
};