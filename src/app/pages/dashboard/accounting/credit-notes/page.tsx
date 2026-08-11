"use client";

import { MasterDataManager } from "@/components/cv/master-data-manager";
import { useAccountingStore } from "@/stores/accountingStore";
import { statusBadge } from "../accounting-config";

const TYPE = "credit-note" as const;

const STATUS_OPTIONS = ["Draft", "Issued", "Applied"];

export default function CreditNotesPage() {
  const entries = useAccountingStore((s) => s.entries);
  const addEntry = useAccountingStore((s) => s.addEntry);
  const updateEntry = useAccountingStore((s) => s.updateEntry);
  const deleteEntry = useAccountingStore((s) => s.deleteEntry);

  const items = entries.filter((e) => e.type === TYPE);

  return (
    <MasterDataManager
      title="Credit Notes"
      description="Issue credit notes to customers for returns or adjustments."
      addLabel="Add Credit Note"
      emptyTitle="No credit notes yet"
      emptyDescription="Add your first credit note to record customer returns."
      searchPlaceholder="Search credit notes..."
      tableHeaders={["No", "Date", "Customer", "Amount", "Status"]}
      fields={[
        {
          name: "no",
          label: "Credit Note No.",
          placeholder: "e.g. CN-001",
          required: true,
        },
        { name: "date", label: "Date", type: "date", required: true },
        {
          name: "party",
          label: "Customer",
          placeholder: "e.g. Acme Corp",
          required: true,
        },
        {
          name: "amount",
          label: "Amount",
          type: "number",
          placeholder: "e.g. 250",
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
          placeholder: "e.g. Damaged goods return",
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
