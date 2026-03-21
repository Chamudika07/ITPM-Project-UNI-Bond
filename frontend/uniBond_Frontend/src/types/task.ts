export interface Task {
  id: string;
  companyId: string;
  companyName: string;
  title: string;
  description: string;
  requirements: string[];
  salaryOrReward: string;
  deadline: string;
  createdAt: string;
  applicants: string[];
}
