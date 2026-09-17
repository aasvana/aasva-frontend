import api from "@/lib/api.utils";
export async function apiSearchHotels(query: string) {
  const { data } = await api.get("/hotels/search", { params: { q: query } });
  return Array.isArray(data) ? data : [];
}

export async function apiGetHotels() {
  const { data } = await api.get("/hotels");
  return Array.isArray(data) ? data : [];
}

export async function apiCreateHotel(data: {
  name: string;
  destinationId: string;
  starRating?: string;
  notes?: string;
}) {
  const { data: created } = await api.post("/hotels", data);
  return created;
}

export async function apiUpdateHotel(id: string, data: {
  name: string;
  destinationId: string;
  starRating?: string;
  notes?: string;
}) {
  const { data: updated } = await api.patch(`/hotels/${id}`, data);
  return updated;
}

export async function apiDeleteHotel(id: string) { await api.delete(`/hotels/${id}`); }
