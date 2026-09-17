"use client";

import { useEffect, useState } from "react";
import { MasterDataManager } from "@/components/cv/master-data-manager";
import { HotelDrawer } from "@/components/cv/hotel-drawer";
import { useSupplierStore, Supplier } from "@/stores/supplierStore";
import { apiGetDestinations, Destination } from "@/lib/destinations-api";
import { apiCreateHotel, apiDeleteHotel, apiGetHotels, apiUpdateHotel } from "@/lib/hotels-api";
import { notify } from "@/lib/notify";

export function HotelSupplierManager() {
  const suppliers = useSupplierStore((s) => s.suppliers);
  const clearHotelSuppliers = useSupplierStore((s) => s.clearHotelSuppliers);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [databaseHotels, setDatabaseHotels] = useState<Supplier[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<Supplier | null>(null);
  useEffect(() => { void apiGetDestinations().then(setDestinations); }, []);
  useEffect(() => {
    clearHotelSuppliers();
    void apiGetHotels().then((items) => setDatabaseHotels(items.map((item) => ({
      id: item.id,
      category: "hotel",
      name: item.name,
      destinationId: item.destinationId,
      contactPerson: "",
      phone: "",
      email: "",
      city: "",
      country: "",
      rating: item.starRating ?? "",
      notes: item.notes ?? "",
      isActive: "Yes",
    })))).catch((error) => notify({ type: "error", category: "travel", title: "Unable to load hotels", message: error?.response?.data?.message ?? "Please try again." }));
  }, [clearHotelSuppliers]);
  const hotels = databaseHotels;
  const destinationOptions = destinations.map((destination) => ({ value: destination.id, label: `${destination.name}${destination.city ? `, ${destination.city}` : ""}` }));
  return (
    <MasterDataManager
      title="Hotels" description="Manage hotel suppliers and their destinations." addLabel="Add Hotel"
      emptyTitle="No hotel suppliers yet" emptyDescription="Add a hotel to use it in bookings and itineraries."
      searchPlaceholder="Search hotels..." tableHeaders={["Name", "Destination", "Rating", "Status"]}
      fields={[
        { name: "name", label: "Hotel Name", placeholder: "Search hotel name...", required: true },
        { name: "destinationId", label: "Destination", type: "select", options: destinationOptions, required: true },
        { name: "rating", label: "Rating", type: "select", options: ["1","2","3","4","5"].map((value) => ({ value, label: `${value} Star` })) },
        { name: "notes", label: "Notes", placeholder: "Optional notes..." },
      ]}
      items={hotels}
      rowCells={(hotel) => [hotel.name, destinations.find((destination) => destination.id === hotel.destinationId)?.name ?? "—", hotel.rating ? `${hotel.rating} Star` : "—", hotel.isActive === "Yes" ? "Active" : "Inactive"]}
      searchText={(hotel) => `${hotel.name} ${destinations.find((destination) => destination.id === hotel.destinationId)?.name ?? ""}`}
      add={() => undefined}
      update={() => undefined}
      remove={(id) => { void apiDeleteHotel(id).then(() => setDatabaseHotels((current) => current.filter((hotel) => hotel.id !== id))).catch((error) => notify({ type: "error", category: "travel", title: "Unable to delete hotel", message: error?.response?.data?.message ?? "Please try again." })); }}
      hideFormDrawer
      onAddButton={() => { setEditing(null); setDrawerOpen(true); }}
      onEditButton={(item) => { setEditing(item); setDrawerOpen(true); }}
      customDrawer={({ close }) => (
        <HotelDrawer open={drawerOpen} initialValue={editing ?? undefined} destinations={destinationOptions} onOpenChange={(value) => { if (!value) { close(); setDrawerOpen(false); } }} onSave={(draft) => {
          const duplicate = hotels.some((hotel) => hotel.id !== editing?.id && hotel.name.trim().toLowerCase() === draft.name.trim().toLowerCase() && hotel.destinationId === draft.destinationId);
          if (duplicate) { notify({ type: "error", category: "travel", title: "Duplicate hotel", message: "This hotel already exists for the selected destination." }); return; }
          const data = { ...draft, category: "hotel" as const, contactPerson: "", phone: "", email: "", city: "", country: "", isActive: "Yes" };
          void (editing
            ? apiUpdateHotel(editing.id, { name: draft.name, destinationId: draft.destinationId, starRating: draft.rating, notes: draft.notes })
            : apiCreateHotel({ name: draft.name, destinationId: draft.destinationId, starRating: draft.rating, notes: draft.notes }))
            .then((saved) => {
              if (editing) setDatabaseHotels((current) => current.map((hotel) => hotel.id === editing.id ? { ...hotel, ...data } : hotel));
              else setDatabaseHotels((current) => [...current, { ...data, id: saved.id }]);
              setEditing(null); setDrawerOpen(false); close();
            })
            .catch((error) => notify({ type: "error", category: "travel", title: "Unable to save hotel", message: error?.response?.data?.message ?? "Please try again." }));
        }} />
      )}
    />
  );
}
