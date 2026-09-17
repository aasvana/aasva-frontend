"use client";

import { pdf } from "@react-pdf/renderer";
import { CvPreviewDocument } from "@/components/pdf/cv-preview";
import { CompanyData } from "@/stores/companyStore";
import { ConfirmationVoucherFormData } from "@/app/pages/dashboard/confirmationvouchers/schema";
import { TermSnapshot } from "@/lib/terms-api";

const safeFilePart = (value: string | undefined, fallback: string) => {
  const normalized = (value ?? "")
    .trim()
    .replace(/[\\/:*?"<>|]+/g, " ")
    .replace(/\s+/g, " ");
  return normalized || fallback;
};

export async function downloadCvPdf(
  data: ConfirmationVoucherFormData,
  company: CompanyData,
  terms: TermSnapshot[] = [],
  fileName?: string,
  showTerms = false,
) {
  const generatedFileName = fileName ?? [
    safeFilePart(data.customerName, "customer"),
    safeFilePart(data.voucherNo, "voucher"),
    safeFilePart(company.name, "tenant"),
  ].join(" - ") + ".pdf";
  const blob = await pdf(
    <CvPreviewDocument data={data} company={company} terms={terms} showTerms={showTerms} />
  ).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = generatedFileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
