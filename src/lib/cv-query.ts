"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  apiDeleteVoucher,
  apiGetVoucher,
  apiGetVouchers,
  apiSaveVoucher,
  apiUpdateVoucher,
  ConfirmationVoucherRecord,
} from "@/lib/cv-api";
import { ConfirmationVoucherFormData } from "@/app/pages/dashboard/confirmationvouchers/schema";

export const cvQueryKeys = {
  all: ["confirmation-vouchers"] as const,
  detail: (id: string) => [...cvQueryKeys.all, id] as const,
};

export type PaginatedVouchers = {
  items: ConfirmationVoucherRecord[];
  total: number;
  page: number;
  limit: number;
};

export function useConfirmationVouchers(params?: {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}) {
  return useQuery({
    queryKey: [...cvQueryKeys.all, params],
    queryFn: () => apiGetVouchers(params),
  });
}

export function useConfirmationVoucher(id: string | undefined) {
  return useQuery({
    queryKey: cvQueryKeys.detail(id ?? ""),
    queryFn: () => apiGetVoucher(id as string),
    enabled: !!id,
  });
}

export function useSaveConfirmationVoucher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ConfirmationVoucherFormData) => apiSaveVoucher(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cvQueryKeys.all });
    },
  });
}

export function useUpdateConfirmationVoucher(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ConfirmationVoucherFormData) => apiUpdateVoucher(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cvQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: cvQueryKeys.detail(id) });
    },
  });
}

export function useDeleteConfirmationVoucher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiDeleteVoucher(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cvQueryKeys.all });
    },
  });
}