export const validateSearch = (query: string): { isValid: boolean; error?: string } => {
  const trimmed = query.trim();
  if (!trimmed) {
    return { isValid: false, error: "Search query is required" };
  }
  if (trimmed.length < 2) {
    return { isValid: false, error: "Search query must be at least 2 characters" };
  }
  return { isValid: true };
};

export const validatePost = (
  content: string,
  mediaUrl?: string,
  mediaType?: "image" | "video"
): { isValid: boolean; error?: string } => {
  const trimmedContent = content.trim();
  if (!trimmedContent && !mediaUrl) {
    return { isValid: false, error: "Post must have content or media" };
  }
  if (trimmedContent.length > 1000) {
    return { isValid: false, error: "Content must be less than 1000 characters" };
  }
  if (mediaUrl && !mediaType) {
    return { isValid: false, error: "Media type is required if media URL is provided" };
  }
  if (mediaType && !["image", "video"].includes(mediaType)) {
    return { isValid: false, error: "Invalid media type" };
  }
  return { isValid: true };
};
