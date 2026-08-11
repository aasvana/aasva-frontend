"use client";

import { MasterDataManager } from "@/components/cv/master-data-manager";
import { useAccountSettingsStore } from "@/stores/accountSettingsStore";
import { useClientReady } from "@/hooks/useClientReady";

export default function PaymentTermsPage() {
  const paymentTerms = useAccountSettingsStore((s) => s.paymentTerms);
  const addPaymentTerm = useAccountSettingsStore((s) => s.addPaymentTerm);
  const updatePaymentTerm = useAccountSettingsStore((s) => s.updatePaymentTerm);
  const deletePaymentTerm = useAccountSettingsStore((s) => s.deletePaymentTerm);

  const ready = useClientReady();
  if (!ready) return null;

  return (
    <MasterDataManager
      title="Payment Terms"
      description="Define the payment terms offered to customers."
      addLabel="Add Payment Term"
      emptyTitle="No payment terms yet"
      emptyDescription="Create the payment terms used on invoices."
      searchPlaceholder="Search payment terms..."
      tableHeaders={["Name", "Days", "Description"]}
      fields={[
        {
          name: "name",
          label: "Name",
          placeholder: "e.g. Net 30",
          required: true,
        },
        {
          name: "days",
          label: "Due in (days)",
          type: "number",
          placeholder: "e.g. 30",
          required: true,
        },
        {
          name: "description",
          label: "Description",
          placeholder: "e.g. Payment due within 30 days.",
        },
      ]}
      rowCells={(e) => [
        <span key="name" className="font-medium text-gray-800">
          {e.name}
        </span>,
        `${e.days} days`,
        e.description,
      ]}
      items={paymentTerms}
      searchText={(e) => `${e.name} ${e.days} ${e.description}`}
      add={addPaymentTerm}
      update={updatePaymentTerm}
      remove={deletePaymentTerm}
    />
  );
}
