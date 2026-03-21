import type { FriendRequest, Friend } from "@/types/friend";

let friendRequests: FriendRequest[] = [
  {
    id: "req1",
    fromUserId: "user3",
    fromUserName: "Kamal Silva",
    fromUserAvatar: "https://via.placeholder.com/40",
    fromUserRole: "student",
  },
  {
    id: "req2",
    fromUserId: "user4",
    fromUserName: "Prof. Anura",
    fromUserAvatar: "https://via.placeholder.com/40",
    fromUserRole: "lecturer",
  },
];

let onlineContacts: Friend[] = [
  {
    id: "user5",
    name: "Saman Perera",
    avatar: "https://via.placeholder.com/40",
    role: "student",
    isOnline: true,
  },
  {
    id: "user6",
    name: "Dr. Priya",
    avatar: "https://via.placeholder.com/40",
    role: "lecturer",
    isOnline: true,
  },
  {
    id: "user7",
    name: "TechCorp",
    avatar: "https://via.placeholder.com/40",
    role: "company",
    isOnline: false, // should not show
  },
];

export const mockGetFriendRequests = (): Promise<FriendRequest[]> => {
  return Promise.resolve(friendRequests);
};

export const mockConfirmFriendRequest = (requestId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const index = friendRequests.findIndex((req) => req.id === requestId);
    if (index === -1) return reject(new Error("Request not found"));
    friendRequests.splice(index, 1);
    resolve();
  });
};

export const mockDeleteFriendRequest = (requestId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const index = friendRequests.findIndex((req) => req.id === requestId);
    if (index === -1) return reject(new Error("Request not found"));
    friendRequests.splice(index, 1);
    resolve();
  });
};

export const mockGetOnlineContacts = (): Promise<Friend[]> => {
  return Promise.resolve(onlineContacts.filter((friend) => friend.isOnline));
};