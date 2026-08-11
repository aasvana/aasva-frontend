"use client";

import { pdf } from "@react-pdf/renderer";
import { PurchaseOrderDocument } from "./pdf";
import { PurchaseOrderFormData } from "./schema";
import { InvoiceBusiness } from "./constants";

export async function downloadPurchaseOrderPdf(
  data: PurchaseOrderFormData,
  options?: {
    fileName?: string;
    business?: InvoiceBusiness;
  }
) {
  const fileName =
    options?.fileName ?? `purchase-order-${data.poNo || "download"}.pdf`;
  const blob = await pdf(
    <PurchaseOrderDocument data={data} business={options?.business} />
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
