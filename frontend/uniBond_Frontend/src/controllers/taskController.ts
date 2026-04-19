import apiClient from "@/services/api/axiosClient";

import type { Task, TaskApplication } from "@/types/task";

export type TaskUpsertPayload = Omit<Task, "id" | "createdAt" | "applicants">;

type ApiRecord = Record<string, unknown>;

const asRecord = (value: unknown): ApiRecord => (value && typeof value === "object" ? value as ApiRecord : {});

const mapApplicant = (taskId: string, applicantRaw: unknown): TaskApplication => {
  const applicant = asRecord(applicantRaw);

  return {
  id: String(applicant.id ?? ""),
  taskId,
  studentId: String(applicant.user_id ?? ""),
  studentName: typeof applicant.student_name === "string" ? applicant.student_name : "Student",
  email: typeof applicant.email === "string" ? applicant.email : "",
  portfolioUrl: typeof applicant.portfolio_url === "string" ? applicant.portfolio_url : undefined,
  coverLetter: typeof applicant.cover_letter === "string" ? applicant.cover_letter : undefined,
  status: typeof applicant.status === "string" ? applicant.status as TaskApplication["status"] : "pending",
  appliedAt: typeof applicant.applied_at === "string" ? applicant.applied_at : "",
  submissionUrl: typeof applicant.submission_url === "string" ? applicant.submission_url : undefined,
  submittedAt: typeof applicant.submitted_at === "string" ? applicant.submitted_at : undefined,
  companyRating: typeof applicant.company_rating === "number" ? applicant.company_rating : undefined,
  companyFeedback: typeof applicant.company_feedback === "string" ? applicant.company_feedback : undefined,
  ratedAt: typeof applicant.rated_at === "string" ? applicant.rated_at : undefined,
  };
};

const mapTask = (taskRaw: unknown): Task => {
  const task = asRecord(taskRaw);

  return {
  id: String(task.id ?? ""),
  companyId: String(task.company_id ?? ""),
  companyName: typeof task.company_name === "string" ? task.company_name : `Company ${String(task.company_id ?? "")}`,
  title: typeof task.title === "string" ? task.title : "",
  description: typeof task.description === "string" ? task.description : "",
  category: typeof task.category === "string" ? task.category : "General",
  projectType: task.project_type === "Group" ? "Group" : "Individual",
  skills: Array.isArray(task.skills) ? task.skills.filter((item): item is string => typeof item === "string") : [],
  technologies: Array.isArray(task.technologies) ? task.technologies.filter((item): item is string => typeof item === "string") : [],
  experienceLevel: typeof task.experience_level === "string" ? task.experience_level : "Intermediate",
  studentsNeeded: Number(task.students_needed || 1),
  duration: typeof task.duration === "string" ? task.duration : "",
  startDate: typeof task.start_date === "string" ? task.start_date : "",
  deadline: typeof task.deadline === "string" ? task.deadline : "",
  stipend: typeof task.stipend === "string" ? task.stipend : "",
  certificate: Boolean(task.certificate),
  internshipOpportunity: Boolean(task.internship_opportunity),
  tags: Array.isArray(task.tags) ? task.tags.filter((item): item is string => typeof item === "string") : [],
  contactEmail: typeof task.contact_email === "string" ? task.contact_email : "",
  status: task.status === "in_progress" || task.status === "completed" ? task.status : "open",
  createdAt: typeof task.created_at === "string" ? task.created_at : "",
  applicants: Array.isArray(task.applicants)
    ? task.applicants.map((applicant) => mapApplicant(String(task.id ?? ""), applicant))
    : [],
  };
};

const mapTaskPayload = (payload: Partial<TaskUpsertPayload>) => ({
  title: payload.title,
  description: payload.description,
  category: payload.category,
  project_type: payload.projectType,
  skills: payload.skills,
  technologies: payload.technologies,
  experience_level: payload.experienceLevel,
  students_needed: payload.studentsNeeded,
  duration: payload.duration,
  start_date: payload.startDate,
  deadline: payload.deadline,
  stipend: payload.stipend,
  certificate: payload.certificate,
  internship_opportunity: payload.internshipOpportunity,
  tags: payload.tags,
  contact_email: payload.contactEmail,
  status: payload.status,
});

export const handleGetTasks = async (): Promise<Task[]> => {
  const response = await apiClient.get("/tasks/");
  return response.data.map(mapTask);
};

export const handleGetTaskById = async (id: string): Promise<Task | undefined> => {
  const response = await apiClient.get(`/tasks/${id}`);
  return mapTask(response.data);
};

export const handleCreateTask = async (data: TaskUpsertPayload): Promise<Task> => {
  const response = await apiClient.post("/tasks/", mapTaskPayload(data));
  return mapTask(response.data);
};

export const handleUpdateTask = async (taskId: string, updates: Partial<TaskUpsertPayload>): Promise<Task> => {
  const response = await apiClient.put(`/tasks/${taskId}`, mapTaskPayload(updates));
  return mapTask(response.data);
};

export const handleDeleteTask = async (taskId: string): Promise<void> => {
  await apiClient.delete(`/tasks/${taskId}`);
};

export const handleApplyTask = async (
  taskId: string,
  application?: { email?: string; portfolioUrl?: string; coverLetter?: string }
): Promise<Task> => {
  const response = await apiClient.post(`/tasks/${taskId}/apply`, {
    email: application?.email,
    portfolio_url: application?.portfolioUrl,
    cover_letter: application?.coverLetter,
  });
  return mapTask(response.data);
};

export const handleDeleteApplication = async (taskId: string): Promise<Task> => {
  const response = await apiClient.delete(`/tasks/${taskId}/apply`);
  return mapTask(response.data);
};

export const handleUpdateApplication = async (taskId: string, appId: string, payload: { status: 'accepted' | 'rejected' }): Promise<Task> => {
  const response = await apiClient.patch(`/tasks/${taskId}/applications/${appId}`, payload);
  return mapTask(response.data);
};

export const handleSubmitTaskWork = async (taskId: string, appId: string, submissionUrl: string): Promise<Task> => {
  const response = await apiClient.post(`/tasks/${taskId}/applications/${appId}/submit`, {
    submission_url: submissionUrl,
  });
  return mapTask(response.data);
};

export const handleRateTaskApplicant = async (
  taskId: string,
  appId: string,
  payload: { rating: number; feedback?: string }
): Promise<Task> => {
  const response = await apiClient.post(`/tasks/${taskId}/applications/${appId}/rate`, payload);
  return mapTask(response.data);
};
