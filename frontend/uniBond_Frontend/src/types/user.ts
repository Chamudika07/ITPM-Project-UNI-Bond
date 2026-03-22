export type Role = "student" | "lecturer" | "company" | "tech_lead" | "admin";

export interface BaseUser {
  id: string;
  user_code?: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: Role;
  // Common new fields
  city: string;
  country: string;
  mobile: string;
  school?: string;       // student & lecturer
  cv_path?: string;
  access_status?: "active" | "pending" | "suspended";
}

export interface StudentUser extends BaseUser {
  role: "student";
  school: string;
  education: "Diploma" | "Higher Diploma" | "Bachelor" | "Master";
}

export interface LecturerUser extends BaseUser {
  role: "lecturer";
  school: string;
  education: "Diploma" | "Higher Diploma" | "Bachelor" | "Master";
}

export interface CompanyUser extends BaseUser {
  role: "company";
  companyName: string;
  industry: string;
  companySize: string;
}

export interface TechLeadUser extends BaseUser {
  role: "tech_lead";
  industryExpertise: string;
  yearsOfExperience: string;
}

export interface AdminUser extends BaseUser {
  role: "admin";
  adminLevel?: string;
}

export type User = StudentUser | LecturerUser | CompanyUser | TechLeadUser | AdminUser;