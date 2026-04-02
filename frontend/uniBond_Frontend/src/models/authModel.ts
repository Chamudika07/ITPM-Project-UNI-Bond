import { authService } from "@/services/authService";
import type { User } from "@/types/user";

export const registerUser = async (data: User) => {
  return await authService.register({
    username: data.username,
    email: data.email,
    password: data.password,
    role: data.role,
  });
};

export const loginUser = async (email: string, password: string) => {
  const response = await authService.login({
    username: email,
    password,
  });
  
  // Store token
  authService.setToken(response.access_token);
  
  return response;
};