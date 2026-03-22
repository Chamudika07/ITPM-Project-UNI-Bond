import {
  createPost,
  getPosts,
  getUserPosts,
  likePost,
  addComment,
  repostPost,
  deletePost,
  updatePost,
} from "@/models/postModel";
import type { Post } from "@/types/post";

export const handleCreatePost = async (
  postData: Omit<Post, "id" | "likes" | "commentsCount" | "reposts" | "createdAt" | "isLikedByUser" | "isRepostedByUser" | "comments">,
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

export const handleGetUserPosts = async (userId: string): Promise<Post[]> => {
  return await getUserPosts(userId);
};

export const handleLikePost = async (postId: string): Promise<{status: string, count: number}> => {
  return await likePost(postId);
};

export const handleAddComment = async (
  postId: string,
  commentText: string
): Promise<Post> => {
  return await addComment(postId, commentText);
};

export const handleRepostPost = async (postId: string): Promise<{status: string, count: number}> => {
  return await repostPost(postId);
};

export const handleDeletePost = async (
  postId: string,
  setLoading: (value: boolean) => void,
  setError: (value: string) => void
): Promise<boolean> => {
  try {
    setLoading(true);
    await deletePost(postId);
    return true;
  } catch (error: unknown) {
    setError(error instanceof Error ? error.message : "Failed to delete post");
    return false;
  } finally {
    setLoading(false);
  }
};

export const handleUpdatePost = async (
  postId: string,
  postData: Partial<Pick<Post, "content" | "mediaUrl" | "mediaType">>,
  setLoading: (value: boolean) => void,
  setError: (value: string) => void
) => {
  try {
    setLoading(true);
    return await updatePost(postId, postData);
  } catch (error: unknown) {
    setError(error instanceof Error ? error.message : "Failed to update post");
    return null;
  } finally {
    setLoading(false);
  }
};