import { mockGetClassrooms, mockGetClassroomById, mockCreateClassroom, mockJoinClassroom } from "@/services/mock/mockClassroomApi";
import type { Classroom } from "@/types/classroom";

export const handleGetClassrooms = async (): Promise<Classroom[]> => {
  return await mockGetClassrooms();
};

export const handleGetClassroomById = async (id: string): Promise<Classroom | undefined> => {
  return await mockGetClassroomById(id);
};

export const handleCreateClassroom = async (techLeadId: string, techLeadName: string, title: string, description: string, maxStudents: number): Promise<Classroom> => {
  return await mockCreateClassroom({ techLeadId, techLeadName, title, description, maxStudents });
};

export const handleJoinClassroom = async (classroomId: string, studentId: string): Promise<Classroom> => {
  return await mockJoinClassroom(classroomId, studentId);
};
