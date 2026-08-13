"use client";

import { HealthcarePlaceholder } from "@/components/healthcare/healthcare-ui";

export default function MedicalRecordsPage() {
  return (
    <HealthcarePlaceholder
      title="Medical Records"
      description="Patient charts, history, allergies and attachments."
      backHref="/dashboard/healthcare/overview"
    />
  );
}
