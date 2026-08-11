"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteInvoice,
  getInvoice,
  getInvoices,
  saveInvoice,
  updateInvoice,
} from "./storage";
import { InvoiceFormData } from "./schema";

export const invoiceQueryKeys = {
  all: ["invoices"] as const,
  detail: (id: string) => [...invoiceQueryKeys.all, id] as const,
};

export function useInvoices() {
  return useQuery({
    queryKey: invoiceQueryKeys.all,
    queryFn: () => getInvoices(),
  });
}

export function useInvoice(id: string | undefined) {
  return useQuery({
    queryKey: invoiceQueryKeys.detail(id ?? ""),
    queryFn: () => getInvoice(id as string),
    enabled: !!id,
  });
}

export function useSaveInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InvoiceFormData) => saveInvoice(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invoiceQueryKeys.all });
    },
  });
}

export function useUpdateInvoice(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InvoiceFormData) => updateInvoice(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invoiceQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: invoiceQueryKeys.detail(id) });
    },
  });
}

export function useDeleteInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => deleteInvoice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invoiceQueryKeys.all });
    },
  });
}
