import apiClient from "@/services/api/axiosClient";
import { mockGetDiscoverUsers, mockGetUserById } from "@/services/mock/mockUserApi";
import type { DiscoverUser, OnlineContact, Role, User, UserProfileData, UserSummary } from "@/types/user";

const buildAvatar = (firstname: string, lastname: string, email: string) => {
  const label = `${firstname} ${lastname}`.trim() || email || "Uni Bond";
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(label)}&background=e5e7eb&color=374151`;
};

const buildLocation = (city?: string, country?: string) =>
  [city, country].filter(Boolean).join(", ") || undefined;

const mapApiUserToFrontendUser = (data: any): User => {
  const base = {
    id: String(data.id),
    user_code: data.user_code,
    firstname: data.first_name || data.firstname || "User",
    lastname: data.last_name || data.lastname || "",
    email: data.email || "",
    password: "",
    role: (data.role || "student") as Role,
    avatar:
      data.avatar ||
      buildAvatar(data.first_name || data.firstname || "User", data.last_name || data.lastname || "", data.email || ""),
    city: data.city || "",
    country: data.country || "",
    mobile: data.mobile || "",
    school: data.school || undefined,
    cv_path: data.cv_path || undefined,
    access_status: data.access_status || "active",
  };

  if (base.role === "student") {
    return {
      ...base,
      role: "student",
      school: data.school || "",
      education: data.education_status || "Bachelor",
    };
  }

  if (base.role === "lecturer") {
    return {
      ...base,
      role: "lecturer",
      school: data.school || "",
      education: data.education_status || "Master",
    };
  }

  if (base.role === "company") {
    return {
      ...base,
      role: "company",
      companyName: data.company_name || data.companyName || `${base.firstname} ${base.lastname}`.trim(),
      industry: data.industry || "",
      companySize: data.company_size || data.companySize || "",
    };
  }

  if (base.role === "tech_lead") {
    return {
      ...base,
      role: "tech_lead",
      industryExpertise: data.industry_expertise || data.industryExpertise || "",
      yearsOfExperience: String(data.years_of_experience || data.yearsOfExperience || ""),
    };
  }

  return {
    ...base,
    role: "admin",
    adminLevel: data.admin_level || data.adminLevel || undefined,
  };
};

const mapDiscoverUserResponse = (data: any): DiscoverUser => {
  const firstname = data.first_name || data.firstname || "User";
  const lastname = data.last_name || data.lastname || "";
  const email = data.email || "";

  return {
    id: String(data.id),
    firstname,
    lastname,
    fullName: `${firstname} ${lastname}`.trim(),
    email,
    role: (data.role || "student") as Role,
    avatar: data.avatar || buildAvatar(firstname, lastname, email),
    city: data.city || undefined,
    country: data.country || undefined,
    location: buildLocation(data.city, data.country),
    profilePath: `/profile/${data.id}`,
    isFollowing: Boolean(data.is_following),
  };
};

export const getDiscoverUsers = async (
  limit = 5,
  roles?: Role[],
  options?: { excludeFollowed?: boolean; excludeUserId?: string }
): Promise<DiscoverUser[]> => {
  try {
    const response = await apiClient.get("/users/discover", {
      params: {
        limit,
        roles,
        exclude_followed: options?.excludeFollowed,
        exclude_user_id: options?.excludeUserId,
      },
    });
    return response.data.map(mapDiscoverUserResponse);
  } catch (error) {
    console.warn("Falling back to mock discover users.", error);
    return mockGetDiscoverUsers(limit);
  }
};

export const getUserById = async (userId: string): Promise<User> => {
  try {
    const response = await apiClient.get(`/users/${userId}`);
    return mapApiUserToFrontendUser(response.data);
  } catch (error) {
    console.warn(`Falling back to mock user ${userId}.`, error);
    return mockGetUserById(userId);
  }
};

const mapUserSummaryResponse = (data: any): UserSummary => {
  const firstname = data.first_name || data.firstname || "User";
  const lastname = data.last_name || data.lastname || "";
  const email = data.email || "";

  return {
    id: String(data.id),
    firstname,
    lastname,
    email,
    role: (data.role || "student") as Role,
    avatar: data.avatar || buildAvatar(firstname, lastname, email),
    city: data.city || undefined,
    country: data.country || undefined,
    isFollowing: Boolean(data.is_following),
  };
};

const mapOnlineContactResponse = (data: any): OnlineContact => {
  const firstname = data.first_name || data.firstname || "User";
  const lastname = data.last_name || data.lastname || "";
  const email = data.email || "";

  return {
    id: String(data.id),
    firstname,
    lastname,
    fullName: `${firstname} ${lastname}`.trim(),
    email,
    role: (data.role || "student") as Role,
    avatar: data.avatar || buildAvatar(firstname, lastname, email),
    city: data.city || undefined,
    country: data.country || undefined,
    location: buildLocation(data.city, data.country),
    lastSeen: data.last_seen || undefined,
    isOnline: Boolean(data.is_online),
    isFollowing: Boolean(data.is_following),
    profilePath: `/profile/${data.id}`,
  };
};

const mapUserProfileResponse = (data: any): UserProfileData => {
  const user = mapApiUserToFrontendUser(data);

  return {
    user,
    followersCount: Number(data.followers_count || 0),
    followingCount: Number(data.following_count || 0),
    isFollowing: Boolean(data.is_following),
    isOwnProfile: Boolean(data.is_own_profile),
  };
};

export const getUserProfile = async (userId: string): Promise<UserProfileData> => {
  const response = await apiClient.get(`/users/${userId}/profile`);
  return mapUserProfileResponse(response.data);
};

export const followUser = async (userId: string): Promise<UserProfileData> => {
  const response = await apiClient.post(`/users/${userId}/follow`);
  return mapUserProfileResponse(response.data);
};

export const unfollowUser = async (userId: string): Promise<UserProfileData> => {
  const response = await apiClient.delete(`/users/${userId}/follow`);
  return mapUserProfileResponse(response.data);
};

export const getFollowers = async (userId: string): Promise<UserSummary[]> => {
  const response = await apiClient.get(`/users/${userId}/followers`);
  return response.data.map(mapUserSummaryResponse);
};

export const getFollowing = async (userId: string): Promise<UserSummary[]> => {
  const response = await apiClient.get(`/users/${userId}/following`);
  return response.data.map(mapUserSummaryResponse);
};

export const getFollowStatus = async (userId: string): Promise<boolean> => {
  const response = await apiClient.get(`/users/${userId}/follow-status`);
  return Boolean(response.data?.is_following);
};

export const getOnlineUsers = async (limit = 10): Promise<OnlineContact[]> => {
  const response = await apiClient.get("/users/online-users", { params: { limit } });
  return response.data.map(mapOnlineContactResponse);
};

export const sendPresenceHeartbeat = async (): Promise<void> => {
  await apiClient.post("/users/presence/heartbeat");
};
