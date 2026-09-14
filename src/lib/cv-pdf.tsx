"use client";

import { pdf } from "@react-pdf/renderer";
import { CvPreviewDocument } from "@/components/pdf/cv-preview";
import { CompanyData } from "@/stores/companyStore";
import { ConfirmationVoucherFormData } from "@/app/pages/dashboard/confirmationvouchers/schema";

export async function downloadCvPdf(
  data: ConfirmationVoucherFormData,
  company: CompanyData,
  fileName = `confirmation-voucher-${data.voucherNo || "download"}.pdf`
) {
  const blob = await pdf(
    <CvPreviewDocument data={data} company={company} />
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
