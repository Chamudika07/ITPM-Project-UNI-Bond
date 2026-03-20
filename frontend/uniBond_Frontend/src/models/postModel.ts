import {
  mockCreatePost,
  mockGetPosts,
  mockLikePost,
  mockAddComment,
  mockRepostPost,
} from "@/utils/mockPostApi";
import type { Post } from "@/types/post";

export const createPost = async (
  data: Omit<Post, "id" | "likes" | "comments" | "reposts" | "createdAt">
) => {
  return await mockCreatePost(data);
};

export const getPosts = async () => {
  return await mockGetPosts();
};

export const likePost = async (postId: string) => {
  return await mockLikePost(postId);
};

export const addComment = async (
  postId: string,
  commentText: string,
  username: string
) => {
  return await mockAddComment(postId, commentText, username);
};

export const repostPost = async (postId: string) => {
  return await mockRepostPost(postId);
};