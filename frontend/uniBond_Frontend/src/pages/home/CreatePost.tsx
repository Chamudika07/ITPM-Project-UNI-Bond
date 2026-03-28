import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Image, Video, X, Upload } from "lucide-react";
import SectionCard from "@/components/common/SectionCard";
import { handleCreatePostWithFile } from "@/controllers/postController";
import { ROUTES } from "@/utils/constants";
import { useAuth } from "@/hooks/useAuthHook";
import {
  ALL_MEDIA_ACCEPT_ATTR,
  IMAGE_ACCEPT_ATTR,
  VIDEO_ACCEPT_ATTR,
  validatePickedMediaFile,
} from "@/utils/mediaUploadValidation";

export default function CreatePost() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // ── State ──────────────────────────────────────────────────────────────────
  const [content, setContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<"image" | "video" | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Pre-select media type from navigation state (e.g. from "Video" shortcut) ──
  useEffect(() => {
    if (location.state?.defaultMediaType === "video" && fileInputRef.current) {
      // Just open file picker — user can select a video
      fileInputRef.current.accept = VIDEO_ACCEPT_ATTR;
    }
  }, [location.state]);

  // ── Clean up object URL to prevent memory leaks ────────────────────────────
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  if (!user) return null;

  // ── File picker handler ────────────────────────────────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side MIME type + size validation (strict whitelist).
    const validation = validatePickedMediaFile(file);
    if (!validation.ok) {
      setError(validation.error);
      resetFile();
      return;
    }

    // Generate an object URL for preview (browser memory only, not uploaded yet)
    const objectUrl = URL.createObjectURL(file);

    setError("");
    setSelectedFile(file);
    setPreviewUrl(objectUrl);
    setPreviewType(validation.mediaKind);
  };

  const resetFile = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
    setPreviewType(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Form submit ────────────────────────────────────────────────────────────
  const submitPost = async () => {
    setError("");

    if (!content.trim() && !selectedFile) {
      setError("Please write something or attach a file.");
      return;
    }

    const res = await handleCreatePostWithFile(
      content.trim(),
      selectedFile ?? undefined,
      setLoading,
      setError
    );

    if (res) {
      navigate(ROUTES.HOME);
    }
  };

  // ── UI ─────────────────────────────────────────────────────────────────────
  return (
    <SectionCard title="Create New Post">
      <div className="space-y-4">

        {/* ── Text content ─────────────────────────────────────────────── */}
        <textarea
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className="w-full border border-gray-200 rounded-xl p-3 text-sm resize-none
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     transition placeholder-gray-400"
        />

        {/* ── File preview (shown after user picks a file) ──────────────── */}
        {previewUrl && (
          <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
            {/* Remove file button */}
            <button
              onClick={resetFile}
              className="absolute top-2 right-2 z-10 bg-white rounded-full p-1 shadow
                         hover:bg-red-50 hover:text-red-500 transition-colors"
              title="Remove file"
            >
              <X className="w-4 h-4" />
            </button>

            {previewType === "image" ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full max-h-72 object-cover"
              />
            ) : (
              <video
                src={previewUrl}
                controls
                className="w-full max-h-72 rounded-xl"
              />
            )}
          </div>
        )}

        {/* ── File picker row ────────────────────────────────────────────── */}
        <div className="flex items-center gap-3">
          {/* Hidden real file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept={ALL_MEDIA_ACCEPT_ATTR}
            onChange={handleFileChange}
            className="hidden"
            id="post-file-input"
          />

          {/* Image shortcut button */}
          <label
            htmlFor="post-file-input"
            onClick={() => {
              if (fileInputRef.current) fileInputRef.current.accept = IMAGE_ACCEPT_ATTR;
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium
                       text-blue-600 bg-blue-50 hover:bg-blue-100 cursor-pointer transition-colors"
          >
            <Image className="w-4 h-4" />
            Photo
          </label>

          {/* Video shortcut button */}
          <label
            htmlFor="post-file-input"
            onClick={() => {
              if (fileInputRef.current) fileInputRef.current.accept = VIDEO_ACCEPT_ATTR;
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium
                       text-purple-600 bg-purple-50 hover:bg-purple-100 cursor-pointer transition-colors"
          >
            <Video className="w-4 h-4" />
            Video
          </label>

          {/* Selected file name pill */}
          {selectedFile && (
            <span className="text-xs text-gray-500 truncate max-w-[180px]">
              📎 {selectedFile.name}
            </span>
          )}
        </div>

        {/* ── Error message ─────────────────────────────────────────────── */}
        {error && (
          <div className="flex items-start gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm">
            <span className="mt-0.5">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* ── Action buttons ────────────────────────────────────────────── */}
        <div className="flex gap-3 pt-1">
          <button
            onClick={submitPost}
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-semibold
                       hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                {/* Spinner */}
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Post
              </>
            )}
          </button>

          <button
            onClick={() => navigate(ROUTES.HOME)}
            className="bg-gray-100 text-gray-600 px-5 py-2 rounded-lg text-sm font-semibold
                       hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>

      </div>
    </SectionCard>
  );
}
