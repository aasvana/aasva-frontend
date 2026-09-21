"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { INDIA_CITIES_BY_STATE, INDIA_COUNTRY, INDIA_STATES } from "@/constants/indiaLocations";
import { useDestinationSearch } from "@/lib/destinations-query";
import { capitalizeWords } from "@/lib/text-format";

export type DestinationDraft = {
  name: string;
  state: string;
  city: string;
  country: string;
  street?: string;
  countryCode?: string;
  postalCode?: string;
  latitude?: number | null;
  longitude?: number | null;
  displayName?: string;
  originalName?: string | null;
  source?: string | null;
  externalId?: string | null;
  status?: string;
};

export type DestinationSuggestion = {
  name: string;
  originalName?: string | null;
  state: string;
  city: string;
  country: string;
  street?: string;
  countryCode?: string;
  postalCode?: string;
  latitude?: number | null;
  longitude?: number | null;
  displayName?: string;
  source?: string | null;
  externalId?: string | null;
};

type DestinationDrawerProps = {
  open: boolean;
  initialValue?: Partial<DestinationDraft>;
  title?: string;
  mode?: "tenant" | "admin";
  onOpenChange: (open: boolean) => void;
  onSave: (draft: DestinationDraft, suggestion?: DestinationSuggestion) => void | Promise<void>;
};

export function DestinationDrawer({ open, initialValue, title = "Add Destination", mode = "tenant", onOpenChange, onSave }: DestinationDrawerProps) {
  const [draft, setDraft] = useState<DestinationDraft>({
    name: initialValue?.name ?? "",
    state: initialValue?.state ?? "",
    city: initialValue?.city ?? "",
    country: initialValue?.country ?? INDIA_COUNTRY,
  });
  const [search, setSearch] = useState(initialValue?.name ?? "");
  const [suggestionsOpen, setSuggestionsOpen] = useState(Boolean(initialValue?.name));
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { data = [], isFetching } = useDestinationSearch(debouncedSearch);
  const suggestions = Array.isArray(data) ? data : [];
  const set = (field: keyof DestinationDraft, value: string | number) =>
    setDraft((current) => ({ ...current, [field]: value }));

  useEffect(() => {
    if (!open) return;
    setDraft({
      name: initialValue?.name ?? "",
      state: initialValue?.state ?? "",
      city: initialValue?.city ?? "",
      country: initialValue?.country ?? INDIA_COUNTRY,
      street: initialValue?.street ?? "",
      countryCode: initialValue?.countryCode ?? "",
      postalCode: initialValue?.postalCode ?? "",
      latitude: initialValue?.latitude ?? null,
      longitude: initialValue?.longitude ?? null,
      displayName: initialValue?.displayName ?? "",
      originalName: initialValue?.originalName ?? "",
      source: initialValue?.source ?? "",
      externalId: initialValue?.externalId ?? "",
      status: initialValue?.status ?? "active",
    });
    setSearch(initialValue?.name ?? "");
    setSuggestionsOpen(Boolean(initialValue?.name));
  }, [open, initialValue]);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  const selectSuggestion = (suggestion: DestinationSuggestion) => {
    setDraft((current) => ({
      ...current,
      name: suggestion.name,
      originalName: suggestion.originalName ?? suggestion.name,
      street: suggestion.street ?? "",
      state: suggestion.state,
      city: suggestion.city,
      country: suggestion.country || INDIA_COUNTRY,
      countryCode: suggestion.countryCode ?? "",
      postalCode: suggestion.postalCode ?? "",
      latitude: suggestion.latitude ?? null,
      longitude: suggestion.longitude ?? null,
      displayName: suggestion.displayName ?? suggestion.name,
      source: suggestion.source ?? "nominatim",
      externalId: suggestion.externalId ?? null,
    }));
    setSearch(suggestion.name);
    setSuggestionsOpen(false);
  };

  const submit = () => {
    if (!draft.name.trim()) return;
    void onSave({ ...draft, name: capitalizeWords(draft.name) });
  };

  return (
    <Drawer direction="right" open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="top-0 right-0 h-full w-full sm:max-w-sm">
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>Search for an Indian destination or add it manually.</DrawerDescription>
        </DrawerHeader>
          <div className="grid gap-4 overflow-y-auto px-4">
          <div className="grid gap-1.5">
            <Label htmlFor="destination-name">{mode === "admin" ? "Display Name" : "Destination Name"} <span className="text-red-500">*</span></Label>
            <Input
              id="destination-name"
              value={draft.name}
              onChange={(event) => {
                const value = event.target.value;
                setDraft((current) => ({ ...current, name: value }));
                setSearch(value);
                setSuggestionsOpen(true);
              }}
              placeholder="Search destination, e.g. Havelock"
              autoFocus
            />
            {suggestionsOpen && search.trim().length >= 3 && (
              <div className="rounded-lg border border-gray-200 bg-white p-1 shadow-sm">
                {isFetching ? <p className="px-3 py-2 text-sm text-gray-500">Searching destinations...</p> : suggestions.length ? suggestions.map((suggestion) => (
                  <button key={`${suggestion.externalId ?? suggestion.name}-${suggestion.city}`} type="button" className="flex w-full flex-col rounded-md px-3 py-2 text-left hover:bg-gray-50" onClick={() => selectSuggestion(suggestion)}>
                    <span className="text-sm font-medium text-gray-800">{suggestion.name}</span>
                    <span className="text-xs text-gray-500">{[suggestion.city, suggestion.state, suggestion.country].filter(Boolean).join(", ") || suggestion.displayName}</span>
                  </button>
                )) : <p className="px-3 py-2 text-sm text-gray-500">No destinations found</p>}
              </div>
            )}
          </div>
          {mode === "admin" && (
            <div className="grid gap-4 border-t border-gray-100 pt-4">
              <div className="grid gap-1.5"><Label>Original Name</Label><Input value={draft.originalName ?? ""} readOnly /></div>
              <div className="grid gap-1.5"><Label>Street / Address</Label><Input value={draft.street ?? ""} onChange={(event) => set("street", event.target.value)} /></div>
              <div className="grid gap-1.5"><Label>Country Code</Label><Input value={draft.countryCode ?? ""} onChange={(event) => set("countryCode", event.target.value)} /></div>
              <div className="grid gap-1.5"><Label>Postal Code</Label><Input value={draft.postalCode ?? ""} onChange={(event) => set("postalCode", event.target.value)} /></div>
              <div className="grid grid-cols-2 gap-3"><div className="grid gap-1.5"><Label>Latitude</Label><Input type="number" value={draft.latitude ?? ""} onChange={(event) => set("latitude", event.target.value ? Number(event.target.value) : "")} /></div><div className="grid gap-1.5"><Label>Longitude</Label><Input type="number" value={draft.longitude ?? ""} onChange={(event) => set("longitude", event.target.value ? Number(event.target.value) : "")} /></div></div>
              <div className="grid gap-1.5"><Label>Display Name / Full Address</Label><Input value={draft.displayName ?? ""} onChange={(event) => set("displayName", event.target.value)} /></div>
              <div className="grid gap-1.5"><Label>Status</Label><Combobox options={[{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }]} value={draft.status ?? "active"} onChange={(value) => set("status", value)} placeholder="Select status" searchPlaceholder="Search status..." /></div>
              <div className="grid gap-1.5"><Label>Source</Label><Input value={draft.source ?? ""} readOnly /></div>
              <div className="grid gap-1.5"><Label>External ID</Label><Input value={draft.externalId ?? ""} readOnly /></div>
            </div>
          )}
          <div className="grid gap-1.5">
            <Label>State</Label>
            <Combobox options={INDIA_STATES.map((state) => ({ value: state, label: state }))} value={draft.state} onChange={(state) => setDraft((current) => ({ ...current, state, city: "" }))} placeholder="Select state" searchPlaceholder="Search states..." />
          </div>
          <div className="grid gap-1.5">
            <Label>City</Label>
            <Combobox options={(INDIA_CITIES_BY_STATE[draft.state] ?? []).map((city) => ({ value: city, label: city }))} value={draft.city} onChange={(city) => setDraft((current) => ({ ...current, city }))} placeholder={draft.state ? "Select city" : "Select state first"} searchPlaceholder="Search cities..." />
          </div>
          <div className="grid gap-1.5">
            <Label>Country</Label>
            <Input value={draft.country} readOnly aria-readonly="true" />
          </div>
        </div>
        <DrawerFooter>
          <Button onClick={submit} disabled={!draft.name.trim()}>{title}</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
