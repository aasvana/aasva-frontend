"use client";

import { HealthcarePlaceholder } from "@/components/healthcare/healthcare-ui";

export default function PatientsPage() {
  return (
    <HealthcarePlaceholder
      title="Patients"
      description="Manage patient records, history and personal information."
      backHref="/dashboard/healthcare/overview"
    />
  );
}
