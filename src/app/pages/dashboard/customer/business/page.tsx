"use client";

import { ProfileSectionForm } from "@/components/customer/customer-ui";
import { useClientReady } from "@/hooks/useClientReady";

export default function CustomerBusinessPage() {
  const ready = useClientReady();
  if (!ready) return null;

  return (
    <ProfileSectionForm
      pageTitle="Business"
      pageDescription="Company and billing details."
      cardTitle="Business Details"
      cardSubtitle="Company information used on invoices."
      section="business"
      fields={[
        { name: "company", label: "Company" },
        { name: "jobTitle", label: "Job Title" },
        { name: "taxId", label: "GSTIN / Tax ID" },
        {
          name: "businessType",
          label: "Business Type",
          type: "select",
          options: [
            { value: "Private Limited", label: "Private Limited" },
            { value: "Sole Proprietor", label: "Sole Proprietor" },
            { value: "LLC", label: "LLC" },
            { value: "Partnership", label: "Partnership" },
          ],
        },
        { name: "industry", label: "Industry" },
        { name: "website", label: "Website", full: true },
      ]}
    />
  );
}
