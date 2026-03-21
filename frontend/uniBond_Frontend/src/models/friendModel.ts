import {
  mockGetFriendRequests,
  mockConfirmFriendRequest,
  mockDeleteFriendRequest,
  mockGetOnlineContacts,
} from "@/services/mock/mockFriendApi";
import type { FriendRequest, Friend } from "@/types/friend";

export const getFriendRequests = async (): Promise<FriendRequest[]> => {
  return await mockGetFriendRequests();
};

export const confirmFriendRequest = async (requestId: string): Promise<void> => {
  return await mockConfirmFriendRequest(requestId);
};

export const deleteFriendRequest = async (requestId: string): Promise<void> => {
  return await mockDeleteFriendRequest(requestId);
};

export const getOnlineContacts = async (): Promise<Friend[]> => {
  return await mockGetOnlineContacts();
};