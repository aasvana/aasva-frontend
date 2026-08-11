"use client";

import { useMemo } from "react";
import { MasterDataManager } from "@/components/cv/master-data-manager";
import {
  SUPPLIER_CATEGORY_LABEL,
  Supplier,
  SupplierCategory,
  useSupplierStore,
} from "@/stores/supplierStore";
import { notify } from "@/lib/notify";

const RATING_OPTIONS = ["1", "2", "3", "4", "5"].map((rating) => ({
  value: rating,
  label: `${rating} Star`,
}));

const STATUS_OPTIONS = [
  { value: "Yes", label: "Active" },
  { value: "No", label: "Inactive" },
];

const PLURAL: Record<SupplierCategory, string> = {
  hotel: "Hotels",
  airline: "Airlines",
  transport: "Transport",
  activity: "Activities",
};

const PLURAL_SLUG: Record<SupplierCategory, string> = {
  hotel: "hotels",
  airline: "airlines",
  transport: "transport",
  activity: "activities",
};

export function SupplierManager({
  category,
  singular,
}: {
  category: SupplierCategory;
  singular: string;
}) {
  const suppliers = useSupplierStore((s) => s.suppliers);
  const addSupplier = useSupplierStore((s) => s.addSupplier);
  const updateSupplier = useSupplierStore((s) => s.updateSupplier);
  const deleteSupplier = useSupplierStore((s) => s.deleteSupplier);

  const categoryLabel = SUPPLIER_CATEGORY_LABEL[category];

  const filtered = useMemo(
    () => suppliers.filter((s) => s.category === category),
    [suppliers, category]
  );

  const handleAdd = (data: Omit<Supplier, "id">) => {
    addSupplier({ ...data, category });
    notify({
      type: "success",
      category: "travel",
      title: `${singular} supplier added`,
      message: data.name,
      link: `/dashboard/travel/suppliers/${PLURAL_SLUG[category]}`,
    });
  };

  const handleUpdate = (id: string, data: Omit<Supplier, "id">) => {
    updateSupplier(id, { ...data, category });
    notify({
      type: "info",
      category: "travel",
      title: `${singular} supplier updated`,
      message: data.name,
    });
  };

  const plural = PLURAL[category];

  return (
    <MasterDataManager
      title={`${plural}`}
      description={`Manage the ${categoryLabel.toLowerCase()} suppliers used across bookings and itineraries.`}
      addLabel={`Add ${singular}`}
      emptyTitle={`No ${categoryLabel.toLowerCase()} suppliers yet`}
      emptyDescription={`Add a ${singular.toLowerCase()} to use it in bookings and itineraries.`}
      searchPlaceholder={`Search ${categoryLabel.toLowerCase()}s...`}
      tableHeaders={["Name", "Contact", "City", "Rating", "Status"]}
      fields={[
        {
          name: "name",
          label: `${singular} Name`,
          placeholder: `e.g. ${
            category === "hotel"
              ? "Taj Mahal Palace"
              : category === "airline"
                ? "Emirates"
                : category === "transport"
                  ? "Hertz Rent a Car"
                  : "Desert Safari Dubai"
          }`,
          required: true,
        },
        {
          name: "contactPerson",
          label: "Contact Person",
          placeholder: "e.g. Reservations Desk",
        },
        {
          name: "phone",
          label: "Phone",
          placeholder: "e.g. +971 4 123 4567",
        },
        {
          name: "email",
          label: "Email",
          placeholder: "e.g. bookings@example.com",
        },
        {
          name: "city",
          label: "City",
          placeholder: "e.g. Dubai",
        },
        {
          name: "country",
          label: "Country",
          placeholder: "e.g. UAE",
        },
        {
          name: "rating",
          label: "Rating",
          type: "select",
          options: RATING_OPTIONS,
        },
        {
          name: "isActive",
          label: "Status",
          type: "select",
          options: STATUS_OPTIONS,
        },
        {
          name: "notes",
          label: "Notes",
          placeholder: "Optional notes...",
        },
      ]}
      rowCells={(s) => [
        <span key="name" className="font-medium text-gray-800">
          {s.name}
        </span>,
        s.contactPerson || s.email || "—",
        s.city ? `${s.city}${s.country ? `, ${s.country}` : ""}` : "—",
        s.rating ? `${s.rating} Star` : "—",
        <span
          key="status"
          className={
            s.isActive === "Yes"
              ? "inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700"
              : "inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-500"
          }
        >
          {s.isActive === "Yes" ? "Active" : "Inactive"}
        </span>,
      ]}
      items={filtered}
      searchText={(s) =>
        `${s.name} ${s.contactPerson} ${s.phone} ${s.email} ${s.city} ${s.country}`
      }
      add={handleAdd}
      update={handleUpdate}
      remove={deleteSupplier}
    />
  );
}
