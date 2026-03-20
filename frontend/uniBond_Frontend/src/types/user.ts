export type Role = "student" | "lecturer" | "company";


export interface BaseUser {
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

export type User = StudentUser | LecturerUser | CompanyUser;