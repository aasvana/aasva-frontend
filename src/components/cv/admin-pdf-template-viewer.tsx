"use client";

import { useState } from "react";
import { PDFViewer } from "@react-pdf/renderer";
import { CvPreviewDocument } from "@/components/pdf/cv-preview";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CompanyData } from "@/stores/companyStore";
import { ConfirmationVoucherFormData } from "@/app/pages/dashboard/confirmationvouchers/schema";

type AdminPdfTemplateViewerProps = {
  company: CompanyData;
  initialData: ConfirmationVoucherFormData;
};

export function AdminPdfTemplateViewer({ company, initialData }: AdminPdfTemplateViewerProps) {
  const [data, setData] = useState(initialData);
  const update = (field: "customerName" | "voucherNo" | "companyName", value: string) =>
    setData((current) => ({ ...current, [field]: value }));

  return (
    <div className="grid min-h-[calc(100vh-8rem)] gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
      <section className="rounded-xl border bg-white p-4 shadow-sm">
        <h2 className="text-base font-semibold">Template Content</h2>
        <p className="mt-1 text-sm text-muted-foreground">Edit sample values and inspect the exact generated PDF.</p>
        <div className="mt-5 grid gap-4">
          <div className="grid gap-1.5"><Label>Customer Name</Label><Input value={data.customerName} onChange={(event) => update("customerName", event.target.value)} /></div>
          <div className="grid gap-1.5"><Label>Voucher Number</Label><Input value={data.voucherNo} onChange={(event) => update("voucherNo", event.target.value)} /></div>
          <div className="grid gap-1.5"><Label>Company Display Name</Label><Input value={data.companyName} onChange={(event) => update("companyName", event.target.value)} /></div>
        </div>
      </section>
      <section className="min-h-[720px] overflow-hidden rounded-xl border bg-slate-100 shadow-sm">
        <PDFViewer width="100%" height="100%" showToolbar>
          <CvPreviewDocument data={data} company={company} />
        </PDFViewer>
      </section>
    </div>
  );
}
