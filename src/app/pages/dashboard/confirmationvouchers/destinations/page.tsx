"use client";

import { MasterDataManager } from "@/components/cv/master-data-manager";
import { useEffect, useState } from "react";
import { DestinationDrawer, DestinationDraft } from "@/components/cv/destination-drawer";
import { apiCreateDestination, apiDeleteDestination, apiGetDestinations, apiUpdateDestination } from "@/lib/destinations-api";
import { toast } from "sonner";

type Destination = {
  id: string;
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

const makeId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `destination_${Date.now()}`;

export default function CvDestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingDestination, setEditingDestination] = useState<Destination | null>(null);

  useEffect(() => {
    void apiGetDestinations().then((items) => {
      setDestinations(items.map((item) => ({
        ...item,
        state: item.state,
        city: item.city,
        country: item.country,
      })));
    });
  }, []);

  return (
    <>
    <MasterDataManager
      title="Destinations"
      description="Manage the destinations used on confirmation vouchers."
      addLabel="Add Destination"
      emptyTitle="No destinations yet"
      emptyDescription="Add a destination to use it on confirmation vouchers."
      searchPlaceholder="Search destinations..."
      tableHeaders={["Destination", "Country"]}
      fields={[
        {
          name: "name",
          label: "Destination Name",
          placeholder: "e.g. Park Street",
          required: true,
        },
        {
          name: "country",
          label: "Country",
          placeholder: "e.g. India",
          required: true,
        },
      ]}
      rowCells={(destination) => [
        <span key="name" className="font-medium text-gray-800">
          {destination.name}
        </span>,
        destination.country,
      ]}
      items={destinations}
      searchText={(destination) => `${destination.name} ${destination.country}`}
      add={(data) =>
        setDestinations((current) => [...current, { ...data, id: makeId() }])
      }
      update={(id, data) =>
        setDestinations((current) =>
          current.map((destination) =>
            destination.id === id ? { ...destination, ...data } : destination,
          ),
        )
      }
      remove={(id) => {
        void apiDeleteDestination(id)
          .then(() => setDestinations((current) => current.filter((destination) => destination.id !== id)))
          .catch((error) => toast.error(error?.response?.data?.message ?? "Unable to delete destination."));
      }}
      onAddButton={() => {
        setEditingDestination(null);
        setDrawerOpen(true);
      }}
      onEditButton={(destination) => {
        setEditingDestination(destination);
        setDrawerOpen(true);
      }}
      hideFormDrawer
    />
    <DestinationDrawer
      open={drawerOpen}
      initialValue={editingDestination ?? undefined}
      title={editingDestination ? "Edit Destination" : "Add Destination"}
      onOpenChange={setDrawerOpen}
      onSave={async (draft: DestinationDraft, suggestion) => {
        const payload = {
          name: draft.name,
          originalName: draft.originalName ?? draft.name,
          state: draft.state,
          city: draft.city,
          country: draft.country,
          street: draft.street,
          countryCode: draft.countryCode,
          postalCode: draft.postalCode,
          latitude: draft.latitude ?? undefined,
          longitude: draft.longitude ?? undefined,
          displayName: draft.displayName ?? draft.name,
          source: draft.source ?? undefined,
          externalId: draft.externalId ?? undefined,
        };
        const saved = editingDestination
          ? await apiUpdateDestination(editingDestination.id, {
              ...payload,
              status: draft.status,
            })
          : await apiCreateDestination(payload);
        setDestinations((current) => current.some((item) => item.id === saved.id) ? current.map((item) => item.id === saved.id ? saved : item) : [...current, saved]);
        setEditingDestination(null);
      }}
      mode="admin"
    />
    </>
  );
}
