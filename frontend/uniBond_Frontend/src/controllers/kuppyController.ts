import apiClient from "@/services/api/axiosClient";
import type { KuppySession } from "@/types/kuppy";

export const handleGetKuppySessions = async (): Promise<KuppySession[]> => {
  const res = await apiClient.get("/kuppy/");
  return res.data.map((k: any) => ({
    id: String(k.id),
    hostId: String(k.host_id),
    hostName: `User ${k.host_id}`,
    title: k.title,
    description: k.description || "",
    datetime: k.datetime_schedule,
    pointsEarned: k.points_earned || 0,
    participants: k.participants?.map((p: any) => String(p.user_id)) || []
  }));
};

export const handleCreateKuppySession = async (_hostId: string, _hostName: string, title: string, description: string, datetime: string): Promise<KuppySession> => {
  const res = await apiClient.post("/kuppy/", { title, description, datetime_schedule: datetime, points_earned: 0 });
  const k = res.data;
  return {
    id: String(k.id),
    hostId: String(k.host_id),
    hostName: `User ${k.host_id}`,
    title: k.title,
    description: k.description || "",
    datetime: k.datetime_schedule,
    pointsEarned: k.points_earned || 0,
    participants: k.participants?.map((p: any) => String(p.user_id)) || []
  };
};

export const handleJoinKuppySession = async (sessionId: string, _userId: string): Promise<KuppySession> => {
  await apiClient.post(`/kuppy/${sessionId}/join`);
  // return dummy updated session
  return handleGetKuppySessions().then(sessions => sessions.find(s => s.id === sessionId) as KuppySession);
};
