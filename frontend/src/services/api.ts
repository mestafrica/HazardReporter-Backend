import { AxiosResponse } from "axios";
import { apiClient } from "./config";
import { HazardReport } from "../types/hazardreport";

// POST new hazard report
export const apiNewHazardReporter = async (payload: FormData) => {
  return await apiClient.post("/hazard-report/create", payload);
};

// GET all hazard reports
export const apiGetAllHazardReports = async (): Promise<AxiosResponse<HazardReport[]>> => {
  return apiClient.get<HazardReport[]>("/hazard-report/getall");
};

// GET trending hazard reports
export const apiGetTrendingHazardReports = async (): Promise<AxiosResponse<HazardReport[]>> => {
  return apiClient.get<HazardReport[]>("/hazard-report/getall?sortBy=upvotes&order=desc");
};

// GET hazard report by ID
export const apiGetHazardReportById = async (id: number): Promise<AxiosResponse<HazardReport>> => {
  return apiClient.get<HazardReport>(`/hazard-report/${id}`);
};

// PATCH upvote hazard report by ID
export const apiUpvoteHazard = async (id: string): Promise<AxiosResponse<HazardReport>> => {
  return apiClient.patch<HazardReport>(`/hazard-report/upvote/${id}`);
};

// DELETE hazard report by ID
// export const apiDeleteHazardReportById = async (id: number): Promise<AxiosResponse<void>> => {
//   return apiClient.delete<void>(`/hazard-report/${id}`);
// };