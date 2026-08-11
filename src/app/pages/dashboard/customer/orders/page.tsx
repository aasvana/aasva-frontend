"use client";

import { CustomerCollectionManager, statusPill } from "@/components/customer/customer-ui";
import { useCustomerProfileStore } from "@/stores/customerProfileStore";
import { useClientReady } from "@/hooks/useClientReady";

export default function CustomerOrdersPage() {
  const add = useCustomerProfileStore((s) => s.addOrder);
  const update = useCustomerProfileStore((s) => s.updateOrder);
  const remove = useCustomerProfileStore((s) => s.deleteOrder);
  const ready = useClientReady();
  if (!ready) return null;

  return (
    <CustomerCollectionManager
      title="Orders"
      description="Orders placed by this customer."
      addLabel="Add Order"
      emptyTitle="No orders"
      emptyDescription="Add an order to get started."
      searchPlaceholder="Search orders…"
      tableHeaders={["Order No", "Date", "Status", "Amount", "Notes"]}
      getItems={(p) => p.sales.orders}
      searchText={(o) => `${o.orderNo} ${o.status}`}
      add={add}
      update={update}
      remove={remove}
      fields={[
        { name: "orderNo", label: "Order No", required: true },
        { name: "date", label: "Date", type: "date" },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: [
            { value: "Delivered", label: "Delivered" },
            { value: "Processing", label: "Processing" },
            { value: "Pending", label: "Pending" },
            { value: "Completed", label: "Completed" },
            { value: "Cancelled", label: "Cancelled" },
          ],
        },
        { name: "amount", label: "Amount", type: "number" },
        { name: "notes", label: "Notes" },
      ]}
      rowCells={(o) => [
        <span key="no" className="font-medium text-gray-800">{o.orderNo}</span>,
        <span key="date" className="text-gray-500">{o.date}</span>,
        statusPill(o.status),
        <span key="amt">{o.amount}</span>,
        <span key="notes" className="text-gray-500">{o.notes || "—"}</span>,
      ]}
    />
  );
}
