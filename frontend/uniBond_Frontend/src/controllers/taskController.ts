import apiClient from "@/services/api/axiosClient";
import type { Task } from "@/types/task";

export const handleGetTasks = async (): Promise<Task[]> => {
  const res = await apiClient.get("/tasks/");
  return res.data.map((t: any) => ({
    id: String(t.id),
    companyId: String(t.company_id),
    companyName: `Company ${t.company_id}`,
    title: t.title,
    description: t.description || "",
    requirements: t.requirements || [],
    salaryOrReward: t.reward || "",
    deadline: t.deadline,
    createdAt: t.created_at || "",
    applicants: t.applicants?.map((a: any) => String(a.user_id)) || []
  }));
};

export const handleGetTaskById = async (id: string): Promise<Task | undefined> => {
  const res = await apiClient.get(`/tasks/${id}`);
  const t = res.data;
  return {
    id: String(t.id),
    companyId: String(t.company_id),
    companyName: `Company ${t.company_id}`,
    title: t.title,
    description: t.description || "",
    requirements: t.requirements || [],
    salaryOrReward: t.reward || "",
    deadline: t.deadline,
    createdAt: t.created_at || "",
    applicants: t.applicants?.map((a: any) => String(a.user_id)) || []
  };
};

export const handleCreateTask = async (_companyId: string, _companyName: string, title: string, description: string, reqs: string[], reward: string, deadline: string): Promise<Task> => {
  const res = await apiClient.post("/tasks/", { title, description, requirements: reqs, reward, deadline });
  return handleGetTaskById(String(res.data.id)) as unknown as Task;
};

export const handleApplyTask = async (taskId: string, _studentId: string): Promise<Task> => {
  await apiClient.post(`/tasks/${taskId}/apply`);
  return handleGetTaskById(taskId) as unknown as Task;
};
