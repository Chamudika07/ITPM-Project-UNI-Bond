import type { SearchResponse, SearchResult } from "@/types/search";
import type { Post } from "@/types/post";
import type { Notice } from "@/types/notice";
import { mockGetPosts } from "./mockPostApi";
import { mockGetNotices } from "./mockNoticeApi";

export const mockSearchAll = async (query: string): Promise<SearchResponse> => {
  const results: SearchResult[] = [];
  const normalizedQuery = query.toLowerCase();

  const posts = await mockGetPosts();
  posts.forEach((post: Post) => {
    const content = post.content.toLowerCase();
    const authorName = post.authorName.toLowerCase();
    if (content.includes(normalizedQuery) || authorName.includes(normalizedQuery)) {
      results.push({
        type: "post",
        id: post.id,
        title: post.authorName,
        description: post.content.substring(0, 100) + "...",
        avatar: post.authorAvatar,
        href: "/",
        isStudyRelated: ["study", "solution", "exam"].some((keyword) => content.includes(keyword)),
      });
    }
  });

  const notices = await mockGetNotices();
  notices.forEach((notice: Notice) => {
    const title = notice.title.toLowerCase();
    const content = notice.content.toLowerCase();
    if (title.includes(normalizedQuery) || content.includes(normalizedQuery)) {
      results.push({
        type: "notice",
        id: notice.id,
        title: notice.title,
        description: notice.content.substring(0, 100) + "...",
        href: "/notices",
        isStudyRelated: ["study", "exam", "lecture"].some((keyword) => title.includes(keyword) || content.includes(keyword)),
      });
    }
  });

  const dummyResults: SearchResult[] = [
    {
      type: "user",
      id: "user1",
      title: "Chamudika",
      description: "Student",
      avatar: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNFNUU1RTUiLz4KPHBhdGggZD0iTTIwIDIwQzIyLjc2MTQgMjAgMjUgMTcuNzYxNCAyNSAxNUMyNSAxMi4yMzg2IDIyLjc2MTQgMTAgMjAgMTBDMTcuMjM4NiAxMCAxNSAxMi4yMzg2IDE1IDE1QzE1IDE3Ljc2MTQgMTcuNzYxNCAyMCAyMFoiIGZpbGw9IiM5Q0E0QUYiLz4KPC9zdmc+",
      href: "/profile/user1",
      isStudyRelated: true,
    },
    {
      type: "group",
      id: "group1",
      title: "CS Students Group",
      description: "Computer Science students discussion",
      href: "/groups/group1",
      isStudyRelated: true,
    },
  ];

  dummyResults.forEach((result) => {
    if (result.title.toLowerCase().includes(normalizedQuery)) {
      results.push(result);
    }
  });

  return {
    query,
    total: results.length,
    results,
  };
};
