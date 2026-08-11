"use client";

import { CustomerCollectionManager, statusPill } from "@/components/customer/customer-ui";
import { useCustomerProfileStore } from "@/stores/customerProfileStore";
import { useClientReady } from "@/hooks/useClientReady";

export default function CustomerInvoicesPage() {
  const add = useCustomerProfileStore((s) => s.addInvoice);
  const update = useCustomerProfileStore((s) => s.updateInvoice);
  const remove = useCustomerProfileStore((s) => s.deleteInvoice);
  const ready = useClientReady();
  if (!ready) return null;

  return (
    <CustomerCollectionManager
      title="Invoices"
      description="Invoices issued to this customer."
      addLabel="Add Invoice"
      emptyTitle="No invoices"
      emptyDescription="Add an invoice to get started."
      searchPlaceholder="Search invoices…"
      tableHeaders={["Invoice No", "Date", "Currency", "Amount", "Status", "Balance"]}
      getItems={(p) => p.sales.invoices}
      searchText={(i) => `${i.invoiceNo} ${i.status}`}
      add={add}
      update={update}
      remove={remove}
      fields={[
        { name: "invoiceNo", label: "Invoice No", required: true },
        { name: "date", label: "Date", type: "date" },
        {
          name: "currency",
          label: "Currency",
          type: "select",
          options: [
            { value: "USD", label: "USD" },
            { value: "EUR", label: "EUR" },
            { value: "INR", label: "INR" },
            { value: "GBP", label: "GBP" },
            { value: "JPY", label: "JPY" },
            { value: "SGD", label: "SGD" },
            { value: "AED", label: "AED" },
          ],
        },
        { name: "amount", label: "Amount", type: "number" },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: [
            { value: "paid", label: "Paid" },
            { value: "partially_paid", label: "Partially Paid" },
            { value: "unpaid", label: "Unpaid" },
            { value: "overdue", label: "Overdue" },
            { value: "cancelled", label: "Cancelled" },
          ],
        },
        { name: "balance", label: "Balance", type: "number" },
      ]}
      rowCells={(i) => [
        <span key="no" className="font-medium text-gray-800">{i.invoiceNo}</span>,
        <span key="date" className="text-gray-500">{i.date}</span>,
        <span key="cur">{i.currency}</span>,
        <span key="amt">{i.amount}</span>,
        statusPill(i.status),
        <span key="bal">{i.balance}</span>,
      ]}
    />
  );
}
