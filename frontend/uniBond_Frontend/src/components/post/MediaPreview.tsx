type Props = {
  mediaUrl: string;
  mediaType: "image" | "video";
  className?: string;
};

export default function MediaPreview({ mediaUrl, mediaType, className = "" }: Props) {
  if (mediaType === "image") {
    return (
      <img
        src={mediaUrl}
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
        <source src={mediaUrl} />
        Your browser does not support the video tag.
      </video>
    );
  }

  return null;
}