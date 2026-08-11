"use client";

import { MasterDataManager } from "@/components/cv/master-data-manager";
import {
  BILL_STATUSES,
  BillStatus,
  useBillStore,
} from "@/stores/billStore";
import { statusBadge } from "../accounting-config";
import { useClientReady } from "@/hooks/useClientReady";

export default function BillsPage() {
  const bills = useBillStore((s) => s.bills);
  const addBill = useBillStore((s) => s.addBill);
  const updateBill = useBillStore((s) => s.updateBill);
  const deleteBill = useBillStore((s) => s.deleteBill);

  const ready = useClientReady();
  if (!ready) return null;

  return (
    <MasterDataManager
      title="Bills"
      description="Track vendor bills received for goods and services."
      addLabel="Add Bill"
      emptyTitle="No bills yet"
      emptyDescription="Add your first vendor bill to track what you owe."
      searchPlaceholder="Search bills..."
      tableHeaders={["No", "Vendor", "Date", "Due", "Amount", "Status"]}
      fields={[
        {
          name: "billNo",
          label: "Bill No.",
          placeholder: "e.g. BILL-1001",
          required: true,
        },
        {
          name: "vendor",
          label: "Vendor",
          placeholder: "e.g. Acme Supplies",
          required: true,
        },
        { name: "date", label: "Bill Date", type: "date", required: true },
        { name: "dueDate", label: "Due Date", type: "date", required: true },
        {
          name: "category",
          label: "Category",
          placeholder: "e.g. Office Supplies",
        },
        {
          name: "amount",
          label: "Amount",
          type: "number",
          placeholder: "e.g. 480",
          required: true,
        },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: BILL_STATUSES.map((s) => ({ value: s, label: s })),
          required: true,
        },
        {
          name: "notes",
          label: "Notes",
          placeholder: "Optional details...",
        },
      ]}
      rowCells={(e) => [
        <span key="no" className="font-medium text-gray-800">
          {e.billNo}
        </span>,
        e.vendor,
        e.date,
        e.dueDate,
        e.amount,
        statusBadge(e.status),
      ]}
      items={bills}
      searchText={(e) => `${e.billNo} ${e.vendor} ${e.category} ${e.status}`}
      add={(data) => addBill({ ...data, status: data.status as BillStatus })}
      update={(id, data) =>
        updateBill(id, { ...data, status: data.status as BillStatus })
      }
      remove={deleteBill}
    />
  );
}
