import { Task, TaskApplication } from "@/types/task";

const getInitialTasks = (): Task[] => {
  const stored = localStorage.getItem('mock_tasks');
  if (stored) return JSON.parse(stored);
  
  const defaultTasks: Task[] = [
    {
      id: "t1",
      companyId: "c1",
      companyName: "WSO2",
      title: "React Frontend Developer Intern",
      description: "Build robust UIs for enterprise identity management.",
      category: "software Engineering",
      projectType: "Individual",
      skills: ["React", "TypeScript", "TailwindCSS"],
      technologies: ["React", "Vite"],
      experienceLevel: "Intermediate",
      studentsNeeded: 2,
      duration: "6 Months",
      startDate: new Date(Date.now() + 86400000 * 5).toISOString(),
      deadline: new Date(Date.now() + 86400000 * 10).toISOString(),
      stipend: "Rs. 25,000 - 50,000",
      certificate: true,
      internshipOpportunity: true,
      tags: ["Frontend", "React"],
      contactEmail: "hr@wso2.com",
      status: "open",
      createdAt: new Date().toISOString(),
      applicants: [],
    },
    {
      id: "t2",
      companyId: "c2",
      companyName: "Sysco LABS",
      title: "Node.js Backend Engineer",
      description: "Scale our event driven system serving food supply networks.",
      category: "software Engineering",
      projectType: "Group",
      skills: ["Node.js", "Express", "PostgreSQL"],
      technologies: ["AWS", "Docker"],
      experienceLevel: "Advanced",
      studentsNeeded: 4,
      duration: "1 Year",
      startDate: new Date(Date.now() + 86400000 * 10).toISOString(),
      deadline: new Date(Date.now() + 86400000 * 375).toISOString(),
      stipend: "Rs. 50,000+",
      certificate: true,
      internshipOpportunity: true,
      tags: ["Backend", "Nodejs"],
      contactEmail: "careers@syscolabs.lk",
      status: "open",
      createdAt: new Date().toISOString(),
      applicants: [],
    }
  ];
  localStorage.setItem('mock_tasks', JSON.stringify(defaultTasks));
  return defaultTasks;
};

const saveTasks = (t: Task[]) => localStorage.setItem('mock_tasks', JSON.stringify(t));

export const mockGetTasks = async (): Promise<Task[]> => {
  return [...getInitialTasks()];
};

export const mockGetTaskById = async (id: string): Promise<Task | undefined> => {
  return getInitialTasks().find(t => t.id === id);
};

export const mockCreateTask = async (data: Omit<Task, "id" | "createdAt" | "applicants">): Promise<Task> => {
  const all = getInitialTasks();
  const newTask: Task = {
    ...data,
    status: data.status || "open",
    id: "ts-" + Math.random().toString(36).substring(2, 9),
    createdAt: new Date().toISOString(),
    applicants: [],
  };
  all.push(newTask);
  saveTasks(all);
  return newTask;
};

export const mockUpdateTask = async (taskId: string, updates: Partial<Task>): Promise<Task> => {
  const all = getInitialTasks();
  const taskIndex = all.findIndex(t => t.id === taskId);
  if (taskIndex === -1) throw new Error("Task not found.");
  
  all[taskIndex] = { ...all[taskIndex], ...updates };
  saveTasks(all);
  return all[taskIndex];
};

export const mockDeleteTask = async (taskId: string): Promise<void> => {
  let all = getInitialTasks();
  all = all.filter(t => t.id !== taskId);
  saveTasks(all);
};

export const mockApplyTask = async (taskId: string, appData: Omit<TaskApplication, "id" | "taskId" | "status" | "appliedAt">): Promise<Task> => {
  const all = getInitialTasks();
  const task = all.find(t => t.id === taskId);
  if (!task) throw new Error("Task not found.");
  if (task.applicants.some(a => a.studentId === appData.studentId)) throw new Error("Already applied.");
  
  const newApp: TaskApplication = {
    ...appData,
    id: "app-" + Math.random().toString(36).substring(2, 9),
    taskId,
    status: 'pending',
    appliedAt: new Date().toISOString()
  };
  
  task.applicants.push(newApp);
  saveTasks(all);
  
  // Trigger notification to the company
  import("@/services/mock/mockNotificationApi").then(({ mockAddNotification }) => {
     mockAddNotification({
       userId: task.companyId,
       type: "notice",
       message: `${appData.studentName} applied for your task: ${task.title}`,
       relatedId: task.id
     }).catch(console.error);
  });

  return { ...task };
};

export const mockUpdateApplication = async (taskId: string, appId: string, updates: Partial<TaskApplication>): Promise<Task> => {
  const all = getInitialTasks();
  const task = all.find(t => t.id === taskId);
  if (!task) throw new Error("Task not found.");
  
  const appIndex = task.applicants.findIndex(a => a.id === appId);
  if (appIndex === -1) throw new Error("Application not found.");
  
  task.applicants[appIndex] = { ...task.applicants[appIndex], ...updates };
  saveTasks(all);
  return { ...task };
};

export const mockDeleteApplication = async (taskId: string, appId: string): Promise<Task> => {
  const all = getInitialTasks();
  const task = all.find(t => t.id === taskId);
  if (!task) throw new Error("Task not found.");
  
  task.applicants = task.applicants.filter(a => a.id !== appId);
  saveTasks(all);
  return { ...task };
};

export const mockSubmitTaskWork = async (taskId: string, appId: string, submissionUrl: string): Promise<Task> => {
  const all = getInitialTasks();
  const task = all.find(t => t.id === taskId);
  if (!task) throw new Error("Task not found.");
  
  const appIndex = task.applicants.findIndex(a => a.id === appId);
  if (appIndex === -1) throw new Error("Application not found.");
  
  task.applicants[appIndex] = { 
    ...task.applicants[appIndex], 
    submissionUrl, 
    submittedAt: new Date().toISOString() 
  };
  saveTasks(all);
  return { ...task };
};
