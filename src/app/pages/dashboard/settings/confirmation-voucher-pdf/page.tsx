"use client";

import { AdminPdfTemplateViewer } from "@/components/cv/admin-pdf-template-viewer";
import { createConfirmationVoucherDefaults } from "@/components/cv/confirmation-voucher-form";
import { useCompanyStore } from "@/stores/companyStore";
import { ConfirmationVoucherFormData } from "@/app/pages/dashboard/confirmationvouchers/schema";

export default function ConfirmationVoucherPdfSettingsPage() {
  const company = useCompanyStore((state) => state.company);
  return (
    <main className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Confirmation Voucher PDF</h1>
        <p className="mt-1 text-sm text-muted-foreground">Preview and adjust the exact PDF output used for voucher downloads.</p>
      </div>
      <AdminPdfTemplateViewer company={company} initialData={createConfirmationVoucherDefaults as ConfirmationVoucherFormData} />
    </main>
  );
}
