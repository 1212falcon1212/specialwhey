import useSWR, { type SWRConfiguration } from "swr";
import { api } from "@/lib/api";
import type { ApiResponse, PaginatedResponse } from "@/types/api";

const fetcher = async <T>(url: string): Promise<T> => {
  const response = await api.get<T>(url);
  return response.data;
};

export function useApi<T>(
  url: string | null,
  config?: SWRConfiguration<ApiResponse<T>>,
) {
  return useSWR<ApiResponse<T>>(url, fetcher, config);
}

export function usePaginatedApi<T>(
  url: string | null,
  config?: SWRConfiguration<PaginatedResponse<T>>,
) {
  return useSWR<PaginatedResponse<T>>(url, fetcher, config);
}
