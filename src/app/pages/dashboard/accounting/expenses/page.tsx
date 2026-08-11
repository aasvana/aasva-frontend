"use client";

import { MasterDataManager } from "@/components/cv/master-data-manager";
import { useAccountingStore } from "@/stores/accountingStore";
import { statusBadge } from "../accounting-config";

const TYPE = "expense" as const;

const STATUS_OPTIONS = ["Pending", "Approved", "Reimbursed"];

const CATEGORY_OPTIONS = [
  "Travel",
  "Office Supplies",
  "Utilities",
  "Meals",
  "Software",
  "Other",
];

export default function ExpensesPage() {
  const entries = useAccountingStore((s) => s.entries);
  const addEntry = useAccountingStore((s) => s.addEntry);
  const updateEntry = useAccountingStore((s) => s.updateEntry);
  const deleteEntry = useAccountingStore((s) => s.deleteEntry);

  const items = entries.filter((e) => e.type === TYPE);

  return (
    <MasterDataManager
      title="Expenses"
      description="Track business expenses and keep them organized by category."
      addLabel="Add Expense"
      emptyTitle="No expenses yet"
      emptyDescription="Add your first expense to start tracking your spending."
      searchPlaceholder="Search expenses..."
      tableHeaders={["No", "Date", "Paid To", "Category", "Amount", "Status"]}
      fields={[
        {
          name: "no",
          label: "Expense No.",
          placeholder: "e.g. EXP-001",
          required: true,
        },
        { name: "date", label: "Date", type: "date", required: true },
        {
          name: "party",
          label: "Paid To",
          placeholder: "e.g. Uber",
          required: true,
        },
        {
          name: "category",
          label: "Category",
          type: "select",
          options: CATEGORY_OPTIONS.map((c) => ({ value: c, label: c })),
          required: true,
        },
        {
          name: "amount",
          label: "Amount",
          type: "number",
          placeholder: "e.g. 120",
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
        e.category,
        e.amount,
        statusBadge(e.status),
      ]}
      items={items}
      searchText={(e) => `${e.no} ${e.party} ${e.category} ${e.status}`}
      add={(data) => addEntry({ ...data, type: TYPE })}
      update={(id, data) => updateEntry(id, { ...data, type: TYPE })}
      remove={deleteEntry}
    />
  );
}
