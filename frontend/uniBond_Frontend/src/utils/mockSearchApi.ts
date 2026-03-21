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
      avatar: "https://via.placeholder.com/40",
    },
    {
      type: "user",
      id: "user2",
      title: "Dr. Nimal",
      description: "Lecturer",
      avatar: "https://via.placeholder.com/40",
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