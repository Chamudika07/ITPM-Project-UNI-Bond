import { 
  mockGetTasks, 
  mockGetTaskById, 
  mockCreateTask, 
  mockUpdateTask,
  mockDeleteTask,
  mockApplyTask,
  mockUpdateApplication,
  mockDeleteApplication,
  mockSubmitTaskWork
} from "@/services/mock/mockTaskApi";
import type { Task, TaskApplication } from "@/types/task";

export const handleGetTasks = async (): Promise<Task[]> => {
  return await mockGetTasks();
};

export const handleGetTaskById = async (id: string): Promise<Task | undefined> => {
  return await mockGetTaskById(id);
};

export const handleCreateTask = async (data: Omit<Task, "id" | "createdAt" | "applicants">): Promise<Task> => {
  return await mockCreateTask(data);
};

export const handleUpdateTask = async (taskId: string, updates: Partial<Task>): Promise<Task> => {
  return await mockUpdateTask(taskId, updates);
};

export const handleDeleteTask = async (taskId: string): Promise<void> => {
  return await mockDeleteTask(taskId);
};

export const handleApplyTask = async (taskId: string, appData: Omit<TaskApplication, "id" | "taskId" | "status" | "appliedAt">): Promise<Task> => {
  return await mockApplyTask(taskId, appData);
};

export const handleUpdateApplication = async (taskId: string, appId: string, updates: Partial<TaskApplication>): Promise<Task> => {
  return await mockUpdateApplication(taskId, appId, updates);
};

export const handleDeleteApplication = async (taskId: string, appId: string): Promise<Task> => {
  return await mockDeleteApplication(taskId, appId);
};

export const handleSubmitTaskWork = async (taskId: string, appId: string, submissionUrl: string): Promise<Task> => {
  return await mockSubmitTaskWork(taskId, appId, submissionUrl);
};
