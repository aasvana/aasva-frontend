"use client";
import { useQuery } from "@tanstack/react-query";
import { apiSearchPackages } from "@/lib/packages-api";
export function usePackageSearch(name: string) {
  const query = name.trim();
  return useQuery({
    queryKey: ["packages", query],
    queryFn: () => apiSearchPackages(query),
    enabled: query.length >= 2,
    staleTime: 60_000,
  });
}