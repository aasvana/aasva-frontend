"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/generic/back-button";
import { DownloadIcon, PrinterIcon } from "lucide-react";
import { useConfirmationVoucher } from "@/lib/cv-query";
import { useCompanySettings } from "@/lib/company-query";
import { useCompanyStore } from "@/stores/companyStore";
import { downloadCvPdf } from "@/lib/cv-pdf";
import { ConfirmationVoucher } from "@/components/cv/confirmation-voucher";
import { confirmationVoucherSchema } from "@/app/pages/dashboard/confirmationvouchers/schema";

const EmptyState = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <p className="text-lg font-medium text-gray-800">
        Confirmation voucher not found
      </p>
      <p className="text-sm text-gray-500">
        The voucher may not have been saved yet.
      </p>
      <Button onClick={() => router.push("/dashboard/confirmation-vouchers/create")}>
        Create Confirmation Voucher
      </Button>
    </div>
  );
};

export default function ViewConfirmationVoucher() {
  const params = useParams<{ id: string }>();
  const { data: voucher, isLoading } = useConfirmationVoucher(params?.id);
  const company = useCompanyStore((s) => s.company);
  useCompanySettings();
  const [downloading, setDownloading] = useState(false);

  const isComplete = voucher
    ? confirmationVoucherSchema.safeParse(voucher.data).success
    : false;

  const handleDownload = async () => {
    if (!voucher) return;
    try {
      setDownloading(true);
      await downloadCvPdf(voucher.data, company);
      toast.success("PDF downloaded successfully!");
    } catch {
      toast.error("Failed to generate the PDF.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="flex items-center justify-center py-24 text-sm text-gray-500">
          Loading...
        </div>
      ) : !voucher ? (
        <EmptyState />
      ) : (
        <>
          <div className="flex flex-col gap-4">
      <div className="no-print flex flex-row items-center justify-between gap-4 border-b pb-4">
        <BackButton />
        <h1 className="text-2xl font-bold">Confirmation Voucher</h1>
        <div className="flex items-center gap-2">
          {!isComplete && (
            <span className="mr-auto flex items-center text-xs text-amber-600">
              Complete all steps to download the PDF.
            </span>
          )}
          <Button
            variant="outline"
            onClick={() => window.print()}
            disabled={!isComplete}
          >
            <PrinterIcon className="size-4" />
            Print
          </Button>
          <Button
            variant="outline"
            onClick={handleDownload}
            disabled={!isComplete || downloading}
          >
            <DownloadIcon className="size-4" />
            {downloading ? "Generating..." : "Download PDF"}
          </Button>
        </div>
      </div>

      <div className="print-area bg-white border rounded-lg overflow-hidden">
        <ConfirmationVoucher data={voucher.data} company={company} />
      </div>
    </div>
        </>
      )}
    </>
  );
}