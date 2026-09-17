"use client";
import { useQuery } from "@tanstack/react-query";
import { apiSearchPackages } from "@/lib/itinerary-templates-api";
export function useItineraryTemplateSearch(subject: string) { const query = subject.trim(); return useQuery({ queryKey: ["packages", query], queryFn: () => apiSearchPackages(query), enabled: query.length >= 2, staleTime: 60_000 }); }
