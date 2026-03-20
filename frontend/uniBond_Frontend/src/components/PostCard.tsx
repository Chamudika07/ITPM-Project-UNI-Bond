import { useState } from "react";
import type { Post } from "../types/post";

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
        <div className="bg-white shadow-md rounded-xl p-4 mb-4">
            <div className="mb-3">
                <h3 className="font-bold text-lg">{post.authorName}</h3>
                <p className="text-sm text-gray-500 capitalize">{post.authorRole}</p>
                <p className="text-xs text-gray-400">
                    {new Date(post.createdAt).toLocaleString()}
                </p>
            </div>

            <p className="mb-3 whitespace-pre-wrap">{post.content}</p>

            {post.mediaUrl && post.mediaType === "image" && (
                <img
                    src={post.mediaUrl}
                    alt="post media"
                    className="w-full `max-h-[400px]` object-cover rounded mb-3"
                />
            )}

            {post.mediaUrl && post.mediaType === "video" && (
                <video controls className="w-full rounded mb-3">
                    <source src={post.mediaUrl} />
                </video>
            )}

            <div className="flex gap-4 mb-3 text-sm">
                <button onClick={() => onLike(post.id)}>👍 Like ({post.likes})</button>
                <button onClick={() => onRepost(post.id)}>🔁 Repost ({post.reposts})</button>
                <span>💬 Comments ({post.comments.length})</span>
            </div>

            <div className="mb-3">
                {post.comments.map((comment) => (
                    <div key={comment.id} className="border-t py-2">
                        <p className="font-medium">{comment.username}</p>
                        <p>{comment.text}</p>
                    </div>
                ))}
            </div>

            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="Write a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="flex-1 border rounded p-2"
                />
                <button
                    onClick={submitComment}
                    className="bg-gray-800 text-white px-3 py-2 rounded"
                >
                    Comment
                </button>
            </div>
        </div>
    );
}