import { mockRegister, mockLogin } from "@/utils/mockApi";
import type { User } from "@/types/user";

export const registerUser = async (data: User) => {
  return await mockRegister(data);
};

export const loginUser = async (email: string, password: string) => {
  return await mockLogin(email, password);
};