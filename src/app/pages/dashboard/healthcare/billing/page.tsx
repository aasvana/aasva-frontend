"use client";

import { HealthcarePlaceholder } from "@/components/healthcare/healthcare-ui";

export default function BillingPage() {
  return (
    <HealthcarePlaceholder
      title="Billing"
      description="Patient invoices, payments and outstanding balances."
      backHref="/dashboard/healthcare/overview"
    />
  );
}
