import { useState } from "react";
import type { Post } from "@/types/post";
import Avatar from "@/components/common/Avatar";
import PostActions from "./PostActions";
import { formatDateTime } from "@/utils/formatters";

type Props = {
    post: Post;
    onLike: (postId: string) => void;
    onRepost: (postId: string) => void;
    onComment: (postId: string, commentText: string) => void;
};

export default function PostCard({ post, onLike, onRepost, onComment }: Props) {
    const [commentText, setCommentText] = useState("");

    const submitComment = () => {
        if (!commentText.trim()) return;
        onComment(post.id, commentText);
        setCommentText("");
    };

    return (
        <div className="bg-white shadow-sm rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
                <Avatar src={post.authorAvatar} alt={post.authorName} />
                <div>
                    <h3 className="font-bold text-lg">{post.authorName}</h3>
                    <p className="text-sm text-gray-500 capitalize">{post.authorRole}</p>
                    <p className="text-xs text-gray-400">
                        {formatDateTime(post.createdAt)}
                    </p>
                </div>
            </div>

            <p className="mb-3 whitespace-pre-wrap">{post.content}</p>

            {post.mediaUrl && post.mediaType === "image" && (
                <img
                    src={post.mediaUrl}
                    alt="post media"
                    className="w-full max-h-[400px] object-cover rounded-lg mb-3"
                />
            )}

            {post.mediaUrl && post.mediaType === "video" && (
                <video controls className="w-full rounded-lg mb-3">
                    <source src={post.mediaUrl} />
                </video>
            )}

            <PostActions
                likes={post.likes}
                commentsCount={post.commentsCount}
                reposts={post.reposts}
                onLike={() => onLike(post.id)}
                onComment={() => {}}
                onRepost={() => onRepost(post.id)}
            />

            <div className="flex gap-2 mt-3">
                <input
                    type="text"
                    placeholder="Write a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="flex-1 border rounded-lg p-2 text-sm"
                />
                <button
                    onClick={submitComment}
                    className="bg-gray-800 text-white px-3 py-2 rounded-lg text-sm"
                >
                    Comment
                </button>
            </div>
        </div>
    );
}