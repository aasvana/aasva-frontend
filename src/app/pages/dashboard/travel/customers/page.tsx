"use client";

import { MasterDataManager } from "@/components/cv/master-data-manager";
import { CURRENCIES } from "@/modules/invoice";
import { notify } from "@/lib/notify";
import { Customer, useCustomerStore } from "@/stores/customerStore";

const CURRENCY_OPTIONS = CURRENCIES.map((c) => ({
  value: c.value,
  label: c.label,
}));

export default function TravelCustomersPage() {
  const customers = useCustomerStore((s) => s.customers);
  const addCustomer = useCustomerStore((s) => s.addCustomer);
  const updateCustomer = useCustomerStore((s) => s.updateCustomer);
  const deleteCustomer = useCustomerStore((s) => s.deleteCustomer);

  const handleAdd = (data: Omit<Customer, "id">) => {
    addCustomer(data);
    notify({
      type: "success",
      category: "customer",
      title: "Travel customer added",
      message: data.name,
      customer: data.name,
      link: "/dashboard/travel/customers",
    });
  };

  const handleUpdate = (id: string, data: Omit<Customer, "id">) => {
    updateCustomer(id, data);
    notify({
      type: "info",
      category: "customer",
      title: "Travel customer updated",
      message: data.name,
      customer: data.name,
    });
  };

  return (
    <MasterDataManager
      title="Travel Customers"
      description="Manage travellers and the preferences reused across enquiries, itineraries and bookings."
      addLabel="Add Customer"
      emptyTitle="No travel customers yet"
      emptyDescription="Add your first traveller to reuse their details across the travel modules."
      searchPlaceholder="Search customers..."
      tableHeaders={["Name", "Company", "Place", "Phone", "Email", "Currency"]}
      fields={[
        {
          name: "name",
          label: "Customer Name",
          placeholder: "e.g. Jane Cooper",
          required: true,
        },
        {
          name: "company",
          label: "Company",
          placeholder: "e.g. Acme Inc.",
        },
        {
          name: "email",
          label: "Email",
          placeholder: "e.g. jane@acme.com",
        },
        {
          name: "phone",
          label: "Phone",
          placeholder: "e.g. +1 555 000 1234",
        },
        {
          name: "place",
          label: "Place / City",
          placeholder: "e.g. Mumbai",
        },
        {
          name: "country",
          label: "Country",
          placeholder: "e.g. India",
        },
        {
          name: "address",
          label: "Address",
          placeholder: "Street, area, state, ZIP",
        },
        {
          name: "currency",
          label: "Currency",
          type: "select",
          options: CURRENCY_OPTIONS,
        },
        {
          name: "taxId",
          label: "GSTIN / Tax ID",
          placeholder: "e.g. 27AABCU9603R1ZM",
        },
        {
          name: "notes",
          label: "Notes",
          placeholder: "Optional notes...",
        },
      ]}
      rowCells={(c) => [
        <span key="name" className="font-medium text-gray-800">
          {c.name}
        </span>,
        c.company || "—",
        c.place || "—",
        c.phone || "—",
        c.email || "—",
        c.currency || "—",
      ]}
      items={customers}
      searchText={(c) =>
        `${c.name} ${c.company} ${c.place} ${c.phone} ${c.email}`
      }
      add={handleAdd}
      update={handleUpdate}
      remove={deleteCustomer}
    />
  );
}
