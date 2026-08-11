"use client";

import { MasterDataManager } from "@/components/cv/master-data-manager";
import { useAccountingStore } from "@/stores/accountingStore";
import { statusBadge } from "../accounting-config";

const TYPE = "debit-note" as const;

const STATUS_OPTIONS = ["Draft", "Issued", "Paid"];

export default function DebitNotesPage() {
  const entries = useAccountingStore((s) => s.entries);
  const addEntry = useAccountingStore((s) => s.addEntry);
  const updateEntry = useAccountingStore((s) => s.updateEntry);
  const deleteEntry = useAccountingStore((s) => s.deleteEntry);

  const items = entries.filter((e) => e.type === TYPE);

  return (
    <MasterDataManager
      title="Debit Notes"
      description="Raise debit notes against vendors for shortages or corrections."
      addLabel="Add Debit Note"
      emptyTitle="No debit notes yet"
      emptyDescription="Add your first debit note to record vendor adjustments."
      searchPlaceholder="Search debit notes..."
      tableHeaders={["No", "Date", "Vendor", "Amount", "Status"]}
      fields={[
        {
          name: "no",
          label: "Debit Note No.",
          placeholder: "e.g. DN-001",
          required: true,
        },
        { name: "date", label: "Date", type: "date", required: true },
        {
          name: "party",
          label: "Vendor",
          placeholder: "e.g. Globe Traders",
          required: true,
        },
        {
          name: "amount",
          label: "Amount",
          type: "number",
          placeholder: "e.g. 450",
          required: true,
        },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: STATUS_OPTIONS.map((s) => ({ value: s, label: s })),
          required: true,
        },
        {
          name: "notes",
          label: "Reason / Notes",
          placeholder: "e.g. Short delivery",
        },
      ]}
      rowCells={(e) => [
        <span key="no" className="font-medium text-gray-800">
          {e.no}
        </span>,
        e.date,
        e.party,
        e.amount,
        statusBadge(e.status),
      ]}
      items={items}
      searchText={(e) => `${e.no} ${e.party} ${e.status}`}
      add={(data) => addEntry({ ...data, type: TYPE })}
      update={(id, data) => updateEntry(id, { ...data, type: TYPE })}
      remove={deleteEntry}
    />
  );
}
