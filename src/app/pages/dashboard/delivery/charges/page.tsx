"use client";

import { useMemo } from "react";
import { MasterDataManager } from "@/components/cv/master-data-manager";
import {
  DeliveryCharge,
  useDeliveryStore,
} from "@/stores/deliveryStore";
import { logDeliveryAction } from "@/components/delivery/delivery-ui";
import { useClientReady } from "@/hooks/useClientReady";

const RULE_OPTIONS = ["Fixed", "Per Weight", "Per Distance"].map((r) => ({
  value: r,
  label: r,
}));

const STATUS_OPTIONS = [
  { value: "Yes", label: "Active" },
  { value: "No", label: "Inactive" },
];

export default function DeliveryChargesPage() {
  const charges = useDeliveryStore((s) => s.charges);
  const zones = useDeliveryStore((s) => s.zones);
  const addCharge = useDeliveryStore((s) => s.addCharge);
  const updateCharge = useDeliveryStore((s) => s.updateCharge);
  const deleteCharge = useDeliveryStore((s) => s.deleteCharge);

  const zoneOptions = useMemo(
    () => zones.map((z) => ({ value: z.name, label: z.name })),
    [zones]
  );

  const ready = useClientReady();
  if (!ready) return null;

  const handleAdd = (data: Omit<DeliveryCharge, "id">) => {
    addCharge(data as Omit<DeliveryCharge, "id" | "createdAt">);
    logDeliveryAction("created", "Charge", data.name, `Delivery charge ${data.name} created.`);
  };

  const handleUpdate = (id: string, data: Omit<DeliveryCharge, "id">) => {
    updateCharge(id, data as Omit<DeliveryCharge, "id" | "createdAt">);
    logDeliveryAction("updated", "Charge", data.name, `Delivery charge ${data.name} updated.`);
  };

  const handleDelete = (id: string) => {
    const charge = charges.find((c) => c.id === id);
    deleteCharge(id);
    if (charge) {
      logDeliveryAction("deleted", "Charge", charge.name, `Delivery charge ${charge.name} deleted.`);
    }
  };

  return (
    <MasterDataManager
      title="Delivery Charges"
      description="Pricing rules for calculating delivery fees."
      addLabel="Add Charge"
      emptyTitle="No charges yet"
      emptyDescription="Add a charge rule to calculate delivery fees."
      searchPlaceholder="Search charges…"
      tableHeaders={["Name", "Zone", "Rule", "Weight Range", "Base Charge", "Per KG", "Per KM", "Status"]}
      fields={[
        { name: "name", label: "Charge Name", required: true },
        { name: "zoneName", label: "Zone", type: "select", options: zoneOptions },
        { name: "ruleType", label: "Rule Type", type: "select", options: RULE_OPTIONS },
        { name: "weightFrom", label: "Weight From (kg)", type: "number" },
        { name: "weightTo", label: "Weight To (kg)", type: "number" },
        { name: "baseCharge", label: "Base Charge", type: "number" },
        { name: "perKg", label: "Per KG", type: "number" },
        { name: "perKm", label: "Per KM", type: "number" },
        { name: "minCharge", label: "Min Charge", type: "number" },
        { name: "maxCharge", label: "Max Charge", type: "number" },
        { name: "isActive", label: "Status", type: "select", options: STATUS_OPTIONS },
      ]}
      rowCells={(c) => [
        <span key="name" className="font-medium text-gray-800">{c.name}</span>,
        <span key="zone">{c.zoneName || "All"}</span>,
        <span key="rule">{c.ruleType}</span>,
        <span key="weight" className="text-gray-500">{c.weightFrom} – {c.weightTo} kg</span>,
        <span key="base">${c.baseCharge}</span>,
        <span key="kg">${c.perKg}</span>,
        <span key="km">${c.perKm}</span>,
        <span
          key="status"
          className={
            c.isActive === "Yes"
              ? "inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700"
              : "inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-500"
          }
        >
          {c.isActive === "Yes" ? "Active" : "Inactive"}
        </span>,
      ]}
      items={charges}
      searchText={(c) => `${c.name} ${c.zoneName} ${c.ruleType}`}
      add={handleAdd}
      update={handleUpdate}
      remove={handleDelete}
    />
  );
}
