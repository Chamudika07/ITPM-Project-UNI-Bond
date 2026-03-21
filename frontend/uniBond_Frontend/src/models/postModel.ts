import {
  mockCreatePost,
  mockGetPosts,
  mockLikePost,
  mockAddComment,
  mockRepostPost,
} from "@/services/mock/mockPostApi";
import type { Post } from "@/types/post";

export const createPost = async (
  data: Omit<Post, "id" | "likes" | "commentsCount" | "reposts" | "createdAt">
) => {
  return await mockCreatePost(data);
};

export const getPosts = async (): Promise<Post[]> => {
  return await mockGetPosts();
};

export const likePost = async (postId: string): Promise<Post> => {
  return await mockLikePost(postId);
};

export const addComment = async (
  postId: string,
  commentText: string,
  username: string
): Promise<Post> => {
  return await mockAddComment(postId, commentText, username);
};

export const repostPost = async (postId: string): Promise<Post> => {
  return await mockRepostPost(postId);
};