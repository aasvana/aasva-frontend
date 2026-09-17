"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  apiCreateTerm,
  apiDeleteTerm,
  apiGetTerms,
  apiReorderTerms,
  apiUpdateTerm,
  CreateTermPayload,
  UpdateTermPayload,
} from "@/lib/terms-api";
import { useAuthStore } from "@/stores/AuthStore";

export const termsQueryKeys = {
  all: (tenantId: string) => ["terms-conditions", tenantId] as const,
  detail: (tenantId: string, activeOnly: boolean) =>
    [...termsQueryKeys.all(tenantId), activeOnly] as const,
};

export function useTerms(activeOnly = false) {
  const tenantId = useAuthStore((s) => s.user?.tenantId) ?? "";
  return useQuery({
    queryKey: termsQueryKeys.detail(tenantId, activeOnly),
    queryFn: () => apiGetTerms(activeOnly),
  });
}

export function useActiveTerms() {
  return useTerms(true);
}

function useInvalidateTerms() {
  const queryClient = useQueryClient();
  const tenantId = useAuthStore((s) => s.user?.tenantId) ?? "";
  return () => {
    queryClient.invalidateQueries({ queryKey: termsQueryKeys.all(tenantId) });
  };
}

export function useCreateTerm() {
  const invalidateTerms = useInvalidateTerms();
  return useMutation({
    mutationFn: (payload: CreateTermPayload) => apiCreateTerm(payload),
    onSuccess: () => invalidateTerms(),
  });
}

export function useUpdateTerm() {
  const invalidateTerms = useInvalidateTerms();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTermPayload }) =>
      apiUpdateTerm(id, payload),
    onSuccess: () => invalidateTerms(),
  });
}

export function useReorderTerms() {
  const invalidateTerms = useInvalidateTerms();
  return useMutation({
    mutationFn: (ids: string[]) => apiReorderTerms(ids),
    onSuccess: () => invalidateTerms(),
  });
}

export function useDeleteTerm() {
  const invalidateTerms = useInvalidateTerms();
  return useMutation({
    mutationFn: (id: string) => apiDeleteTerm(id),
    onSuccess: () => invalidateTerms(),
  });
}
