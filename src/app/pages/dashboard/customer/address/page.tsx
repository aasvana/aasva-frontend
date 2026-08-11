"use client";

import { ProfileSectionForm } from "@/components/customer/customer-ui";
import { useClientReady } from "@/hooks/useClientReady";

export default function CustomerAddressPage() {
  const ready = useClientReady();
  if (!ready) return null;

  return (
    <ProfileSectionForm
      pageTitle="Address"
      pageDescription="Billing and delivery addresses."
      cardTitle="Address Details"
      cardSubtitle="Where this customer is located."
      section="address"
      fields={[
        { name: "address", label: "Address", full: true },
        { name: "city", label: "City" },
        { name: "state", label: "State / Province" },
        { name: "postalCode", label: "Postal Code" },
        { name: "country", label: "Country" },
        {
          name: "addressType",
          label: "Address Type",
          type: "select",
          options: [
            { value: "Home", label: "Home" },
            { value: "Work", label: "Work" },
            { value: "Billing", label: "Billing" },
          ],
        },
      ]}
    />
  );
}
