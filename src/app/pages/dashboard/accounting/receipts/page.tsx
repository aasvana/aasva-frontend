"use client";

import { MasterDataManager } from "@/components/cv/master-data-manager";
import { useAccountingStore } from "@/stores/accountingStore";
import { statusBadge } from "../accounting-config";

const TYPE = "receipt" as const;

const STATUS_OPTIONS = ["Pending", "Received"];

export default function ReceiptsPage() {
  const entries = useAccountingStore((s) => s.entries);
  const addEntry = useAccountingStore((s) => s.addEntry);
  const updateEntry = useAccountingStore((s) => s.updateEntry);
  const deleteEntry = useAccountingStore((s) => s.deleteEntry);

  const items = entries.filter((e) => e.type === TYPE);

  return (
    <MasterDataManager
      title="Receipts"
      description="Record money received from customers against invoices or orders."
      addLabel="Add Receipt"
      emptyTitle="No receipts yet"
      emptyDescription="Add your first receipt to record customer payments."
      searchPlaceholder="Search receipts..."
      tableHeaders={["No", "Date", "Received From", "Amount", "Status"]}
      fields={[
        {
          name: "no",
          label: "Receipt No.",
          placeholder: "e.g. RCPT-001",
          required: true,
        },
        { name: "date", label: "Date", type: "date", required: true },
        {
          name: "party",
          label: "Received From",
          placeholder: "e.g. Acme Corp",
          required: true,
        },
        {
          name: "amount",
          label: "Amount",
          type: "number",
          placeholder: "e.g. 1000",
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
          placeholder: "e.g. Invoice INV-001",
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
