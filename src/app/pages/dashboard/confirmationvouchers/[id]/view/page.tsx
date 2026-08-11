"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/generic/back-button";
import { DownloadIcon, PrinterIcon } from "lucide-react";
import {
  getConfirmationVoucher,
  SavedConfirmationVoucher,
} from "@/lib/cv-storage";
import { downloadCvPdf } from "@/lib/cv-pdf";
import { ConfirmationVoucher } from "@/components/cv/confirmation-voucher";

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
  const [voucher, setVoucher] = useState<SavedConfirmationVoucher | undefined>(
    undefined
  );
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (params?.id) {
      setVoucher(getConfirmationVoucher(params.id));
    }
  }, [params?.id]);

  const handleDownload = async () => {
    if (!voucher) return;
    try {
      setDownloading(true);
      await downloadCvPdf(voucher.data);
      toast.success("PDF downloaded successfully!");
    } catch {
      toast.error("Failed to generate the PDF.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <>
      {!voucher ? (
        <EmptyState />
      ) : (
        <>
          <div className="flex flex-col gap-4">
      <div className="no-print flex flex-row items-center justify-between gap-4 border-b pb-4">
        <BackButton />
        <h1 className="text-2xl font-bold">Confirmation Voucher</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => window.print()}>
            <PrinterIcon className="size-4" />
            Print
          </Button>
          <Button variant="outline" onClick={handleDownload} disabled={downloading}>
            <DownloadIcon className="size-4" />
            {downloading ? "Generating..." : "Download PDF"}
          </Button>
        </div>
      </div>

      <div className="print-area bg-white border rounded-lg overflow-hidden">
        <ConfirmationVoucher data={voucher.data} />
      </div>
    </div>
        </>
      )}
    </>
  );
}
