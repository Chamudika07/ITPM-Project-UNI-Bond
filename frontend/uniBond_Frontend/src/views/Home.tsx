import { useEffect, useState } from "react";
import CreatePost from "@/views/CreatePost";
import PostCard from "@/components/PostCard";
import type { Post } from "@/types/post";
import { useAuth } from "@/contexts/AuthContext";
import {
    handleGetPosts,
    handleLikePost,
    handleAddComment,
    handleRepostPost
} from "@/controllers/postController";

export default function Home() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const { user, logout } = useAuth();

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
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        loadPosts();
    }, []);

    if (!user) {
        // This should not happen if ProtectedRoute is used, but it's good practice.
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-2xl mx-auto px-4">
                <header className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">
                        Welcome, {user.firstname}!
                    </h1>
                    <button
                        onClick={logout}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >Logout</button>
                </header>
                <CreatePost
                    user={user}
                    onPostCreated={loadPosts}
                />

                {error && <p className="text-red-500 mb-4">{error}</p>}

                {loading && <p>Loading posts...</p>}

                {!loading && posts.length === 0 && (
                    <p className="text-center text-gray-500">No posts yet. Be the first to post!</p>
                )}

                {!loading &&
                    posts.map((post) => (
                        <PostCard
                            key={post.id}
                            post={post}
                            onLike={async (postId) => {
                                try {
                                    const updatedPost = await handleLikePost(postId);
                                    setPosts(posts.map(p => p.id === postId ? updatedPost : p));
                                } catch (err) {
                                    // Optionally show an error to the user
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
                                    const updatedPost = await handleAddComment(postId, commentText, `${user.firstname} ${user.lastname}`);
                                    setPosts(posts.map(p => p.id === postId ? updatedPost : p));
                                } catch (err) {
                                    console.error(err);
                                }
                            }}
                        />
                    ))}
            </div>
        </div>
    );
}