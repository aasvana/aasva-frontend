"use client";

import { useClientReady } from "@/hooks/useClientReady";
import { DocumentTable } from "@/components/teams-meet/document-table";

export default function DocumentsTeamDocumentsPage() {
  const ready = useClientReady();
  if (!ready) return null;

  return (
    <DocumentTable
      title="Team Documents"
      description="Shared files and decks for the team."
      category="Team"
    />
  );
}
