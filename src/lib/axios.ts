import axios, { AxiosError } from "axios";
import { API_BASE_URL } from "@/lib/routes";
import Router from "next/router";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

// Attach token to every request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const config = error?.config ?? {};
    const url: string = config.url ?? "";
    const isAuthEndpoint =
      url.includes("/auth/login") || url.includes("/auth/signup");
    const isLogoutPage =
      typeof window !== "undefined" && window.location.pathname === "/logout";

    if (error.response?.status === 401 && !isAuthEndpoint && !isLogoutPage) {
      Router.push("/logout");
    }
    return Promise.reject(error);
  }
);

export function getApiError(
  error: unknown,
  fallback = "Something went wrong"
): string {
  if (axios.isAxiosError(error)) {
    const data = (error as AxiosError).response?.data as
      { detail?: string; message?: string; error?: string } | undefined;
    if (typeof data?.detail === "string" && data.detail) return data.detail;
    if (typeof data?.message === "string" && data.message) return data.message;
    if (typeof data?.error === "string" && data.error) return data.error;
    if (
      error.code === "ECONNABORTED" ||
      error.message === "timeout of 15000ms exceeded"
    ) {
      return "The request timed out. Please try again.";
    }
    if (error.response) {
      return `Request failed with status ${error.response.status}`;
    }
    if (error.request) {
      return "Unable to reach the server. Please check your connection.";
    }
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export default axiosInstance;
