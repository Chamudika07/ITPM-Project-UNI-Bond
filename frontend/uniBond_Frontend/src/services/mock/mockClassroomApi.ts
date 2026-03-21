import { Classroom } from "@/types/classroom";

let classrooms: Classroom[] = [
  {
    id: "c1",
    techLeadId: "tl1",
    techLeadName: "TechLead Kasun",
    title: "Advanced React Patterns",
    description: "Learn how to architect clean scalable enterprise applications in React.",
    maxStudents: 30,
    currentStudents: 15,
    rating: 4.8,
    totalRatings: 12,
    createdAt: new Date().toISOString(),
    enrolledStudents: [],
  },
  {
    id: "c2",
    techLeadId: "tl1",
    techLeadName: "TechLead Kasun",
    title: "System Design Interviews via Node.js",
    description: "Master system design principles by studying Node.js internals and scaling strategies.",
    maxStudents: 50,
    currentStudents: 50,
    rating: 4.9,
    totalRatings: 34,
    createdAt: new Date().toISOString(),
    enrolledStudents: [],
  }
];

export const mockGetClassrooms = async (): Promise<Classroom[]> => {
  return [...classrooms];
};

export const mockGetClassroomById = async (id: string): Promise<Classroom | undefined> => {
  return classrooms.find(c => c.id === id);
};

export const mockCreateClassroom = async (data: Omit<Classroom, "id" | "currentStudents" | "rating" | "totalRatings" | "createdAt" | "enrolledStudents">): Promise<Classroom> => {
  const newClassroom: Classroom = {
    ...data,
    id: "cr-" + Math.random().toString(36).substring(2, 9),
    currentStudents: 0,
    rating: 0,
    totalRatings: 0,
    createdAt: new Date().toISOString(),
    enrolledStudents: [],
  };
  classrooms.push(newClassroom);
  return newClassroom;
};

export const mockJoinClassroom = async (classroomId: string, studentId: string): Promise<Classroom> => {
  const room = classrooms.find(c => c.id === classroomId);
  if (!room) throw new Error("Classroom not found.");
  if (room.currentStudents >= room.maxStudents) throw new Error("Classroom is full.");
  if (room.enrolledStudents.includes(studentId)) throw new Error("Student already enrolled.");
  
  room.enrolledStudents.push(studentId);
  room.currentStudents += 1;
  return { ...room };
};
