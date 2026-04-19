import type { KuppySession } from "@/types/kuppy";

const lecturer = {
  id: "u1",
  firstname: "Senior",
  lastname: "Lecturer",
  fullName: "Senior Lecturer",
  role: "lecturer",
};

let kuppySessions: KuppySession[] = [
  {
    id: "k1",
    lecturerId: "u1",
    title: "Data Structures Crash Course",
    moduleName: "CS2020 Data Structures",
    description: "Reviewing trees and graphs before the mid terms.",
    scheduledStart: new Date(Date.now() + 86400000).toISOString(),
    scheduledEnd: new Date(Date.now() + 90000000).toISOString(),
    maxStudents: 10,
    status: "scheduled",
    createdAt: new Date().toISOString(),
    lecturer,
    participants: [],
  },
];

export const mockGetKuppySessions = async (): Promise<KuppySession[]> => [...kuppySessions];

export const mockCreateKuppySession = async (data: Omit<KuppySession, "id" | "participants" | "createdAt">): Promise<KuppySession> => {
  const newSession: KuppySession = {
    ...data,
    id: `kp-${Math.random().toString(36).slice(2, 9)}`,
    createdAt: new Date().toISOString(),
    participants: [],
  };
  kuppySessions.push(newSession);
  return newSession;
};

export const mockJoinKuppySession = async (sessionId: string, userId: string): Promise<KuppySession> => {
  const session = kuppySessions.find((item) => item.id === sessionId);
  if (!session) throw new Error("Session not found");

  if (!session.participants.some((participant) => participant.userId === userId)) {
    session.participants.push({
      userId,
      joinedAt: new Date().toISOString(),
      user: {
        id: userId,
        firstname: "Student",
        lastname: "User",
        fullName: "Student User",
        role: "student",
      },
    });
  }

  return { ...session };
};
