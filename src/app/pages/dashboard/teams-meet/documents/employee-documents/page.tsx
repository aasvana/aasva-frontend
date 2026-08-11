"use client";

import { useClientReady } from "@/hooks/useClientReady";
import { DocumentTable } from "@/components/teams-meet/document-table";

export default function DocumentsEmployeeDocumentsPage() {
  const ready = useClientReady();
  if (!ready) return null;

  return (
    <DocumentTable
      title="Employee Documents"
      description="Personal employment records."
      category="Employee"
    />
  );
}
