import apiClient from "@/services/api/axiosClient";
import type { User, StudentUser, LecturerUser, CompanyUser, TechLeadUser } from "@/types/user";

export const registerUser = async (data: User) => {
  const payload: Record<string, unknown> = {
    first_name: data.firstname,
    last_name: data.lastname,
    username: data.email,
    email: data.email,
    password: data.password,
    role: data.role,
    city: data.city,
    country: data.country,
    mobile: data.mobile,
    school: data.school ?? null,
  };

  if (data.role === "student" || data.role === "lecturer") {
    payload.education_status = (data as StudentUser | LecturerUser).education;
    payload.school = (data as StudentUser | LecturerUser).school;
  }

  if (data.role === "company") {
    const c = data as CompanyUser;
    payload.description = `${c.companyName} | ${c.industry} | Size: ${c.companySize}`;
  }

  if (data.role === "tech_lead") {
    const t = data as TechLeadUser;
    payload.description = `Expert in ${t.industryExpertise} | ${t.yearsOfExperience} years`;
  }

  const response = await apiClient.post("/users/", payload);
  return { message: "Registration successful.", user: response.data };
};

export const loginUser = async (email: string, password: string) => {
  const formData = new FormData();
  formData.append("username", email);
  formData.append("password", password);
  const res = await apiClient.post("/users/login", formData);
  return res.data;
};

export const uploadCV = async (userId: string, file: File) => {
  const fd = new FormData();
  fd.append("file", file);
  const res = await apiClient.post(`/users/${userId}/cv`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};