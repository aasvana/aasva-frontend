"use client";

import * as React from "react";
import { DownloadIcon, PrinterIcon, SaveIcon, X } from "lucide-react";
import { useInvoiceDraftStore } from "./store";
import { useSaveInvoice, useUpdateInvoice } from "./query";
import { downloadInvoicePdf } from "./download";
import { InvoiceFormData, normalizeInvoiceData } from "./schema";
import { InvoicePreview } from "./invoice-preview";
import {
  Button,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  toast,
} from "./ui";

type InvoicePreviewDrawerProps = {
  mode?: "create" | "edit";
  existingId?: string;
  data?: InvoiceFormData | null;
};

export function InvoicePreviewDrawer({
  mode = "create",
  existingId,
  data,
}: InvoicePreviewDrawerProps) {
  const previewOpen = useInvoiceDraftStore((s) => s.previewOpen);
  const closePreview = useInvoiceDraftStore((s) => s.closePreview);
  const storeDraft = useInvoiceDraftStore((s) => s.draft);

  const draft = data ?? storeDraft;

  const saveMutation = useSaveInvoice();
  const updateMutation = useUpdateInvoice(existingId ?? "");
  const [downloading, setDownloading] = React.useState(false);

  const handleDownload = async () => {
    if (!draft) return;
    try {
      setDownloading(true);
      await downloadInvoicePdf(draft);
      toast.success("PDF downloaded successfully!");
    } catch {
      toast.error("Failed to generate the PDF.");
    } finally {
      setDownloading(false);
    }
  };

  const isPending =
    mode === "edit" ? updateMutation.isPending : saveMutation.isPending;

  const handleSave = () => {
    if (!draft) return;
    const normalized = normalizeInvoiceData(draft);
    const onSuccess = () => {
      toast.success(
        mode === "edit" ? "Invoice updated successfully!" : "Invoice saved successfully!"
      );
      closePreview();
    };
    const onError = () => {
      toast.error("Failed to save the invoice.");
    };
    if (mode === "edit") {
      updateMutation.mutate(normalized, { onSuccess, onError });
    } else {
      saveMutation.mutate(normalized, { onSuccess, onError });
    }
  };

  return (
    <Drawer direction="right" open={previewOpen} onOpenChange={(open) => !open && closePreview()}>
      <DrawerContent className="w-[70%] max-w-full rounded-none border-l">
        <div className="flex flex-col h-full">
          <DrawerHeader className="flex flex-row items-start justify-between gap-4 border-b">
            <div className="flex flex-col gap-1">
              <DrawerTitle>Preview Invoice</DrawerTitle>
              <DrawerDescription>
                This is how the invoice will look with the current data.
              </DrawerDescription>
            </div>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon" aria-label="Close preview">
                <X className="size-4" />
              </Button>
            </DrawerClose>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto px-6 py-6 md:px-10 md:py-8">
            {draft ? (
              <div className="rounded-lg border bg-white shadow-sm">
                <InvoicePreview data={draft} />
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                Fill in the invoice details to see the preview.
              </div>
            )}
          </div>

          <DrawerFooter className="flex-row justify-end border-t">
            <Button
              variant="outline"
              disabled={!draft}
              onClick={() => window.print()}
            >
              <PrinterIcon className="size-4" />
              Print
            </Button>
            <Button
              variant="outline"
              disabled={!draft || downloading}
              onClick={handleDownload}
            >
              <DownloadIcon className="size-4" />
              {downloading ? "Generating..." : "Download PDF"}
            </Button>
            <Button disabled={!draft || isPending} onClick={handleSave}>
              <SaveIcon className="size-4" />
              {isPending ? "Saving..." : "Save Invoice"}
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
