import { api } from "./api";
import type { User } from "@/types/user";
import type { ApiResponse } from "@/types/api";

export async function login(
  email: string,
  password: string,
): Promise<{ user: User; token: string }> {
  const response = await api.post<
    ApiResponse<{ user: User; token: string }>
  >("/auth/login", { email, password });
  return response.data.data;
}

export async function register(data: {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
}): Promise<{ user: User; token: string }> {
  const response = await api.post<
    ApiResponse<{ user: User; token: string }>
  >("/auth/register", data);
  return response.data.data;
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}

export async function getMe(): Promise<User> {
  const response = await api.get<ApiResponse<User>>("/auth/me");
  return response.data.data;
}
