type Props = {
  mediaUrl: string;
  mediaType: "image" | "video";
  className?: string;
};

export default function MediaPreview({ mediaUrl, mediaType, className = "" }: Props) {
  const resolveMediaSrc = (url: string) => {
    const apiBase =
      ((import.meta as unknown as { env?: { VITE_API_URL?: string } }).env?.VITE_API_URL ??
        "http://localhost:8000");
    const apiBaseNormalized = apiBase.endsWith("/") ? apiBase.slice(0, -1) : apiBase;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    if (url.startsWith("/")) return `${apiBaseNormalized}${url}`;
    return `${apiBaseNormalized}/${url}`;
  };

  const mediaSrc = resolveMediaSrc(mediaUrl);

  if (mediaType === "image") {
    return (
      <img
        src={mediaSrc}
        alt="Media content"
        className={`w-full max-h-[400px] object-cover rounded-lg ${className}`}
      />
    );
  }

  if (mediaType === "video") {
    return (
      <video
        controls
        className={`w-full rounded-lg ${className}`}
      >
        <source src={mediaSrc} />
        Your browser does not support the video tag.
      </video>
    );
  }

  return null;
}