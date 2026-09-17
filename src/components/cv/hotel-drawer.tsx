"use client";

import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Combobox, ComboboxOption } from "@/components/ui/combobox";
import { useEffect, useState } from "react";
import { useHotelSearch, HotelSearchResult } from "@/lib/hotels-query";

export type HotelDraft = { name: string; destinationId: string; rating: string; notes: string };

export function HotelDrawer({ open, initialValue, destinations, onOpenChange, onSave }: {
  open: boolean;
  initialValue?: Partial<HotelDraft>;
  destinations: ComboboxOption[];
  onOpenChange: (open: boolean) => void;
  onSave: (draft: HotelDraft) => void;
}) {
  const [draft, setDraft] = useState<HotelDraft>({ name: initialValue?.name ?? "", destinationId: initialValue?.destinationId ?? "", rating: initialValue?.rating ?? "", notes: initialValue?.notes ?? "" });
  const [hotelSearch, setHotelSearch] = useState("");
  const [debouncedHotelSearch, setDebouncedHotelSearch] = useState("");
  const [hotelSuggestionsOpen, setHotelSuggestionsOpen] = useState(false);
  const { data: hotelResults = [], isFetching: hotelsLoading } = useHotelSearch(debouncedHotelSearch);
  useEffect(() => {
    if (!open) return;
    setDraft({
      name: initialValue?.name ?? "",
      destinationId: initialValue?.destinationId ?? "",
      rating: initialValue?.rating ?? "",
      notes: initialValue?.notes ?? "",
    });
  }, [open, initialValue?.name, initialValue?.destinationId, initialValue?.rating, initialValue?.notes]);
  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedHotelSearch(hotelSearch.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [hotelSearch]);
  const set = (field: keyof HotelDraft, value: string) => setDraft((current) => ({ ...current, [field]: value }));
  const selectHotel = (hotel: HotelSearchResult) => {
    setDraft((current) => ({
      ...current,
      name: hotel.name,
      destinationId: hotel.destinationId ?? current.destinationId,
    }));
    setHotelSearch(hotel.name);
    setHotelSuggestionsOpen(false);
  };
  return (
    <Drawer direction="right" open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="top-0 right-0 h-full w-full sm:max-w-sm">
        <DrawerHeader><DrawerTitle>{initialValue ? "Edit Hotel" : "Add Hotel"}</DrawerTitle><DrawerDescription>Manage the hotel name, destination, rating, and notes.</DrawerDescription></DrawerHeader>
        <div className="grid gap-4 overflow-y-auto px-4">
          <div className="grid gap-1.5">
            <Label>Hotel Name *</Label>
            <Input autoFocus value={draft.name} onChange={(event) => { const value = event.target.value; set("name", value); setHotelSearch(value); setHotelSuggestionsOpen(true); }} placeholder="Search or enter hotel name" />
            {hotelSuggestionsOpen && hotelSearch.trim().length >= 2 && (
              <div className="rounded-lg border border-gray-200 bg-white p-1 shadow-sm">
                {hotelsLoading ? <p className="px-3 py-2 text-sm text-gray-500">Searching hotels...</p> : hotelResults.length > 0 ? hotelResults.map((hotel) => (
                  <button key={hotel.id} type="button" className="flex w-full flex-col rounded-md px-3 py-2 text-left hover:bg-gray-50" onClick={() => selectHotel(hotel)}>
                    <span className="text-sm font-medium text-gray-800">{hotel.name}</span>
                    <span className="text-xs text-gray-500">{[hotel.destination?.name, hotel.destination?.city, hotel.destination?.state, hotel.destination?.country].filter(Boolean).join(", ")}</span>
                  </button>
                )) : <p className="px-3 py-2 text-sm text-gray-500">No existing hotels found</p>}
              </div>
            )}
          </div>
          <div className="grid gap-1.5"><Label>Destination *</Label><Combobox options={destinations} value={draft.destinationId} onChange={(value) => set("destinationId", value)} placeholder="Search destination" searchPlaceholder="Search destinations..." /></div>
          <div className="grid gap-1.5"><Label>Star Rating</Label><Combobox options={["1","2","3","4","5"].map((value) => ({ value, label: `${value} Star` }))} value={draft.rating} onChange={(value) => set("rating", value)} placeholder="Select rating" searchPlaceholder="Search rating..." /></div>
          <div className="grid gap-1.5"><Label>Notes</Label><Textarea value={draft.notes} onChange={(event) => set("notes", event.target.value)} placeholder="Optional notes..." /></div>
        </div>
        <DrawerFooter><Button disabled={!draft.name.trim() || !draft.destinationId} onClick={() => onSave(draft)}>Save Hotel</Button></DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
