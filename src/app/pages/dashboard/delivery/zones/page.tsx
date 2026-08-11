"use client";

import { MasterDataManager } from "@/components/cv/master-data-manager";
import { DeliveryZone, useDeliveryStore } from "@/stores/deliveryStore";
import { logDeliveryAction } from "@/components/delivery/delivery-ui";
import { useClientReady } from "@/hooks/useClientReady";

const STATUS_OPTIONS = [
  { value: "Yes", label: "Active" },
  { value: "No", label: "Inactive" },
];

export default function DeliveryZonesPage() {
  const zones = useDeliveryStore((s) => s.zones);
  const addZone = useDeliveryStore((s) => s.addZone);
  const updateZone = useDeliveryStore((s) => s.updateZone);
  const deleteZone = useDeliveryStore((s) => s.deleteZone);

  const ready = useClientReady();
  if (!ready) return null;

  const handleAdd = (data: Omit<DeliveryZone, "id">) => {
    addZone(data as Omit<DeliveryZone, "id" | "createdAt">);
    logDeliveryAction("created", "Zone", data.name, `Delivery zone ${data.name} created.`);
  };

  const handleUpdate = (id: string, data: Omit<DeliveryZone, "id">) => {
    updateZone(id, data as Omit<DeliveryZone, "id" | "createdAt">);
    logDeliveryAction("updated", "Zone", data.name, `Delivery zone ${data.name} updated.`);
  };

  const handleDelete = (id: string) => {
    const zone = zones.find((z) => z.id === id);
    deleteZone(id);
    if (zone) {
      logDeliveryAction("deleted", "Zone", zone.name, `Delivery zone ${zone.name} deleted.`);
    }
  };

  return (
    <MasterDataManager
      title="Delivery Zones"
      description="Group pincodes into zones for routing and pricing."
      addLabel="Add Zone"
      emptyTitle="No zones yet"
      emptyDescription="Add a delivery zone to route orders."
      searchPlaceholder="Search zones…"
      tableHeaders={["Zone", "Region", "Pincodes", "Delivery Time", "Base Charge", "Per KM", "Status"]}
      fields={[
        { name: "name", label: "Zone Name", required: true },
        { name: "region", label: "Region" },
        { name: "pincodes", label: "Pincodes (comma separated)" },
        { name: "deliveryTime", label: "Delivery Time (e.g. 1-2 days)" },
        { name: "baseCharge", label: "Base Charge", type: "number" },
        { name: "perKmCharge", label: "Per KM Charge", type: "number" },
        { name: "isActive", label: "Status", type: "select", options: STATUS_OPTIONS },
      ]}
      rowCells={(z) => [
        <span key="name" className="font-medium text-gray-800">{z.name}</span>,
        <span key="region">{z.region || "—"}</span>,
        <span key="pin" className="max-w-44 truncate text-gray-500">{z.pincodes}</span>,
        <span key="time">{z.deliveryTime || "—"}</span>,
        <span key="base">${z.baseCharge}</span>,
        <span key="km">${z.perKmCharge}</span>,
        <span
          key="status"
          className={
            z.isActive === "Yes"
              ? "inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700"
              : "inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-500"
          }
        >
          {z.isActive === "Yes" ? "Active" : "Inactive"}
        </span>,
      ]}
      items={zones}
      searchText={(z) => `${z.name} ${z.region} ${z.pincodes} ${z.deliveryTime}`}
      add={handleAdd}
      update={handleUpdate}
      remove={handleDelete}
    />
  );
}
