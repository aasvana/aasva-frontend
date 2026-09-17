import api from "@/lib/api.utils";

export type Term = {
  id: string;
  title: string | null;
  content: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TermSnapshot = {
  id: string;
  title: string | null;
  content: string;
  sortOrder: number;
};

export type CreateTermPayload = {
  title?: string;
  content: string;
  sortOrder?: number;
  isActive?: boolean;
};

export type UpdateTermPayload = Partial<CreateTermPayload>;

export async function apiGetTerms(activeOnly = false) {
  const { data } = await api.get<Term[]>("/terms-conditions", {
    params: activeOnly ? { active: true } : undefined,
  });
  return Array.isArray(data) ? data : [];
}

export async function apiCreateTerm(payload: CreateTermPayload) {
  const { data } = await api.post<Term>("/terms-conditions", payload);
  return data;
}

export async function apiUpdateTerm(id: string, payload: UpdateTermPayload) {
  const { data } = await api.patch<Term>(`/terms-conditions/${id}`, payload);
  return data;
}

export async function apiReorderTerms(ids: string[]) {
  const { data } = await api.patch<Term[]>("/terms-conditions/reorder", { ids });
  return Array.isArray(data) ? data : [];
}

export async function apiDeleteTerm(id: string) {
  await api.delete(`/terms-conditions/${id}`);
}
