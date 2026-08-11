"use client";

import { FolderOpen } from "lucide-react";
import { CustomerCollectionManager } from "@/components/customer/customer-ui";
import { useCustomerProfileStore } from "@/stores/customerProfileStore";
import { useClientReady } from "@/hooks/useClientReady";

export default function CustomerDocumentsPage() {
  const add = useCustomerProfileStore((s) => s.addDocument);
  const remove = useCustomerProfileStore((s) => s.deleteDocument);
  const ready = useClientReady();
  if (!ready) return null;

  return (
    <CustomerCollectionManager
      title="Documents"
      description="Uploaded documents for this customer."
      addLabel="Add Document"
      emptyTitle="No documents"
      emptyDescription="Add a document to get started."
      searchPlaceholder="Search documents…"
      tableHeaders={["Name", "Type", "Size", "Uploaded"]}
      getItems={(p) => p.travel.documents}
      searchText={(d) => `${d.name} ${d.type}`}
      add={add}
      remove={remove}
      fields={[
        { name: "name", label: "Name", required: true },
        {
          name: "type",
          label: "Type",
          type: "select",
          options: [
            { value: "Passport", label: "Passport" },
            { value: "Visa", label: "Visa" },
            { value: "ID", label: "ID" },
            { value: "Insurance", label: "Insurance" },
            { value: "Other", label: "Other" },
          ],
        },
        { name: "size", label: "Size" },
        { name: "uploadedAt", label: "Uploaded", type: "date" },
      ]}
      rowCells={(d) => [
        <span key="name" className="inline-flex items-center gap-2 font-medium text-gray-800">
          <FolderOpen className="size-4 text-amber-500" /> {d.name}
        </span>,
        <span key="type">{d.type}</span>,
        <span key="size" className="text-gray-500">{d.size}</span>,
        <span key="date" className="text-gray-500">{d.uploadedAt}</span>,
      ]}
    />
  );
}
