import api from "@/lib/api.utils";

export type Destination = {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  country: string;
  countryCode: string;
  postalCode: string;
  latitude: number | null;
  longitude: number | null;
  displayName: string;
  source: string | null;
  externalId: string | null;
  originalName?: string | null;
  slug?: string;
  status?: string;
};

export async function apiSearchDestinations(query: string) {
  const { data } = await api.get<Destination[]>("/destinations/search", { params: { q: query } });
  return Array.isArray(data) ? data : [];
}

export async function apiGetDestinations() {
  const { data } = await api.get<Destination[]>("/destinations");
  return Array.isArray(data) ? data : [];
}

export async function apiCreateDestination(data: {
  name: string;
  street?: string;
  state?: string;
  city?: string;
  country?: string;
  countryCode?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  displayName?: string;
  source?: string;
  externalId?: string;
  originalName?: string;
}) {
  const { data: created } = await api.post<Destination>("/destinations", data);
  return created;
}

export async function apiUpdateDestination(id: string, data: Partial<Destination>) {
  const { data: updated } = await api.patch<Destination>(`/destinations/${id}`, data);
  return updated;
}

export async function apiDeleteDestination(id: string) {
  await api.delete(`/destinations/${id}`);
}
