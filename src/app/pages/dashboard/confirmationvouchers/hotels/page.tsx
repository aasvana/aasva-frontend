"use client";

import { MasterDataManager } from "@/components/cv/master-data-manager";
import { useCvConfigStore } from "@/stores/cvConfigStore";

const RATING_OPTIONS = ["1", "2", "3", "4", "5"].map((rating) => ({
  value: rating,
  label: `${rating} Star`,
}));

export default function CvHotelsPage() {
  const hotels = useCvConfigStore((s) => s.hotels);
  const addHotel = useCvConfigStore((s) => s.addHotel);
  const updateHotel = useCvConfigStore((s) => s.updateHotel);
  const deleteHotel = useCvConfigStore((s) => s.deleteHotel);

  return (
    <MasterDataManager
      title="Hotels"
      description="Manage the hotels used on your confirmation vouchers."
      addLabel="Add Hotel"
      emptyTitle="No hotels yet"
      emptyDescription="Add a hotel to use it on your confirmation vouchers."
      searchPlaceholder="Search hotels..."
      tableHeaders={["Name", "Destination", "Rating"]}
      fields={[
        {
          name: "name",
          label: "Hotel Name",
          placeholder: "e.g. Taj Mahal Palace",
          required: true,
        },
        {
          name: "destination",
          label: "Destination",
          placeholder: "e.g. Mumbai",
          required: true,
        },
        {
          name: "rating",
          label: "Star Rating",
          type: "select",
          options: RATING_OPTIONS,
        },
      ]}
      rowCells={(h) => [
        <span key="name" className="font-medium text-gray-800">{h.name}</span>,
        h.destination,
        h.rating ? `${h.rating} Star` : "—",
      ]}
      items={hotels}
      searchText={(h) => `${h.name} ${h.destination}`}
      add={addHotel}
      update={updateHotel}
      remove={deleteHotel}
    />
  );
}
