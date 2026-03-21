export type FriendRequest = {
  id: string;
  fromUserId: string;
  fromUserName: string;
  fromUserAvatar: string;
  fromUserRole: "student" | "lecturer" | "company" | "tech_lead";
};

export type Friend = {
  id: string;
  name: string;
  avatar: string;
  role: "student" | "lecturer" | "company" | "tech_lead";
  isOnline: boolean;
};