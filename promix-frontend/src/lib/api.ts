import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Request interceptor: Token ekle
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("sw-auth-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor: Error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("sw-auth-token");
        const isAdmin = window.location.pathname.startsWith("/admin");
        window.location.href = isAdmin ? "/admin/giris" : "/giris";
      }
    }
    return Promise.reject(error);
  },
);
