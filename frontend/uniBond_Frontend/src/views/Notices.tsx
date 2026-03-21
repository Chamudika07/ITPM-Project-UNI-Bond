import { useEffect, useState } from "react";
import { FileText, BookOpen, Briefcase, Award } from "lucide-react";
import SectionCard from "@/components/common/SectionCard";
import EmptyState from "@/components/common/EmptyState";
import { handleGetNotices } from "@/controllers/noticeController";
import { formatDateTime } from "@/utils/formatters";
import type { Notice } from "@/types/notice";

export default function Notices() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNotices = async () => {
      try {
        const fetchedNotices = await handleGetNotices();
        setNotices(fetchedNotices);
      } catch (error) {
        console.error("Failed to load notices:", error);
      } finally {
        setLoading(false);
      }
    };

    loadNotices();
  }, []);

  const getCategoryIcon = (category: Notice["category"]) => {
    switch (category) {
      case "study":
        return BookOpen;
      case "task":
        return Briefcase;
      case "position":
        return Award;
      default:
        return FileText;
    }
  };

  const getCategoryColor = (category: Notice["category"]) => {
    switch (category) {
      case "study":
        return "bg-blue-100 text-blue-700";
      case "task":
        return "bg-green-100 text-green-700";
      case "position":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <SectionCard title="Notices">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gray-200 rounded"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
              <div className="h-16 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </SectionCard>
    );
  }

  if (notices.length === 0) {
    return (
      <SectionCard title="Notices">
        <EmptyState
          icon={FileText}
          title="No notices"
          description="There are no notices at the moment"
        />
      </SectionCard>
    );
  }

  return (
    <SectionCard title="Notices">
      <div className="space-y-6">
        {notices.map((notice) => {
          const Icon = getCategoryIcon(notice.category);
          return (
            <div key={notice.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Icon className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{notice.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded ${getCategoryColor(notice.category)}`}>
                      {notice.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    By {notice.authorName} • {formatDateTime(notice.createdAt)}
                  </p>
                </div>
              </div>
              <p className="text-gray-700">{notice.content}</p>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}