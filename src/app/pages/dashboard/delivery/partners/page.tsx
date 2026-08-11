"use client";

import { MasterDataManager } from "@/components/cv/master-data-manager";
import {
  DeliveryPartner,
  useDeliveryStore,
} from "@/stores/deliveryStore";
import { logDeliveryAction } from "@/components/delivery/delivery-ui";
import { useClientReady } from "@/hooks/useClientReady";

const VEHICLE_OPTIONS = ["Van", "Truck", "Motorbike", "Bicycle"].map((v) => ({
  value: v,
  label: v,
}));

const STATUS_OPTIONS = [
  { value: "Yes", label: "Active" },
  { value: "No", label: "Inactive" },
];

export default function DeliveryPartnersPage() {
  const partners = useDeliveryStore((s) => s.partners);
  const addPartner = useDeliveryStore((s) => s.addPartner);
  const updatePartner = useDeliveryStore((s) => s.updatePartner);
  const deletePartner = useDeliveryStore((s) => s.deletePartner);

  const ready = useClientReady();
  if (!ready) return null;

  const handleAdd = (data: Omit<DeliveryPartner, "id">) => {
    addPartner(data as Omit<DeliveryPartner, "id" | "createdAt">);
    logDeliveryAction("created", "Partner", data.name, `Delivery partner ${data.name} added.`);
  };

  const handleUpdate = (id: string, data: Omit<DeliveryPartner, "id">) => {
    updatePartner(id, data as Omit<DeliveryPartner, "id" | "createdAt">);
    logDeliveryAction("updated", "Partner", data.name, `Delivery partner ${data.name} updated.`);
  };

  const handleDelete = (id: string) => {
    const partner = partners.find((p) => p.id === id);
    deletePartner(id);
    if (partner) {
      logDeliveryAction("deleted", "Partner", partner.name, `Delivery partner ${partner.name} deleted.`);
    }
  };

  return (
    <MasterDataManager
      title="Delivery Partners"
      description="Manage the partners who fulfil your deliveries."
      addLabel="Add Partner"
      emptyTitle="No partners yet"
      emptyDescription="Add a delivery partner to assign dispatches."
      searchPlaceholder="Search partners…"
      tableHeaders={["Name", "Contact", "Vehicle", "Service Zones", "Commission", "Rating", "Status"]}
      fields={[
        { name: "name", label: "Partner Name", required: true },
        { name: "contactPerson", label: "Contact Person" },
        { name: "phone", label: "Phone" },
        { name: "email", label: "Email" },
        { name: "vehicleType", label: "Vehicle Type", type: "select", options: VEHICLE_OPTIONS },
        { name: "vehicleReg", label: "Vehicle Reg No." },
        { name: "serviceZones", label: "Service Zones" },
        { name: "commission", label: "Commission (%)", type: "number" },
        { name: "rating", label: "Rating (1-5)", type: "number" },
        { name: "isActive", label: "Status", type: "select", options: STATUS_OPTIONS },
        { name: "notes", label: "Notes" },
      ]}
      rowCells={(p) => [
        <span key="name" className="font-medium text-gray-800">{p.name}</span>,
        <div key="contact">
          <span className="text-gray-800">{p.contactPerson || "—"}</span>
          <span className="block text-xs text-gray-400">{p.phone}</span>
        </div>,
        <span key="veh">{p.vehicleType}{p.vehicleReg && p.vehicleReg !== "—" ? ` · ${p.vehicleReg}` : ""}</span>,
        <span key="zones">{p.serviceZones || "—"}</span>,
        <span key="com">{p.commission}%</span>,
        <span key="rate">{p.rating}</span>,
        <span
          key="status"
          className={
            p.isActive === "Yes"
              ? "inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700"
              : "inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-500"
          }
        >
          {p.isActive === "Yes" ? "Active" : "Inactive"}
        </span>,
      ]}
      items={partners}
      searchText={(p) =>
        `${p.name} ${p.contactPerson} ${p.phone} ${p.email} ${p.vehicleType} ${p.serviceZones}`
      }
      add={handleAdd}
      update={handleUpdate}
      remove={handleDelete}
    />
  );
}
