"use client";

import { CustomerCollectionManager } from "@/components/customer/customer-ui";
import { statusPill } from "@/components/customer/customer-ui";
import { useCustomerProfileStore } from "@/stores/customerProfileStore";
import { useClientReady } from "@/hooks/useClientReady";

export default function CustomerBookingsPage() {
  const add = useCustomerProfileStore((s) => s.addBooking);
  const update = useCustomerProfileStore((s) => s.updateBooking);
  const remove = useCustomerProfileStore((s) => s.deleteBooking);
  const ready = useClientReady();
  if (!ready) return null;

  return (
    <CustomerCollectionManager
      title="Bookings"
      description="Travel bookings for this customer."
      addLabel="Add Booking"
      emptyTitle="No bookings"
      emptyDescription="Add a booking to get started."
      searchPlaceholder="Search bookings…"
      tableHeaders={["Reference", "Service", "Supplier", "Dates", "Pax", "Amount", "Status"]}
      getItems={(p) => p.travel.bookings}
      searchText={(b) => `${b.reference} ${b.service} ${b.supplierName}`}
      add={add}
      update={update}
      remove={remove}
      fields={[
        { name: "reference", label: "Reference", required: true },
        { name: "service", label: "Service", required: true },
        { name: "supplierName", label: "Supplier" },
        { name: "startDate", label: "Start Date", type: "date" },
        { name: "endDate", label: "End Date", type: "date" },
        { name: "pax", label: "Pax", type: "number" },
        { name: "amount", label: "Amount", type: "number" },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: [
            { value: "Confirmed", label: "Confirmed" },
            { value: "Pending", label: "Pending" },
            { value: "Completed", label: "Completed" },
            { value: "Cancelled", label: "Cancelled" },
          ],
        },
        { name: "notes", label: "Notes" },
      ]}
      rowCells={(b) => [
        <span key="ref" className="font-medium text-gray-800">{b.reference}</span>,
        <span key="svc">{b.service}</span>,
        <span key="sup">{b.supplierName}</span>,
        <span key="dates" className="text-gray-500">
          {b.startDate} → {b.endDate}
        </span>,
        <span key="pax">{b.pax}</span>,
        <span key="amt">{b.amount}</span>,
        statusPill(b.status),
      ]}
    />
  );
}
