"use client";

import * as React from "react";
import { DownloadIcon, PrinterIcon, SaveIcon, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useCvStore } from "@/stores/useCvStore";
import {
  useSaveConfirmationVoucher,
  useUpdateConfirmationVoucher,
} from "@/lib/cv-query";
import { downloadCvPdf } from "@/lib/cv-pdf";
import { useCompanySettings } from "@/lib/company-query";
import { useCompanyStore } from "@/stores/companyStore";
import { ConfirmationVoucherFormData } from "@/app/pages/dashboard/confirmationvouchers/schema";
import { ConfirmationVoucher } from "./confirmation-voucher";

type CvPreviewDrawerProps = {
  mode?: "create" | "edit";
  existingId?: string;
  data?: ConfirmationVoucherFormData | null;
};

export function CvPreviewDrawer({
  mode = "create",
  existingId,
  data,
}: CvPreviewDrawerProps) {
  const previewOpen = useCvStore((s) => s.previewOpen);
  const closePreview = useCvStore((s) => s.closePreview);
  const storeDraft = useCvStore((s) => s.draft);

  const draft = data ?? storeDraft;

  const saveMutation = useSaveConfirmationVoucher();
  const updateMutation = useUpdateConfirmationVoucher(existingId ?? "");
  const company = useCompanyStore((s) => s.company);
  useCompanySettings();
  const [downloading, setDownloading] = React.useState(false);

  const handleDownload = async () => {
    if (!draft) return;
    try {
      setDownloading(true);
      await downloadCvPdf(draft, company);
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
          ? "Confirmation voucher updated successfully!"
          : "Confirmation voucher saved successfully!"
      );
      closePreview();
    };
    const onError = () => {
      toast.error("Failed to save the confirmation voucher.");
    };
    if (mode === "edit") {
      updateMutation.mutate(draft, { onSuccess, onError });
    } else {
      saveMutation.mutate(draft, { onSuccess, onError });
    }
  };

  return (
    <Drawer direction="right" open={previewOpen} onOpenChange={(open) => !open && closePreview()}>
      <DrawerContent className="w-[70%] max-w-full rounded-none border-l">
        <div className="flex flex-col h-full">
          <DrawerHeader className="flex flex-row items-start justify-between gap-4 border-b">
            <div className="flex flex-col gap-1">
              <DrawerTitle>Preview Confirmation Voucher</DrawerTitle>
              <DrawerDescription>
                This is how the voucher will look with the current data.
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
                <ConfirmationVoucher data={draft} company={company} />
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                Fill in the voucher details to see the preview.
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
              {isPending ? "Saving..." : "Save Voucher"}
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
