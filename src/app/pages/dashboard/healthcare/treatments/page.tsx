"use client";

import { HealthcarePlaceholder } from "@/components/healthcare/healthcare-ui";

export default function TreatmentsPage() {
  return (
    <HealthcarePlaceholder
      title="Treatments"
      description="Treatment plans, procedures and progress tracking."
      backHref="/dashboard/healthcare/overview"
    />
  );
}
