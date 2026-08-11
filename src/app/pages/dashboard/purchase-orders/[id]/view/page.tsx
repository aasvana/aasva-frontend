"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DownloadIcon, PrinterIcon } from "lucide-react";
import {
  getPurchaseOrder,
  SavedPurchaseOrder,
  downloadPurchaseOrderPdf,
  PurchaseOrderPreview,
} from "@/modules/purchase-order";

const EmptyState = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <p className="text-lg font-medium text-gray-800">Purchase order not found</p>
      <p className="text-sm text-gray-500">
        The purchase order may not have been saved yet.
      </p>
      <Button onClick={() => router.push("/dashboard/purchase-orders/create")}>
        Create Purchase Order
      </Button>
    </div>
  );
};

export default function ViewPurchaseOrder() {
  const params = useParams<{ id: string }>();
  const [purchaseOrder, setPurchaseOrder] = useState<
    SavedPurchaseOrder | undefined
  >(undefined);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (params?.id) {
      setPurchaseOrder(getPurchaseOrder(params.id));
    }
  }, [params?.id]);

  const handleDownload = async () => {
    if (!purchaseOrder) return;
    try {
      setDownloading(true);
      await downloadPurchaseOrderPdf(purchaseOrder.data);
      toast.success("PDF downloaded successfully!");
    } catch {
      toast.error("Failed to generate the PDF.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <>
      {!purchaseOrder ? (
        <EmptyState />
      ) : (
        <>
          <div className="flex flex-col gap-4">
            <div className="no-print flex flex-row items-center justify-between gap-4 border-b pb-4">
              <Button variant="outline" onClick={() => window.history.back()}>
                Back
              </Button>
              <h1 className="text-2xl font-bold">Purchase Order</h1>
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
              <PurchaseOrderPreview data={purchaseOrder.data} />
            </div>
          </div>
        </>
      )}
    </>
  );
}
