"use client";

import { useQuery } from "@tanstack/react-query";
import { apiSearchHotels } from "@/lib/hotels-api";

export type HotelSearchResult = {
  id: string;
  name: string;
  destinationId?: string;
  destination?: { name?: string; city?: string; state?: string; country?: string };
};

export function useHotelSearch(query: string) {
  const normalizedQuery = typeof query === "string" ? query.trim() : "";
  return useQuery<HotelSearchResult[]>({
    queryKey: ["hotels", "search", normalizedQuery],
    queryFn: () => apiSearchHotels(normalizedQuery),
    enabled: normalizedQuery.length >= 2,
    staleTime: 5 * 60 * 1000,
  });
}
