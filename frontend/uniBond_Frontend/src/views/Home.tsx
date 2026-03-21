import { useEffect, useState } from "react";
import CreatePostEntry from "@/components/post/CreatePostEntry";
import PostList from "@/components/post/PostList";
import { handleGetPosts, handleLikePost, handleAddComment, handleRepostPost } from "@/controllers/postController";
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
                        const updatedPost = await handleLikePost(postId);
                        setPosts(posts.map(p => p.id === postId ? updatedPost : p));
                    } catch (err) {
                        console.error(err);
                    }
                }}
                onRepost={async (postId) => {
                    try {
                        await handleRepostPost(postId);
                        await loadPosts(); // Reposting might create a new post, so reload all
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
            />
        </div>
    );
}