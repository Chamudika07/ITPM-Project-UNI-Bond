import {
  createPost,
  getPosts,
  likePost,
  addComment,
  repostPost,
} from "../models/postModel";
import type { Post } from "../types/post";

export const handleCreatePost = async (
  postData: Omit<Post, "id" | "likes" | "comments" | "reposts" | "createdAt">,
  setLoading: (value: boolean) => void,
  setError: (value: string) => void
) => {
  try {
    setLoading(true);
    return await createPost(postData);
  } catch (error: unknown) {
    setError(error as string || "Failed to create post");
  } finally {
    setLoading(false);
  }
};

export const handleGetPosts = async (
  setPosts: (posts: Post[]) => void,
  setError: (value: string) => void
) => {
  try {
    const posts = await getPosts();
    setPosts(posts);
  } catch (error: unknown) {
    setError(error as string || "Failed to load posts");
  }
};

export const handleLikePost = async (
  postId: string,
  setPosts: (posts: Post[]) => void
) => {
  const updatedPosts = await likePost(postId);
  setPosts(updatedPosts);
};

export const handleAddComment = async (
  postId: string,
  commentText: string,
  username: string,
  setPosts: (posts: Post[]) => void
) => {
  const updatedPosts = await addComment(postId, commentText, username);
  setPosts(updatedPosts);
};

export const handleRepostPost = async (
  postId: string,
  setPosts: (posts: Post[]) => void
) => {
  const updatedPosts = await repostPost(postId);
  setPosts(updatedPosts);
};