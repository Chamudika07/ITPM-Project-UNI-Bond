import {
  followUser,
  getDiscoverUsers,
  getFollowers,
  getFollowStatus,
  getFollowing,
  getUserById,
  getUserProfile,
  unfollowUser,
} from "@/models/userModel";
import type { DiscoverUser, Role, User, UserProfileData, UserSummary } from "@/types/user";

export const handleGetDiscoverUsers = async (limit = 5, roles?: Role[]): Promise<DiscoverUser[]> => {
  return getDiscoverUsers(limit, roles);
};

export const handleGetUserById = async (userId: string): Promise<User> => {
  return getUserById(userId);
};

export const handleGetUserProfile = async (userId: string): Promise<UserProfileData> => {
  return getUserProfile(userId);
};

export const handleFollowUser = async (userId: string): Promise<UserProfileData> => {
  return followUser(userId);
};

export const handleUnfollowUser = async (userId: string): Promise<UserProfileData> => {
  return unfollowUser(userId);
};

export const handleGetFollowers = async (userId: string): Promise<UserSummary[]> => {
  return getFollowers(userId);
};

export const handleGetFollowing = async (userId: string): Promise<UserSummary[]> => {
  return getFollowing(userId);
};

export const handleGetFollowStatus = async (userId: string): Promise<boolean> => {
  return getFollowStatus(userId);
};
