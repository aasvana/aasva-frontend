"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteConfirmationVoucher,
  getConfirmationVoucher,
  getConfirmationVouchers,
  saveConfirmationVoucher,
  updateConfirmationVoucher,
} from "@/lib/cv-storage";
import { ConfirmationVoucherFormData } from "@/app/pages/dashboard/confirmationvouchers/schema";

export const cvQueryKeys = {
  all: ["confirmation-vouchers"] as const,
  detail: (id: string) => [...cvQueryKeys.all, id] as const,
};

export function useConfirmationVouchers() {
  return useQuery({
    queryKey: cvQueryKeys.all,
    queryFn: () => getConfirmationVouchers(),
  });
}

export function useConfirmationVoucher(id: string | undefined) {
  return useQuery({
    queryKey: cvQueryKeys.detail(id ?? ""),
    queryFn: () => getConfirmationVoucher(id as string),
    enabled: !!id,
  });
}

export function useSaveConfirmationVoucher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ConfirmationVoucherFormData) =>
      saveConfirmationVoucher(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cvQueryKeys.all });
    },
  });
}

export function useUpdateConfirmationVoucher(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ConfirmationVoucherFormData) =>
      updateConfirmationVoucher(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cvQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: cvQueryKeys.detail(id) });
    },
  });
}

export function useDeleteConfirmationVoucher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => deleteConfirmationVoucher(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cvQueryKeys.all });
    },
  });
}
