"use client";
import { useQuery } from "@tanstack/react-query";
import { apiSearchDestinations } from "@/lib/destinations-api";

export function useDestinationSearch(query: string) {
  const normalizedQuery = typeof query === "string" ? query.trim() : "";

  return useQuery({
    queryKey: ["destinations", "search", normalizedQuery],
    queryFn: () => apiSearchDestinations(normalizedQuery),
    enabled: normalizedQuery.length >= 3,
    staleTime: 5 * 60 * 1000,
  });
}
