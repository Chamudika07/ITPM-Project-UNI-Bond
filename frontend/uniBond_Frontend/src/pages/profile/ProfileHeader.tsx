import { Edit2, LogOut } from "lucide-react";
import FollowButton from "@/components/user/FollowButton";
import type { ProfileConnectionStats, User } from "@/types/user";

type Props = {
  user: User;
  onLogout?: () => void;
  isOwnProfile: boolean;
  stats: ProfileConnectionStats;
  isFollowing?: boolean;
  followLoading?: boolean;
  followError?: string;
  onFollowToggle?: () => Promise<void> | void;
};

export default function ProfileHeader({
  user,
  onLogout,
  isOwnProfile,
  stats,
  isFollowing = false,
  followLoading = false,
  followError = "",
  onFollowToggle,
}: Props) {
  const profileName = `${user.firstname} ${user.lastname}`.trim();

  return (
    <div className="bg-white rounded-b-xl shadow-sm mb-6 pb-6 lg:mt-[-24px] lg:mx-[0px]">
      {/* Cover Photo */}
      <div className="h-48 md:h-64 w-full bg-gradient-to-r from-blue-400 to-indigo-600 rounded-b-none lg:rounded-t-xl overflow-hidden relative" />
      
      {/* Profile Info Overlay */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex flex-col sm:flex-row justify-between items-center sm:items-end sm:-mt-24 mb-4 gap-4 sm:gap-0">
          <div className="-mt-16 sm:mt-0 flex bg-white p-1 rounded-full shrink-0 shadow-lg">
            <img 
              src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileName)}&background=random&size=160`} 
              alt="Profile" 
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white shadow-md relative z-10 bg-white"
            />
          </div>
          {isOwnProfile && (
            <div className="flex gap-2">
              <button className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold transition text-sm sm:text-base">
                <Edit2 className="w-4 h-4" />
                <span className="inline">Edit Profile</span>
              </button>
              <button onClick={onLogout} className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-semibold transition text-sm sm:text-base">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          )}
          {!isOwnProfile && (
            <div className="flex w-full sm:w-auto justify-center sm:justify-end">
              <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-left shadow-sm">
                <div className="flex items-center gap-3">
                  <FollowButton
                    isFollowing={isFollowing}
                    loading={followLoading}
                    onToggle={() => onFollowToggle?.()}
                  />
                  <span className="text-xs font-medium text-blue-700">
                    {isFollowing ? "You are following this profile." : "Follow this profile to stay updated."}
                  </span>
                </div>
                {followError && (
                  <p className="mt-2 text-xs font-medium text-red-600">{followError}</p>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* User Details */}
        <div className="mt-2 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 border-none pb-0">
            {user.firstname} {user.lastname}
          </h1>
          <p className="text-gray-500 font-medium capitalize flex items-center justify-center sm:justify-start gap-2 text-sm mt-1">
            {user.role.replace('_', ' ')} • UniBond
          </p>
          
          <p className="mt-3 text-gray-700 max-w-2xl text-sm sm:text-base mx-auto sm:mx-0">
            Passionate about learning and growth at UniBond infrastructure.
          </p>
          
          <div className="flex gap-4 mt-4 text-sm font-medium text-gray-600 justify-center sm:justify-start">
            <span className="hover:underline cursor-pointer"><strong className="text-gray-900">{stats.followers}</strong> Followers</span>
            <span className="hover:underline cursor-pointer"><strong className="text-gray-900">{stats.following}</strong> Following</span>
            <span className="hover:underline cursor-pointer"><strong className="text-gray-900">{stats.connections}</strong> Connections</span>
          </div>
        </div>
      </div>
    </div>
  );
}
