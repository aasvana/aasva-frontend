"use client";

import { HealthcarePlaceholder } from "@/components/healthcare/healthcare-ui";

export default function StaffPage() {
  return (
    <HealthcarePlaceholder
      title="Staff"
      description="Doctors, nurses and support staff management."
      backHref="/dashboard/healthcare/overview"
    />
  );
}
