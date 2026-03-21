import { mockGetGroups, mockGetGroupById, mockCreateGroup, mockJoinGroup, mockAddDiscussionMessage } from "@/services/mock/mockGroupApi";
import type { Group, DiscussionMessage } from "@/types/group";

export const handleGetGroups = async (): Promise<Group[]> => {
  return await mockGetGroups();
};

export const handleGetGroupById = async (id: string): Promise<Group | undefined> => {
  return await mockGetGroupById(id);
};

export const handleCreateGroup = async (name: string, description: string, creatorId: string): Promise<Group> => {
  return await mockCreateGroup(name, description, creatorId);
};

export const handleJoinGroup = async (groupId: string, userId: string): Promise<Group> => {
  return await mockJoinGroup(groupId, userId);
};

export const handleAddMessage = async (groupId: string, authorId: string, authorName: string, content: string): Promise<DiscussionMessage> => {
  return await mockAddDiscussionMessage(groupId, authorId, authorName, content);
};
