import { Task } from "@/types/task";

let tasks: Task[] = [
  {
    id: "t1",
    companyId: "c1",
    companyName: "WSO2",
    title: "React Frontend Developer Intern",
    description: "Build robust UIs for enterprise identity management.",
    requirements: ["React", "TypeScript", "TailwindCSS"],
    salaryOrReward: "$500/month",
    deadline: new Date(Date.now() + 86400000 * 10).toISOString(),
    createdAt: new Date().toISOString(),
    applicants: [],
  },
  {
    id: "t2",
    companyId: "c2",
    companyName: "Sysco LABS",
    title: "Node.js Backend Engineer",
    description: "Scale our event driven system serving food supply networks.",
    requirements: ["Node.js", "Express", "PostgreSQL", "AWS"],
    salaryOrReward: "$1000/month",
    deadline: new Date(Date.now() + 86400000 * 14).toISOString(),
    createdAt: new Date().toISOString(),
    applicants: [],
  }
];

export const mockGetTasks = async (): Promise<Task[]> => {
  return [...tasks];
};

export const mockGetTaskById = async (id: string): Promise<Task | undefined> => {
  return tasks.find(t => t.id === id);
};

export const mockCreateTask = async (data: Omit<Task, "id" | "createdAt" | "applicants">): Promise<Task> => {
  const newTask: Task = {
    ...data,
    id: "ts-" + Math.random().toString(36).substring(2, 9),
    createdAt: new Date().toISOString(),
    applicants: [],
  };
  tasks.push(newTask);
  return newTask;
};

export const mockApplyTask = async (taskId: string, studentId: string): Promise<Task> => {
  const task = tasks.find(t => t.id === taskId);
  if (!task) throw new Error("Task not found.");
  if (task.applicants.includes(studentId)) throw new Error("Already applied.");
  
  task.applicants.push(studentId);
  return { ...task };
};
