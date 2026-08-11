"use client";

import { differenceInCalendarDays, format, parseISO } from "date-fns";
import { MasterDataManager } from "@/components/cv/master-data-manager";
import { notify } from "@/lib/notify";
import {
  DOCUMENT_CATEGORIES,
  TravelDocument,
  useTravelDocumentStore,
} from "@/stores/travelDocumentStore";

const CATEGORY_OPTIONS = DOCUMENT_CATEGORIES.map((category) => ({
  value: category,
  label: category,
}));

function ExpiryCell({ expiresOn }: { expiresOn: string }) {
  if (!expiresOn) return <span className="text-gray-500">—</span>;
  const days = differenceInCalendarDays(parseISO(expiresOn), new Date());
  const className =
    days < 0
      ? "font-semibold text-red-600"
      : days <= 30
        ? "font-semibold text-amber-600"
        : "text-gray-600";
  const suffix = days < 0 ? " expired" : days <= 30 ? ` · ${days}d left` : "";
  return (
    <span className={className}>
      {format(parseISO(expiresOn), "dd MMM yyyy")}
      {suffix}
    </span>
  );
}

export default function TravelDocumentsPage() {
  const documents = useTravelDocumentStore((s) => s.documents);
  const addDocument = useTravelDocumentStore((s) => s.addDocument);
  const updateDocument = useTravelDocumentStore((s) => s.updateDocument);
  const deleteDocument = useTravelDocumentStore((s) => s.deleteDocument);

  const handleAdd = (data: Omit<TravelDocument, "id">) => {
    addDocument(data);
    notify({
      type: "success",
      category: "travel",
      title: "Travel document added",
      message: data.name,
      link: "/dashboard/travel/documents",
    });
  };

  const handleUpdate = (id: string, data: Omit<TravelDocument, "id">) => {
    updateDocument(id, data);
    notify({
      type: "info",
      category: "travel",
      title: "Travel document updated",
      message: data.name,
    });
  };

  return (
    <MasterDataManager
      title="Travel Documents"
      description="Track passports, visas, tickets, vouchers and insurance."
      addLabel="Add Document"
      emptyTitle="No travel documents yet"
      emptyDescription="Add a passport, visa or ticket to track its expiry."
      searchPlaceholder="Search documents..."
      tableHeaders={[
        "Name",
        "Category",
        "Reference",
        "Related To",
        "Expires On",
      ]}
      fields={[
        {
          name: "name",
          label: "Document Name",
          placeholder: "e.g. Jane Cooper Passport",
          required: true,
        },
        {
          name: "category",
          label: "Category",
          type: "select",
          options: CATEGORY_OPTIONS,
          required: true,
        },
        {
          name: "reference",
          label: "Reference / Number",
          placeholder: "e.g. P12345678",
        },
        {
          name: "relatedTo",
          label: "Related To",
          placeholder: "e.g. Jane Cooper or Trip name",
        },
        {
          name: "expiresOn",
          label: "Expires On",
          type: "date",
        },
        {
          name: "notes",
          label: "Notes",
          placeholder: "Optional notes...",
        },
      ]}
      rowCells={(d) => [
        <span key="name" className="font-medium text-gray-800">
          {d.name}
        </span>,
        d.category,
        d.reference || "—",
        d.relatedTo || "—",
        <ExpiryCell key="expiry" expiresOn={d.expiresOn} />,
      ]}
      items={documents}
      searchText={(d) =>
        `${d.name} ${d.category} ${d.reference} ${d.relatedTo}`
      }
      add={handleAdd}
      update={handleUpdate}
      remove={deleteDocument}
    />
  );
}
