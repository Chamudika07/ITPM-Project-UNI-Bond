import {
  getFriendRequests,
  confirmFriendRequest,
  deleteFriendRequest,
  getOnlineContacts,
} from "@/models/friendModel";
import type { FriendRequest, Friend } from "@/types/friend";

export const handleGetFriendRequests = async (): Promise<FriendRequest[]> => {
  return await getFriendRequests();
};

export const handleConfirmFriendRequest = async (requestId: string): Promise<void> => {
  return await confirmFriendRequest(requestId);
};

export const handleDeleteFriendRequest = async (requestId: string): Promise<void> => {
  return await deleteFriendRequest(requestId);
};

export const handleGetOnlineContacts = async (): Promise<Friend[]> => {
  return await getOnlineContacts();
};