"use client";

import { CustomerCollectionManager, statusPill } from "@/components/customer/customer-ui";
import { useCustomerProfileStore } from "@/stores/customerProfileStore";
import { useClientReady } from "@/hooks/useClientReady";

export default function CustomerCreditNotesPage() {
  const add = useCustomerProfileStore((s) => s.addCreditNote);
  const remove = useCustomerProfileStore((s) => s.deleteCreditNote);
  const ready = useClientReady();
  if (!ready) return null;

  return (
    <CustomerCollectionManager
      title="Credit Notes"
      description="Credit notes issued to this customer."
      addLabel="Add Credit Note"
      emptyTitle="No credit notes"
      emptyDescription="Add a credit note to get started."
      searchPlaceholder="Search credit notes…"
      tableHeaders={["Credit Note No", "Date", "Amount", "Status", "Reason"]}
      getItems={(p) => p.sales.creditNotes}
      searchText={(c) => `${c.creditNoteNo} ${c.reason} ${c.status}`}
      add={add}
      remove={remove}
      fields={[
        { name: "creditNoteNo", label: "Credit Note No", required: true },
        { name: "date", label: "Date", type: "date" },
        { name: "amount", label: "Amount", type: "number" },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: [
            { value: "Applied", label: "Applied" },
            { value: "Issued", label: "Issued" },
            { value: "Pending", label: "Pending" },
          ],
        },
        { name: "reason", label: "Reason" },
      ]}
      rowCells={(c) => [
        <span key="no" className="font-medium text-gray-800">{c.creditNoteNo}</span>,
        <span key="date" className="text-gray-500">{c.date}</span>,
        <span key="amt">{c.amount}</span>,
        statusPill(c.status),
        <span key="reason" className="text-gray-500">{c.reason}</span>,
      ]}
    />
  );
}
