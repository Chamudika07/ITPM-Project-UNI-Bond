import { KuppySession } from "@/types/kuppy";

let kuppySessions: KuppySession[] = [
  {
    id: "k1",
    hostId: "u1",
    hostName: "Senior Student Kamel",
    title: "Data Structures Crash Course",
    description: "Reviewing trees and graphs before the mid terms.",
    datetime: new Date(Date.now() + 86400000).toISOString(),
    pointsEarned: 50,
    participants: ["u2", "u3"],
  }
];

export const mockGetKuppySessions = async (): Promise<KuppySession[]> => {
  return [...kuppySessions];
};

export const mockCreateKuppySession = async (data: Omit<KuppySession, "id" | "pointsEarned" | "participants">): Promise<KuppySession> => {
  const newSession: KuppySession = {
    ...data,
    id: "kp-" + Math.random().toString(36).substring(2, 9),
    pointsEarned: 10, // Host gets 10 points for creating
    participants: [],
  };
  kuppySessions.push(newSession);
  return newSession;
};

export const mockJoinKuppySession = async (sessionId: string, userId: string): Promise<KuppySession> => {
  const session = kuppySessions.find(s => s.id === sessionId);
  if (!session) throw new Error("Session not found");
  if (!session.participants.includes(userId)) {
      session.participants.push(userId);
      session.pointsEarned += 5; // Extra points for host when people join
  }
  return { ...session };
};
