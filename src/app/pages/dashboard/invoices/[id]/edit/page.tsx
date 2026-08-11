"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  getInvoice,
  SavedInvoice,
  mergeInvoiceDefaults,
} from "@/modules/invoice";
import { InvoiceForm } from "@/modules/invoice";

export default function EditInvoice() {
  const params = useParams<{ id: string }>();
  const [invoice, setInvoice] = useState<SavedInvoice | undefined>(undefined);

  useEffect(() => {
    if (params?.id) {
      setInvoice(getInvoice(params.id));
    }
  }, [params?.id]);

  if (!invoice) {
    return (
      <div className="flex items-center justify-center py-24 text-sm text-gray-500">
        Loading invoice...
      </div>
    );
  }

  return (
    <InvoiceForm
      mode="edit"
      existingId={invoice.id}
      defaultValues={mergeInvoiceDefaults(invoice.data)}
    />
  );
}
