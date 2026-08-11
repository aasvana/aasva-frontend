"use client";

import { CustomerCollectionManager, statusPill } from "@/components/customer/customer-ui";
import { useCustomerProfileStore } from "@/stores/customerProfileStore";
import { useClientReady } from "@/hooks/useClientReady";

export default function CustomerPaymentsPage() {
  const add = useCustomerProfileStore((s) => s.addPayment);
  const update = useCustomerProfileStore((s) => s.updatePayment);
  const remove = useCustomerProfileStore((s) => s.deletePayment);
  const ready = useClientReady();
  if (!ready) return null;

  return (
    <CustomerCollectionManager
      title="Payments"
      description="Payments received from this customer."
      addLabel="Add Payment"
      emptyTitle="No payments"
      emptyDescription="Add a payment to get started."
      searchPlaceholder="Search payments…"
      tableHeaders={["Payment No", "Date", "Amount", "Mode", "Status", "Reference"]}
      getItems={(p) => p.sales.payments}
      searchText={(p) => `${p.paymentNo} ${p.mode} ${p.reference}`}
      add={add}
      update={update}
      remove={remove}
      fields={[
        { name: "paymentNo", label: "Payment No", required: true },
        { name: "date", label: "Date", type: "date" },
        { name: "amount", label: "Amount", type: "number" },
        {
          name: "mode",
          label: "Mode",
          type: "select",
          options: [
            { value: "bank_transfer", label: "Bank Transfer" },
            { value: "card", label: "Card" },
            { value: "cash", label: "Cash" },
            { value: "upi", label: "UPI" },
            { value: "cheque", label: "Cheque" },
          ],
        },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: [
            { value: "Paid", label: "Paid" },
            { value: "Pending", label: "Pending" },
            { value: "Failed", label: "Failed" },
          ],
        },
        { name: "reference", label: "Reference" },
      ]}
      rowCells={(p) => [
        <span key="no" className="font-medium text-gray-800">{p.paymentNo}</span>,
        <span key="date" className="text-gray-500">{p.date}</span>,
        <span key="amt">{p.amount}</span>,
        <span key="mode" className="capitalize">{p.mode.replace("_", " ")}</span>,
        statusPill(p.status),
        <span key="ref" className="text-gray-500">{p.reference}</span>,
      ]}
    />
  );
}
