"use client";

import * as React from "react";
import { DownloadIcon, PrinterIcon, SaveIcon, X } from "lucide-react";
import { usePurchaseOrderDraftStore } from "./store";
import { useSavePurchaseOrder, useUpdatePurchaseOrder } from "./query";
import { downloadPurchaseOrderPdf } from "./download";
import { PurchaseOrderFormData } from "./schema";
import { PurchaseOrderPreview } from "./preview";
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

type PurchaseOrderPreviewDrawerProps = {
  mode?: "create" | "edit";
  existingId?: string;
  data?: PurchaseOrderFormData | null;
};

export function PurchaseOrderPreviewDrawer({
  mode = "create",
  existingId,
  data,
}: PurchaseOrderPreviewDrawerProps) {
  const previewOpen = usePurchaseOrderDraftStore((s) => s.previewOpen);
  const closePreview = usePurchaseOrderDraftStore((s) => s.closePreview);
  const storeDraft = usePurchaseOrderDraftStore((s) => s.draft);

  const draft = data ?? storeDraft;

  const saveMutation = useSavePurchaseOrder();
  const updateMutation = useUpdatePurchaseOrder(existingId ?? "");
  const [downloading, setDownloading] = React.useState(false);

  const handleDownload = async () => {
    if (!draft) return;
    try {
      setDownloading(true);
      await downloadPurchaseOrderPdf(draft);
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
    const onSuccess = () => {
      toast.success(
        mode === "edit"
          ? "Purchase order updated successfully!"
          : "Purchase order saved successfully!"
      );
      closePreview();
    };
    const onError = () => {
      toast.error("Failed to save the purchase order.");
    };
    if (mode === "edit") {
      updateMutation.mutate(draft, { onSuccess, onError });
    } else {
      saveMutation.mutate(draft, { onSuccess, onError });
    }
  };

  return (
    <Drawer
      direction="right"
      open={previewOpen}
      onOpenChange={(open) => !open && closePreview()}
    >
      <DrawerContent className="w-[70%] max-w-full rounded-none border-l">
        <div className="flex flex-col h-full">
          <DrawerHeader className="flex flex-row items-start justify-between gap-4 border-b">
            <div className="flex flex-col gap-1">
              <DrawerTitle>Preview Purchase Order</DrawerTitle>
              <DrawerDescription>
                This is how the purchase order will look with the current data.
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
                <PurchaseOrderPreview data={draft} />
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                Fill in the purchase order details to see the preview.
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
              {isPending ? "Saving..." : "Save Purchase Order"}
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
