"use client";

import { HealthcarePlaceholder } from "@/components/healthcare/healthcare-ui";

export default function PharmacyPage() {
  return (
    <HealthcarePlaceholder
      title="Pharmacy"
      description="Medicine stock, dispensing and pharmacy billing."
      backHref="/dashboard/healthcare/overview"
    />
  );
}
