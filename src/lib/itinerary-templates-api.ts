import api from "@/lib/api.utils";
export type ItineraryTemplate = { id: string; subject: string; price: number; status: string; updatedAt: string; days: { dayOrder: number; subject: string; description: string }[] };
export async function apiSearchItineraryTemplates(subject: string) { const { data } = await api.get<ItineraryTemplate[]>("/itinerary-templates", { params: { subject } }); return Array.isArray(data) ? data : []; }
export async function apiCreateItineraryTemplate(data: { subject: string; days: { dayOrder: number; subject: string; description: string }[] }) { const { data: saved } = await api.post<ItineraryTemplate>("/itinerary-templates", data); return saved; }

export async function apiSearchPackages(name: string) { const { data } = await api.get<ItineraryTemplate[]>("/packages", { params: { name } }); return Array.isArray(data) ? data : []; }
export async function apiCreatePackage(data: { name: string; days: { dayOrder: number; subject: string; description: string }[] }) { const { data: saved } = await api.post<ItineraryTemplate>("/packages", { subject: data.name, days: data.days }); return saved; }
export async function apiUpdatePackage(id: string, data: { subject: string; price: number; status: string; days: { dayOrder: number; subject: string; description: string }[] }) { const { data: saved } = await api.patch<ItineraryTemplate>(`/packages/${id}`, data); return saved; }
export async function apiDeletePackage(id: string) { await api.delete(`/packages/${id}`); }
