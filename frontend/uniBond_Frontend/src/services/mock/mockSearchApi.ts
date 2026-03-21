import type { SearchResult } from "@/types/search";
import type { Post } from "@/types/post";
import type { Notice } from "@/types/notice";
import { mockGetPosts } from "./mockPostApi";
import { mockGetNotices } from "./mockNoticeApi";

export const mockSearchAll = async (query: string): Promise<SearchResult[]> => {
  const results: SearchResult[] = [];

  // Search posts
  const posts = await mockGetPosts();
  posts.forEach((post: Post) => {
    const isStudy = post.content.toLowerCase().includes("study") || 
                    post.content.toLowerCase().includes("solution") || 
                    post.content.toLowerCase().includes("exam") ||
                    query.toLowerCase().includes("study");
    if (
      post.content.toLowerCase().includes(query.toLowerCase()) ||
      post.authorName.toLowerCase().includes(query.toLowerCase())
    ) {
      results.push({
        type: "post",
        id: post.id,
        title: post.authorName,
        description: post.content.substring(0, 100) + "...",
        avatar: post.authorAvatar,
        isStudyRelated: isStudy,
      });
    }
  });

  // Search notices
  const notices = await mockGetNotices();
  notices.forEach((notice: Notice) => {
    const isStudy = notice.title.toLowerCase().includes("study") || 
                    notice.content.toLowerCase().includes("study") ||
                    query.toLowerCase().includes("study");
    if (
      notice.title.toLowerCase().includes(query.toLowerCase()) ||
      notice.content.toLowerCase().includes(query.toLowerCase())
    ) {
      results.push({
        type: "notice",
        id: notice.id,
        title: notice.title,
        description: notice.content.substring(0, 100) + "...",
        isStudyRelated: isStudy,
      });
    }
  });

  // Dummy users and groups
  const dummyUsers: SearchResult[] = [
    {
      type: "user",
      id: "user1",
      title: "Chamudika",
      description: "Student",
      avatar: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNFNUU1RTUiLz4KPHBhdGggZD0iTTIwIDIwQzIyLjc2MTQgMjAgMjUgMTcuNzYxNCAyNSAxNUMyNSAxMi4yMzg2IDIyLjc2MTQgMTAgMjAgMTBDMTcuMjM4NiAxMCAxNSAxMi4yMzg2IDE1IDE1QzE1IDE3Ljc2MTQgMTcuNzYxNCAyMCAyMFoiIGZpbGw9IiM5Q0E0QUYiLz4KPC9zdmc+",
    },
    {
      type: "user",
      id: "user2",
      title: "Dr. Nimal",
      description: "Lecturer",
      avatar: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNFNUU1RTUiLz4KPHBhdGggZD0iTTIwIDIwQzIyLjc2MTQgMjAgMjUgMTcuNzYxNCAyNSAxNUMyNSAxMi4yMzg2IDIyLjc2MTQgMTAgMjAgMTBDMTcuMjM4NiAxMCAxNSAxMi4yMzg2IDE1IDE1QzE1IDE3Ljc2MTQgMTcuNzYxNCAyMCAyMFoiIGZpbGw9IiM5Q0E0QUYiLz4KPC9zdmc+",
    },
  ];

  const dummyGroups: SearchResult[] = [
    {
      type: "group",
      id: "group1",
      title: "CS Students Group",
      description: "Computer Science students discussion",
    },
  ];

  dummyUsers.forEach((user) => {
    if (user.title.toLowerCase().includes(query.toLowerCase())) {
      results.push(user);
    }
  });

  dummyGroups.forEach((group) => {
    if (group.title.toLowerCase().includes(query.toLowerCase())) {
      results.push(group);
    }
  });

  return results;
};