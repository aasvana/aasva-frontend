"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteDeliveryNote,
  getDeliveryNote,
  getDeliveryNotes,
  saveDeliveryNote,
  updateDeliveryNote,
} from "./storage";
import { DeliveryNoteFormData } from "./schema";

export const deliveryNoteQueryKeys = {
  all: ["delivery-notes"] as const,
  detail: (id: string) => [...deliveryNoteQueryKeys.all, id] as const,
};

export function useDeliveryNotes() {
  return useQuery({
    queryKey: deliveryNoteQueryKeys.all,
    queryFn: () => getDeliveryNotes(),
  });
}

export function useDeliveryNote(id: string | undefined) {
  return useQuery({
    queryKey: deliveryNoteQueryKeys.detail(id ?? ""),
    queryFn: () => getDeliveryNote(id as string),
    enabled: !!id,
  });
}

export function useSaveDeliveryNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: DeliveryNoteFormData) => saveDeliveryNote(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: deliveryNoteQueryKeys.all });
    },
  });
}

export function useUpdateDeliveryNote(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: DeliveryNoteFormData) =>
      updateDeliveryNote(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: deliveryNoteQueryKeys.all });
      queryClient.invalidateQueries({
        queryKey: deliveryNoteQueryKeys.detail(id),
      });
    },
  });
}

export function useDeleteDeliveryNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => deleteDeliveryNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: deliveryNoteQueryKeys.all });
    },
  });
}
