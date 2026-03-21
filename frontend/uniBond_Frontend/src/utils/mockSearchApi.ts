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
      });
    }
  });

  // Search notices
  const notices = await mockGetNotices();
  notices.forEach((notice: Notice) => {
    if (
      notice.title.toLowerCase().includes(query.toLowerCase()) ||
      notice.content.toLowerCase().includes(query.toLowerCase())
    ) {
      results.push({
        type: "notice",
        id: notice.id,
        title: notice.title,
        description: notice.content.substring(0, 100) + "...",
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