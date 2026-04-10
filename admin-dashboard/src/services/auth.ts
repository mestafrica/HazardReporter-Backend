import { AxiosResponse } from "axios";
import { apiClient } from "./config";

export const apiAdminLogin = async (
  payload: object
): Promise<AxiosResponse> => {
  try {
    return await apiClient.post("/api/admin/signin", payload);
  } catch (error) {
    throw new Error(`Login failed: ${error}`);
  }
};
export const apiGetAdminProfile = async (): Promise<AxiosResponse> => {
  try {
    return await apiClient.get("/api/admin/profile");
  } catch (error) {
    throw new Error(`Failed to fetch admin profile: ${error}`);
  }
};

export const apiUpdateAdminProfile = async (
  payload: any
): Promise<AxiosResponse> => {
  try {
    // If payload is FormData (for avatar upload), axios handles it
    return await apiClient.patch("/api/admin/profile", payload, {
      headers: {
        "Content-Type": payload instanceof FormData ? "multipart/form-data" : "application/json",
      },
    });
  } catch (error) {
    throw new Error(`Failed to update admin profile: ${error}`);
  }
};
