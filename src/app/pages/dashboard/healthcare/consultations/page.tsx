"use client";

import { HealthcarePlaceholder } from "@/components/healthcare/healthcare-ui";

export default function ConsultationsPage() {
  return (
    <HealthcarePlaceholder
      title="Consultations"
      description="Doctor consultations, diagnoses and vitals."
      backHref="/dashboard/healthcare/overview"
    />
  );
}
