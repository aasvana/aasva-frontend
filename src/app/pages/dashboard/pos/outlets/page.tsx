"use client";

import { MasterDataManager } from "@/components/cv/master-data-manager";
import { CURRENCIES } from "@/modules/invoice";
import { notify } from "@/lib/notify";
import { Outlet, useOutletStore } from "@/stores/outletStore";

const CURRENCY_OPTIONS = CURRENCIES.map((c) => ({
  value: c.value,
  label: c.label,
}));

const DEFAULT_OPTIONS = [
  { value: "No", label: "No" },
  { value: "Yes", label: "Yes" },
];

const toBool = (v: string | boolean) => v === true || v === "Yes";

export default function OutletsPage() {
  const outlets = useOutletStore((s) => s.outlets);
  const addOutlet = useOutletStore((s) => s.addOutlet);
  const updateOutlet = useOutletStore((s) => s.updateOutlet);
  const deleteOutlet = useOutletStore((s) => s.deleteOutlet);
  const setActiveOutlet = useOutletStore((s) => s.setActiveOutlet);

  const handleAdd = (data: Omit<Outlet, "id">) => {
    addOutlet({ ...data, isDefault: toBool(data.isDefault) });
    notify({
      type: "success",
      category: "system",
      title: "Outlet added",
      message: data.name,
      link: "/dashboard/pos/outlets",
    });
  };

  const handleUpdate = (id: string, data: Omit<Outlet, "id">) => {
    updateOutlet(id, { ...data, isDefault: toBool(data.isDefault) });
    notify({
      type: "info",
      category: "system",
      title: "Outlet updated",
      message: data.name,
    });
  };

  return (
    <MasterDataManager
      title="Outlets"
      description="Manage your outlets. Each outlet has its own products, stock, and sales."
      addLabel="Add Outlet"
      emptyTitle="No outlets yet"
      emptyDescription="Add your first outlet to start selling from it."
      searchPlaceholder="Search outlets..."
      tableHeaders={["Name", "Code", "Phone", "Address", "Currency", "Default"]}
      fields={[
        {
          name: "name",
          label: "Outlet Name",
          placeholder: "e.g. Downtown Store",
          required: true,
        },
        {
          name: "code",
          label: "Code",
          placeholder: "e.g. DT",
        },
        {
          name: "phone",
          label: "Phone",
          placeholder: "e.g. +1 555 000 1234",
        },
        {
          name: "email",
          label: "Email",
          placeholder: "e.g. downtown@store.com",
        },
        {
          name: "address",
          label: "Address",
          placeholder: "Street, area, city",
        },
        {
          name: "currency",
          label: "Currency",
          type: "select",
          options: CURRENCY_OPTIONS,
        },
        {
          name: "isDefault",
          label: "Default Outlet",
          type: "select",
          options: DEFAULT_OPTIONS,
        },
      ]}
      rowCells={(o) => [
        <button
          key="name"
          type="button"
          onClick={() => setActiveOutlet(o.id)}
          className="text-left font-medium text-emerald-700 hover:underline"
        >
          {o.name}
        </button>,
        o.code || "—",
        o.phone || "—",
        o.address || "—",
        o.currency || "—",
        o.isDefault ? (
          <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
            Default
          </span>
        ) : (
          <span className="text-gray-400">—</span>
        ),
      ]}
      items={outlets}
      searchText={(o) =>
        `${o.name} ${o.code} ${o.address} ${o.phone} ${o.email}`
      }
      add={handleAdd}
      update={handleUpdate}
      remove={deleteOutlet}
    />
  );
}
