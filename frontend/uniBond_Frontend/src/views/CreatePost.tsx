import { useState } from "react";
import { handleCreatePost } from "@/controllers/postController";
import Select from "@/components/Select";
import type { User } from "@/types/user";

type MediaType = "image" | "video";

const mediaTypeOptions = [
    { value: "image", label: "Image" },
    { value: "video", label: "Video" },
];

function isMediaType(value: string): value is MediaType {
    return ["image", "video"].includes(value);
}

type Props = {
    onPostCreated: () => void;
    user: User;
};

export default function CreatePost({ onPostCreated, user }: Props) {
    const [content, setContent] = useState("");
    const [mediaUrl, setMediaUrl] = useState("");
    const [mediaType, setMediaType] = useState<MediaType>("image");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const submitPost = async () => {
        setError("");

        if (!content.trim()) {
            setError("Content is required");
            return;
        }

        const res = await handleCreatePost(
            {
                authorName: `${user.firstname} ${user.lastname}`,
                authorRole: user.role,
                content,
                mediaUrl: mediaUrl || undefined,
                mediaType: mediaUrl ? mediaType : undefined,
            },
            setLoading,
            setError
        );

        if (res) {
            setContent("");
            setMediaUrl("");
            onPostCreated();
        }
    };

    const handleMediaTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (isMediaType(e.target.value)) {
            setMediaType(e.target.value);
        }
    };

    return (
        <div className="bg-white shadow-md rounded-xl p-4 mb-6">
            <h2 className="text-xl font-bold mb-4">Create a Post</h2>

            <textarea
                placeholder="Write anything... text, URL, idea, update..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full border rounded p-2 mb-3 min-h-[120px]"
            />

            <div className="flex gap-2 mb-3">
                <input
                    type="text"
                    placeholder="Paste image or video URL (optional)"
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                    className="w-full border rounded p-2"
                />

                <Select
                    value={mediaType}
                    onChange={handleMediaTypeChange}
                    options={mediaTypeOptions}
                    className="border rounded p-2"
                />
            </div>

            <button
                onClick={submitPost}
                className="bg-blue-600 text-white px-4 py-2 rounded"
            >
                {loading ? "Posting..." : "Post"}
            </button>

            {error && <p className="text-red-500 mt-3">{error}</p>}
        </div>
    );
}