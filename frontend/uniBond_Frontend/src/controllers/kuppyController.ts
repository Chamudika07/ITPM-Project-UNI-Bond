import { mockGetKuppySessions, mockCreateKuppySession, mockJoinKuppySession } from "@/services/mock/mockKuppyApi";
import type { KuppySession } from "@/types/kuppy";

export const handleGetKuppySessions = async (): Promise<KuppySession[]> => {
  return await mockGetKuppySessions();
};

export const handleCreateKuppySession = async (hostId: string, hostName: string, title: string, description: string, datetime: string): Promise<KuppySession> => {
  return await mockCreateKuppySession({ hostId, hostName, title, description, datetime });
};

export const handleJoinKuppySession = async (sessionId: string, userId: string): Promise<KuppySession> => {
  return await mockJoinKuppySession(sessionId, userId);
};
