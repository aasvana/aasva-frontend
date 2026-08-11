"use client";

import { MasterDataManager } from "@/components/cv/master-data-manager";
import { useCvConfigStore } from "@/stores/cvConfigStore";

export default function CvAirlinesPage() {
  const airlines = useCvConfigStore((s) => s.airlines);
  const addAirline = useCvConfigStore((s) => s.addAirline);
  const updateAirline = useCvConfigStore((s) => s.updateAirline);
  const deleteAirline = useCvConfigStore((s) => s.deleteAirline);

  return (
    <MasterDataManager
      title="Airlines"
      description="Manage the airlines available on your confirmation vouchers."
      addLabel="Add Airline"
      emptyTitle="No airlines yet"
      emptyDescription="Add an airline to use it on your confirmation vouchers."
      searchPlaceholder="Search airlines..."
      tableHeaders={["Code", "Name"]}
      fields={[
        {
          name: "code",
          label: "Airline Code",
          placeholder: "e.g. 6E",
          required: true,
        },
        {
          name: "name",
          label: "Airline Name",
          placeholder: "e.g. IndiGo",
          required: true,
        },
      ]}
      rowCells={(a) => [
        <span key="code" className="font-medium text-gray-800">{a.code}</span>,
        a.name,
      ]}
      items={airlines}
      searchText={(a) => `${a.code} ${a.name}`}
      add={addAirline}
      update={updateAirline}
      remove={deleteAirline}
    />
  );
}
