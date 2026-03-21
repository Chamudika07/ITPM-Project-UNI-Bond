import { mockGetTasks, mockGetTaskById, mockCreateTask, mockApplyTask } from "@/services/mock/mockTaskApi";
import type { Task } from "@/types/task";

export const handleGetTasks = async (): Promise<Task[]> => {
  return await mockGetTasks();
};

export const handleGetTaskById = async (id: string): Promise<Task | undefined> => {
  return await mockGetTaskById(id);
};

export const handleCreateTask = async (companyId: string, companyName: string, title: string, description: string, reqs: string[], reward: string, deadline: string): Promise<Task> => {
  return await mockCreateTask({ companyId, companyName, title, description, requirements: reqs, salaryOrReward: reward, deadline });
};

export const handleApplyTask = async (taskId: string, studentId: string): Promise<Task> => {
  return await mockApplyTask(taskId, studentId);
};
