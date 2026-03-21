export type Role = "student" | "lecturer" | "company" | "tech_lead" | "admin";


export interface BaseUser {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: Role;
}

export interface StudentUser extends BaseUser {
  role: "student";
  studentID: string;
  education: "Diploma" | "Higher Diploma" | "Bachelor" | "Master";
}

export interface LecturerUser extends BaseUser {
  role: "lecturer";
  lecturerUsername: string;
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
  adminLevel: string;
}

export type User = StudentUser | LecturerUser | CompanyUser | TechLeadUser | AdminUser;