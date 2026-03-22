import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuthHook";
import { ROUTES } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import ProfileHeader from "./ProfileHeader";
import ProfileLeftColumn from "./ProfileLeftColumn";
import RoleSpecificSection from "./RoleSpecificSection";
import CreatePostEntry from "@/components/post/CreatePostEntry";
import PostList from "@/components/post/PostList";
import { handleGetUserPosts, handleLikePost, handleAddComment, handleRepostPost } from "@/controllers/postController";
import type { Post } from "@/types/post";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await handleGetUserPosts(user.id);
      setPosts(data);
    } catch (error) {
      console.error("Failed to load user posts", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="max-w-5xl mx-auto pb-10">
      <ProfileHeader user={user} onLogout={handleLogout} />
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:px-0 mt-4">
        {/* Left Column */}
        <div className="md:col-span-5 lg:col-span-4">
          <ProfileLeftColumn user={user} />
        </div>
        
        {/* Center / Right Column */}
        <div className="md:col-span-7 lg:col-span-8 space-y-4">
          <RoleSpecificSection user={user} />
          
          <CreatePostEntry />
          
          <div className="mt-4">
             <h3 className="font-bold text-gray-900 mb-4 px-2 tracking-tight">Recent Posts</h3>
             {posts.length > 0 ? (
                 <PostList 
                    posts={posts}
                    loading={loading}
                    onLike={async (postId) => {
                        const { status, count } = await handleLikePost(postId);
                        setPosts(posts.map(p => {
                            if (p.id === postId) {
                                return { ...p, likes: count, isLikedByUser: status === "liked" };
                            }
                            return p;
                        }));
                    }}
                    onRepost={async (postId) => {
                        const { status, count } = await handleRepostPost(postId);
                        setPosts(posts.map(p => {
                            if (p.id === postId) {
                                return { ...p, reposts: count, isRepostedByUser: status === "reposted" };
                            }
                            return p;
                        }));
                        await fetchPosts();
                    }}
                    onComment={async (postId, commentText) => {
                        const updatedPost = await handleAddComment(postId, commentText);
                        setPosts(posts.map(p => p.id === postId ? updatedPost : p));
                    }}
                 />
             ) : (
                <div className="bg-white p-8 rounded-2xl shadow-sm text-center border border-gray-100">
                    <p className="text-gray-600 font-medium">No posts to display yet.</p>
                    <p className="text-gray-400 text-sm mt-1">When you publish or repost something, it will appear here on your timeline.</p>
                </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}