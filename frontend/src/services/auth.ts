import { apiClient } from "./config";

export const apiLogin = async (payload: {
  userName: string;
  password: string;
}) => apiClient.post("api/users/login", payload);

export const apiSignup = async (payload: {
  email: string;
  password: string;
  confirmPassword: string;
  userName: string;
}) => apiClient.post("/api/users/register", payload);