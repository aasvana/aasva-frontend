"use client";

import { CustomerCollectionManager, statusPill } from "@/components/customer/customer-ui";
import { useCustomerProfileStore } from "@/stores/customerProfileStore";
import { useClientReady } from "@/hooks/useClientReady";

export default function CustomerRefundsPage() {
  const add = useCustomerProfileStore((s) => s.addRefund);
  const remove = useCustomerProfileStore((s) => s.deleteRefund);
  const ready = useClientReady();
  if (!ready) return null;

  return (
    <CustomerCollectionManager
      title="Refunds"
      description="Refunds issued to this customer."
      addLabel="Add Refund"
      emptyTitle="No refunds"
      emptyDescription="Add a refund to get started."
      searchPlaceholder="Search refunds…"
      tableHeaders={["Refund No", "Date", "Amount", "Status", "Reason"]}
      getItems={(p) => p.sales.refunds}
      searchText={(r) => `${r.refundNo} ${r.reason} ${r.status}`}
      add={add}
      remove={remove}
      fields={[
        { name: "refundNo", label: "Refund No", required: true },
        { name: "date", label: "Date", type: "date" },
        { name: "amount", label: "Amount", type: "number" },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: [
            { value: "Approved", label: "Approved" },
            { value: "Processed", label: "Processed" },
            { value: "Pending", label: "Pending" },
          ],
        },
        { name: "reason", label: "Reason" },
      ]}
      rowCells={(r) => [
        <span key="no" className="font-medium text-gray-800">{r.refundNo}</span>,
        <span key="date" className="text-gray-500">{r.date}</span>,
        <span key="amt">{r.amount}</span>,
        statusPill(r.status),
        <span key="reason" className="text-gray-500">{r.reason}</span>,
      ]}
    />
  );
}
