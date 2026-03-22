import { useEffect, useState } from "react";
import CreatePostEntry from "@/components/post/CreatePostEntry";
import PostList from "@/components/post/PostList";
import { handleGetPosts, handleLikePost, handleAddComment, handleRepostPost, handleDeletePost } from "@/controllers/postController";
import type { Post } from "@/types/post";

export default function Home() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const loadPosts = async () => {
        try {
            setLoading(true);
            const fetchedPosts = await handleGetPosts();
            setPosts(fetchedPosts);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPosts();
    }, []);

    return (
        <div className="space-y-6">
            <CreatePostEntry />

            {error && <p className="text-red-500 text-center">{error}</p>}

            <PostList
                posts={posts}
                loading={loading}
                onLike={async (postId) => {
                    try {
                        const { status, count } = await handleLikePost(postId);
                        setPosts(posts.map(p => {
                            if (p.id === postId) {
                                return { ...p, likes: count, isLikedByUser: status === "liked" };
                            }
                            return p;
                        }));
                    } catch (err) {
                        console.error(err);
                    }
                }}
                onRepost={async (postId) => {
                    try {
                        const { status, count } = await handleRepostPost(postId);
                        setPosts(posts.map(p => {
                            if (p.id === postId) {
                                return { ...p, reposts: count, isRepostedByUser: status === "reposted" };
                            }
                            return p;
                        }));
                    } catch (err) {
                        console.error(err);
                    }
                }}
                onComment={async (postId, commentText) => {
                    try {
                        const updatedPost = await handleAddComment(postId, commentText, "Current User");
                        setPosts(posts.map(p => p.id === postId ? updatedPost : p));
                    } catch (err) {
                        console.error(err);
                    }
                }}
                onDelete={async (postId) => {
                    const success = await handleDeletePost(postId, () => {}, setError);
                    if (success) {
                        setPosts(posts.filter(p => p.id !== postId));
                    }
                }}
            />
        </div>
    );
}