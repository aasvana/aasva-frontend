"use client";

import { pdf } from "@react-pdf/renderer";
import { InvoiceDocument } from "./pdf";
import { InvoiceFormData } from "./schema";
import { InvoiceBusiness } from "./constants";

export async function downloadInvoicePdf(
  data: InvoiceFormData,
  options?: {
    fileName?: string;
    business?: InvoiceBusiness;
  }
) {
  const fileName =
    options?.fileName ?? `invoice-${data.invoiceNo || "download"}.pdf`;
  const blob = await pdf(
    <InvoiceDocument data={data} business={options?.business} />
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
