import {
  createPost,
  getPosts,
  likePost,
  addComment,
  repostPost,
} from "@/models/postModel";
import type { Post } from "@/types/post";

export const handleCreatePost = async (
  postData: Omit<Post, "id" | "likes" | "comments" | "reposts" | "createdAt">,
  setLoading: (value: boolean) => void,
  setError: (value: string) => void
) => {
  try {
    setLoading(true);
    return await createPost(postData);
  } catch (error: unknown) {
    setError(error instanceof Error ? error.message : "Failed to create post");
    return null;
  } finally {
    setLoading(false);
  }
};

export const handleGetPosts = async (): Promise<Post[]> => {
  return await getPosts();
};

export const handleLikePost = async (postId: string): Promise<Post> => {
  return await likePost(postId);
};

export const handleAddComment = async (
  postId: string,
  commentText: string,
  username: string
): Promise<Post> => {
  return await addComment(postId, commentText, username);
};

export const handleRepostPost = async (postId: string): Promise<Post> => {
  return await repostPost(postId);
};