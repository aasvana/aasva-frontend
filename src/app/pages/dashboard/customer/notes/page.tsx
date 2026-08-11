"use client";

import { CustomerCollectionManager } from "@/components/customer/customer-ui";
import { useCustomerProfileStore } from "@/stores/customerProfileStore";
import { useClientReady } from "@/hooks/useClientReady";

export default function CustomerNotesPage() {
  const add = useCustomerProfileStore((s) => s.addNote);
  const update = useCustomerProfileStore((s) => s.updateNote);
  const remove = useCustomerProfileStore((s) => s.deleteNote);
  const ready = useClientReady();
  if (!ready) return null;

  return (
    <CustomerCollectionManager
      title="Notes"
      description="Internal notes about this customer."
      addLabel="Add Note"
      emptyTitle="No notes"
      emptyDescription="Add a note to get started."
      searchPlaceholder="Search notes…"
      tableHeaders={["Title", "Body", "Created", "Updated"]}
      getItems={(p) => p.notes}
      searchText={(n) => `${n.title} ${n.body}`}
      add={add}
      update={update}
      remove={remove}
      fields={[
        { name: "title", label: "Title", required: true },
        { name: "body", label: "Body" },
      ]}
      rowCells={(n) => [
        <span key="title" className="font-medium text-gray-800">{n.title}</span>,
        <span key="body" className="max-w-72 truncate text-gray-500">{n.body}</span>,
        <span key="created" className="text-gray-500">{n.createdAt}</span>,
        <span key="updated" className="text-gray-500">{n.updatedAt}</span>,
      ]}
    />
  );
}
