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
import { useAuthStore } from "@/stores/AuthStore";

export const cvQueryKeys = {
  all: (tenantId: string) => ["confirmation-vouchers", tenantId] as const,
  detail: (tenantId: string, id: string) =>
    [...cvQueryKeys.all(tenantId), id] as const,
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
  const tenantId = useAuthStore((s) => s.user?.tenantId) ?? "";
  return useQuery({
    queryKey: [...cvQueryKeys.all(tenantId), params],
    queryFn: () => apiGetVouchers(params),
  });
}

export function useConfirmationVoucher(id: string | undefined) {
  const tenantId = useAuthStore((s) => s.user?.tenantId) ?? "";
  return useQuery({
    queryKey: cvQueryKeys.detail(tenantId, id ?? ""),
    queryFn: () => apiGetVoucher(id as string),
    enabled: !!id,
  });
}

export function useSaveConfirmationVoucher() {
  const queryClient = useQueryClient();
  const tenantId = useAuthStore((s) => s.user?.tenantId) ?? "";
  return useMutation({
    mutationFn: (data: ConfirmationVoucherFormData) => apiSaveVoucher(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cvQueryKeys.all(tenantId) });
    },
  });
}

export function useUpdateConfirmationVoucher(id: string) {
  const queryClient = useQueryClient();
  const tenantId = useAuthStore((s) => s.user?.tenantId) ?? "";
  return useMutation({
    mutationFn: (data: ConfirmationVoucherFormData) => apiUpdateVoucher(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cvQueryKeys.all(tenantId) });
      queryClient.invalidateQueries({
        queryKey: cvQueryKeys.detail(tenantId, id),
      });
    },
  });
}

export function useDeleteConfirmationVoucher() {
  const queryClient = useQueryClient();
  const tenantId = useAuthStore((s) => s.user?.tenantId) ?? "";
  return useMutation({
    mutationFn: (id: string) => apiDeleteVoucher(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cvQueryKeys.all(tenantId) });
    },
  });
}