"use client";

import { HealthcarePlaceholder } from "@/components/healthcare/healthcare-ui";

export default function PrescriptionsPage() {
  return (
    <HealthcarePlaceholder
      title="Prescriptions"
      description="Prescribed medicines with dosage and instructions."
      backHref="/dashboard/healthcare/overview"
    />
  );
}
