"use client";

import { MasterDataManager } from "@/components/cv/master-data-manager";
import {
  GENERAL_DETAIL_KEYS,
  useCvConfigStore,
} from "@/stores/cvConfigStore";
import { useTravelSettings } from "@/lib/travel-settings-query";
import { toast } from "sonner";

const KEY_OPTIONS = GENERAL_DETAIL_KEYS.map((k) => ({
  value: k.key,
  label: k.label,
}));

export default function CvGeneralDetailsPage() {
  const generalDetails = useCvConfigStore((s) => s.generalDetails);
  const addGeneralDetail = useCvConfigStore((s) => s.addGeneralDetail);
  const updateGeneralDetail = useCvConfigStore((s) => s.updateGeneralDetail);
  const deleteGeneralDetail = useCvConfigStore((s) => s.deleteGeneralDetail);
  const { updateMutation } = useTravelSettings();

  return (
    <MasterDataManager
      title="General Details"
      description="Manage the default general details used on confirmation vouchers."
      addLabel="Add Detail"
      emptyTitle="No general details yet"
      emptyDescription="Add a general detail to prefill on your confirmation vouchers."
      searchPlaceholder="Search general details..."
      tableHeaders={["Key", "Label", "Value"]}
      fields={[
        {
          name: "key",
          label: "Field",
          type: "select",
          options: KEY_OPTIONS,
          required: true,
        },
        {
          name: "label",
          label: "Label",
          placeholder: "e.g. Check-in Time",
          required: true,
        },
        {
          name: "value",
          label: "Default Value",
          placeholder: "e.g. 14:00",
          type: "text",
          required: true,
        },
      ]}
      rowCells={(g) => [
        <span key="key" className="font-medium text-gray-800">{g.key}</span>,
        g.label,
        g.value,
      ]}
      items={generalDetails}
      searchText={(g) => `${g.key} ${g.label} ${g.value}`}
       add={(data) => updateMutation.mutate({ generalDetails: [...generalDetails, { id: crypto.randomUUID(), ...data }] }, { onError: (error) => toast.error(error.message) })}
       update={(id, data) => updateMutation.mutate({ generalDetails: generalDetails.map((item) => item.id === id ? { id, ...data } : item) }, { onError: (error) => toast.error(error.message) })}
       remove={(id) => updateMutation.mutate({ generalDetails: generalDetails.filter((item) => item.id !== id) }, { onError: (error) => toast.error(error.message) })}
    />
  );
}
