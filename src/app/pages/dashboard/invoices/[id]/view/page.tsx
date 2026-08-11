"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DownloadIcon, PrinterIcon } from "lucide-react";
import { getInvoice, SavedInvoice } from "@/modules/invoice";
import { downloadInvoicePdf } from "@/modules/invoice";
import { InvoicePreview } from "@/modules/invoice";

const EmptyState = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <p className="text-lg font-medium text-gray-800">Invoice not found</p>
      <p className="text-sm text-gray-500">The invoice may not have been saved yet.</p>
      <Button onClick={() => router.push("/dashboard/invoices/create")}>
        Create Invoice
      </Button>
    </div>
  );
};

export default function ViewInvoice() {
  const params = useParams<{ id: string }>();
  const [invoice, setInvoice] = useState<SavedInvoice | undefined>(undefined);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (params?.id) {
      setInvoice(getInvoice(params.id));
    }
  }, [params?.id]);

  const handleDownload = async () => {
    if (!invoice) return;
    try {
      setDownloading(true);
      await downloadInvoicePdf(invoice.data);
      toast.success("PDF downloaded successfully!");
    } catch {
      toast.error("Failed to generate the PDF.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <>
      {!invoice ? (
        <EmptyState />
      ) : (
        <>
          <div className="flex flex-col gap-4">
            <div className="no-print flex flex-row items-center justify-between gap-4 border-b pb-4">
              <Button variant="outline" onClick={() => window.history.back()}>
                Back
              </Button>
              <h1 className="text-2xl font-bold">Invoice</h1>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => window.print()}>
                  <PrinterIcon className="size-4" />
                  Print
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDownload}
                  disabled={downloading}
                >
                  <DownloadIcon className="size-4" />
                  {downloading ? "Generating..." : "Download PDF"}
                </Button>
              </div>
            </div>

            <div className="print-area bg-white border rounded-lg overflow-hidden">
              <InvoicePreview data={invoice.data} />
            </div>
          </div>
        </>
      )}
    </>
  );
}
