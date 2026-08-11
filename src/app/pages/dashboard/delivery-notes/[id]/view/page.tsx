"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DownloadIcon, PrinterIcon } from "lucide-react";
import {
  getDeliveryNote,
  SavedDeliveryNote,
  downloadDeliveryNotePdf,
  DeliveryNotePreview,
} from "@/modules/delivery-note";

const EmptyState = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <p className="text-lg font-medium text-gray-800">Delivery note not found</p>
      <p className="text-sm text-gray-500">
        The delivery note may not have been saved yet.
      </p>
      <Button onClick={() => router.push("/dashboard/delivery-notes/create")}>
        Create Delivery Note
      </Button>
    </div>
  );
};

export default function ViewDeliveryNote() {
  const params = useParams<{ id: string }>();
  const [deliveryNote, setDeliveryNote] = useState<
    SavedDeliveryNote | undefined
  >(undefined);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (params?.id) {
      setDeliveryNote(getDeliveryNote(params.id));
    }
  }, [params?.id]);

  const handleDownload = async () => {
    if (!deliveryNote) return;
    try {
      setDownloading(true);
      await downloadDeliveryNotePdf(deliveryNote.data);
      toast.success("PDF downloaded successfully!");
    } catch {
      toast.error("Failed to generate the PDF.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <>
      {!deliveryNote ? (
        <EmptyState />
      ) : (
        <>
          <div className="flex flex-col gap-4">
            <div className="no-print flex flex-row items-center justify-between gap-4 border-b pb-4">
              <Button variant="outline" onClick={() => window.history.back()}>
                Back
              </Button>
              <h1 className="text-2xl font-bold">Delivery Note</h1>
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
              <DeliveryNotePreview data={deliveryNote.data} />
            </div>
          </div>
        </>
      )}
    </>
  );
}
