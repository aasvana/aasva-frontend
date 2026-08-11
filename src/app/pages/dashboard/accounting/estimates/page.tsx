"use client";

import { MasterDataManager } from "@/components/cv/master-data-manager";
import { useAccountingStore } from "@/stores/accountingStore";
import { statusBadge } from "../accounting-config";

const TYPE = "estimate" as const;

const STATUS_OPTIONS = ["Draft", "Sent", "Accepted", "Rejected", "Converted"];

export default function EstimatesPage() {
  const entries = useAccountingStore((s) => s.entries);
  const addEntry = useAccountingStore((s) => s.addEntry);
  const updateEntry = useAccountingStore((s) => s.updateEntry);
  const deleteEntry = useAccountingStore((s) => s.deleteEntry);

  const items = entries.filter((e) => e.type === TYPE);

  return (
    <MasterDataManager
      title="Estimates"
      description="Create and track estimates and quotations sent to customers."
      addLabel="Add Estimate"
      emptyTitle="No estimates yet"
      emptyDescription="Add your first estimate to start quoting your customers."
      searchPlaceholder="Search estimates..."
      tableHeaders={["No", "Date", "Customer", "Amount", "Status"]}
      fields={[
        {
          name: "no",
          label: "Estimate No.",
          placeholder: "e.g. EST-001",
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
          placeholder: "e.g. 1250",
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
          label: "Notes",
          placeholder: "Optional notes...",
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
