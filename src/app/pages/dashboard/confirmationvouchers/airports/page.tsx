"use client";

import { MasterDataManager } from "@/components/cv/master-data-manager";
import { useCvConfigStore } from "@/stores/cvConfigStore";

export default function CvAirportsPage() {
  const airports = useCvConfigStore((s) => s.airports);
  const addAirport = useCvConfigStore((s) => s.addAirport);
  const updateAirport = useCvConfigStore((s) => s.updateAirport);
  const deleteAirport = useCvConfigStore((s) => s.deleteAirport);

  return (
    <MasterDataManager
      title="Airports"
      description="Manage the airports available on your confirmation vouchers."
      addLabel="Add Airport"
      emptyTitle="No airports yet"
      emptyDescription="Add an airport to use it on your confirmation vouchers."
      searchPlaceholder="Search airports..."
      tableHeaders={["Code", "Airport", "City", "Country"]}
      fields={[
        {
          name: "code",
          label: "Airport Code",
          placeholder: "e.g. DEL",
          required: true,
        },
        {
          name: "name",
          label: "Airport Name",
          placeholder: "e.g. Indira Gandhi International Airport",
          required: true,
        },
        {
          name: "city",
          label: "City",
          placeholder: "e.g. New Delhi",
          required: true,
        },
        {
          name: "country",
          label: "Country",
          placeholder: "e.g. India",
        },
      ]}
      rowCells={(a) => [
        <span key="code" className="font-medium text-gray-800">{a.code}</span>,
        a.name,
        a.city,
        a.country || "—",
      ]}
      items={airports}
      searchText={(a) => `${a.code} ${a.name} ${a.city} ${a.country}`}
      add={addAirport}
      update={updateAirport}
      remove={deleteAirport}
    />
  );
}
