"use client";

import { pdf } from "@react-pdf/renderer";
import { DeliveryNoteDocument } from "./pdf";
import { DeliveryNoteFormData } from "./schema";
import { InvoiceBusiness } from "./constants";

export async function downloadDeliveryNotePdf(
  data: DeliveryNoteFormData,
  options?: {
    fileName?: string;
    business?: InvoiceBusiness;
  }
) {
  const fileName =
    options?.fileName ?? `delivery-note-${data.dnNo || "download"}.pdf`;
  const blob = await pdf(
    <DeliveryNoteDocument data={data} business={options?.business} />
  ).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
