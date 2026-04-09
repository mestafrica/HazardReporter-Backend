import { AxiosResponse } from "axios";
import { apiClient } from "./config";

export const apiGetAllReports = async (): Promise<AxiosResponse> => {
  try {
    return await apiClient.get("/api/admin/reports");
  } catch (error) {
    throw new Error(`Failed to fetch reports: ${error}`);
  }
};

export const apiGetReportStats = async (): Promise<AxiosResponse> => {
  try {
    return await apiClient.get("/api/admin/reports/stats");
  } catch (error) {
    throw new Error(`Failed to fetch report stats: ${error}`);
  }
};
