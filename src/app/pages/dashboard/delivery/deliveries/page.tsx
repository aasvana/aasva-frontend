"use client";

import { useMemo } from "react";
import { MasterDataManager } from "@/components/cv/master-data-manager";
import {
  DELIVERY_STATUSES,
  Delivery,
  useDeliveryStore,
} from "@/stores/deliveryStore";
import {
  deliveryStatusPill,
  logDeliveryAction,
} from "@/components/delivery/delivery-ui";
import { useClientReady } from "@/hooks/useClientReady";

export default function DeliveriesPage() {
  const deliveries = useDeliveryStore((s) => s.deliveries);
  const zones = useDeliveryStore((s) => s.zones);
  const partners = useDeliveryStore((s) => s.partners);
  const addDelivery = useDeliveryStore((s) => s.addDelivery);
  const updateDelivery = useDeliveryStore((s) => s.updateDelivery);
  const deleteDelivery = useDeliveryStore((s) => s.deleteDelivery);

  const zoneOptions = useMemo(
    () => zones.filter((z) => z.isActive === "Yes").map((z) => ({ value: z.name, label: z.name })),
    [zones]
  );
  const partnerOptions = useMemo(
    () =>
      partners
        .filter((p) => p.isActive === "Yes")
        .map((p) => ({ value: p.name, label: p.name })),
    [partners]
  );
  const statusOptions = DELIVERY_STATUSES.map((s) => ({ value: s, label: s }));

  const ready = useClientReady();
  if (!ready) return null;

  const handleAdd = (data: Omit<Delivery, "id">) => {
    addDelivery(data as Omit<Delivery, "id" | "createdAt">);
    logDeliveryAction(
      "created",
      "Delivery",
      data.deliveryNo,
      `Delivery ${data.deliveryNo} created for ${data.customerName}.`
    );
  };

  const handleUpdate = (id: string, data: Omit<Delivery, "id">) => {
    updateDelivery(id, data as Omit<Delivery, "id" | "createdAt">);
    logDeliveryAction(
      "updated",
      "Delivery",
      data.deliveryNo,
      `Delivery ${data.deliveryNo} updated.`
    );
  };

  const handleDelete = (id: string) => {
    const delivery = deliveries.find((d) => d.id === id);
    deleteDelivery(id);
    if (delivery) {
      logDeliveryAction(
        "deleted",
        "Delivery",
        delivery.deliveryNo,
        `Delivery ${delivery.deliveryNo} deleted.`
      );
    }
  };

  return (
    <MasterDataManager
      title="Deliveries"
      description="Track and manage all customer deliveries."
      addLabel="Add Delivery"
      emptyTitle="No deliveries yet"
      emptyDescription="Add a delivery to start tracking it."
      searchPlaceholder="Search deliveries…"
      tableHeaders={[
        "Delivery No",
        "Customer",
        "Zone",
        "Partner",
        "Items",
        "Charge",
        "Scheduled",
        "Status",
      ]}
      fields={[
        { name: "deliveryNo", label: "Delivery No", required: true },
        { name: "customerName", label: "Customer Name", required: true },
        { name: "customerPhone", label: "Customer Phone" },
        { name: "address", label: "Address" },
        { name: "pincode", label: "Pincode" },
        {
          name: "zoneName",
          label: "Zone",
          type: "select",
          options: zoneOptions,
        },
        {
          name: "partnerName",
          label: "Delivery Partner",
          type: "select",
          options: partnerOptions,
        },
        { name: "orderRef", label: "Order Ref" },
        { name: "items", label: "Items" },
        { name: "weight", label: "Weight (kg)", type: "number" },
        { name: "charge", label: "Charge", type: "number" },
        {
          name: "cod",
          label: "COD",
          type: "select",
          options: [
            { value: "No", label: "No" },
            { value: "Yes", label: "Yes" },
          ],
        },
        { name: "scheduledDate", label: "Scheduled Date", type: "date" },
        { name: "status", label: "Status", type: "select", options: statusOptions },
        { name: "notes", label: "Notes" },
      ]}
      rowCells={(d) => [
        <span key="no" className="font-medium text-gray-800">{d.deliveryNo}</span>,
        <div key="cust">
          <span className="text-gray-800">{d.customerName}</span>
          <span className="block text-xs text-gray-400">{d.customerPhone}</span>
        </div>,
        <span key="zone">{d.zoneName || "—"}</span>,
        <span key="ptn">{d.partnerName || "—"}</span>,
        <span key="items" className="max-w-40 truncate">{d.items}</span>,
        <span key="chg">{d.cod === "Yes" ? "COD · " : ""}${d.charge}</span>,
        <span key="date" className="text-gray-500">{d.scheduledDate}</span>,
        deliveryStatusPill(d.status),
      ]}
      items={deliveries}
      searchText={(d) =>
        `${d.deliveryNo} ${d.customerName} ${d.address} ${d.pincode} ${d.zoneName} ${d.partnerName} ${d.orderRef} ${d.status}`
      }
      add={handleAdd}
      update={handleUpdate}
      remove={handleDelete}
    />
  );
}
