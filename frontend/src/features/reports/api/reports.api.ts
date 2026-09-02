import apiClient from '../../../lib/axios';
import type { ReportSummary } from '../types/report.types';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export const getReportSummary = async (): Promise<ReportSummary> => {
  const response = await apiClient.get<ApiResponse<ReportSummary>>('/reports/summary');
  return response.data.data;
};
