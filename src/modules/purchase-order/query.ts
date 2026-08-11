"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deletePurchaseOrder,
  getPurchaseOrder,
  getPurchaseOrders,
  savePurchaseOrder,
  updatePurchaseOrder,
} from "./storage";
import { PurchaseOrderFormData } from "./schema";

export const purchaseOrderQueryKeys = {
  all: ["purchase-orders"] as const,
  detail: (id: string) => [...purchaseOrderQueryKeys.all, id] as const,
};

export function usePurchaseOrders() {
  return useQuery({
    queryKey: purchaseOrderQueryKeys.all,
    queryFn: () => getPurchaseOrders(),
  });
}

export function usePurchaseOrder(id: string | undefined) {
  return useQuery({
    queryKey: purchaseOrderQueryKeys.detail(id ?? ""),
    queryFn: () => getPurchaseOrder(id as string),
    enabled: !!id,
  });
}

export function useSavePurchaseOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: PurchaseOrderFormData) => savePurchaseOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: purchaseOrderQueryKeys.all });
    },
  });
}

export function useUpdatePurchaseOrder(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: PurchaseOrderFormData) =>
      updatePurchaseOrder(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: purchaseOrderQueryKeys.all });
      queryClient.invalidateQueries({
        queryKey: purchaseOrderQueryKeys.detail(id),
      });
    },
  });
}

export function useDeletePurchaseOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => deletePurchaseOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: purchaseOrderQueryKeys.all });
    },
  });
}
