"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useForm,
  FormProvider,
  FieldErrors,
  DefaultValues,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon, EyeIcon, SaveIcon } from "lucide-react";
import { usePurchaseOrderDraftStore } from "./store";
import { useSavePurchaseOrder, useUpdatePurchaseOrder } from "./query";
import {
  purchaseOrderSchema,
  PurchaseOrderFormData,
  mergePurchaseOrderDefaults,
  normalizePurchaseOrderData,
  nextPurchaseOrderNo,
} from "./schema";
import {
  PurchaseOrderHeaderFields,
  CompanySection,
  PartiesSection,
  LineItemsSection,
  NotesSection,
} from "./steps";
import { PurchaseOrderPreviewDrawer } from "./preview-drawer";
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  toast,
} from "./ui";

type PurchaseOrderFormProps = {
  mode: "create" | "edit";
  existingId?: string;
  defaultValues?: DefaultValues<PurchaseOrderFormData>;
};

export const createPurchaseOrderDefaults: DefaultValues<PurchaseOrderFormData> =
  {
    poNo: nextPurchaseOrderNo(),
    issueDate: new Date(),
    deliveryDate: new Date(),
    status: "draft",
    currency: "USD",
    vendor: { name: "", company: "", email: "", phone: "", address: "" },
    shipTo: { name: "", company: "", email: "", phone: "", address: "" },
    sameAsBilling: true,
    includeCompany: false,
    items: [{ description: "", qty: 1, rate: 0, taxRate: 0 }],
    discountType: "none",
    discountValue: 0,
    notes: "",
    terms: "",
  };

export function PurchaseOrderForm({
  mode,
  existingId,
  defaultValues,
}: PurchaseOrderFormProps) {
  const router = useRouter();
  const [previewData, setPreviewData] = useState<PurchaseOrderFormData | null>(
    null
  );

  const setDraft = usePurchaseOrderDraftStore((s) => s.setDraft);
  const clearDraft = usePurchaseOrderDraftStore((s) => s.clearDraft);
  const openPreview = usePurchaseOrderDraftStore((s) => s.openPreview);

  const saveMutation = useSavePurchaseOrder();
  const updateMutation = useUpdatePurchaseOrder(existingId ?? "");

  const methods = useForm<PurchaseOrderFormData>({
    resolver: zodResolver(purchaseOrderSchema),
    mode: "onChange",
    defaultValues: defaultValues
      ? mergePurchaseOrderDefaults(
          defaultValues as Partial<PurchaseOrderFormData>
        )
      : createPurchaseOrderDefaults,
  });

  useEffect(() => {
    if (mode !== "create") return;

    const draft = usePurchaseOrderDraftStore.getState().draft;
    if (draft) {
      methods.reset(mergePurchaseOrderDefaults(draft));
    }
    const subscription = methods.watch((values) => {
      setDraft(values as PurchaseOrderFormData);
    });
    return () => subscription.unsubscribe();
  }, [methods, setDraft, mode]);

  const showValidationError = (errors: FieldErrors<PurchaseOrderFormData>) => {
    const firstError = Object.values(errors)[0];
    const message =
      firstError && "message" in firstError
        ? (firstError.message as string)
        : "Please fill in all required fields";
    toast.error(message);
  };

  const handleSave = () => {
    methods.handleSubmit((data) => {
      const normalized = normalizePurchaseOrderData(data);
      if (mode === "edit") {
        updateMutation.mutate(normalized, {
          onSuccess: () => toast.success("Purchase order updated successfully!"),
          onError: () => toast.error("Failed to update the purchase order."),
        });
      } else {
        saveMutation.mutate(normalized, {
          onSuccess: () => toast.success("Purchase order saved successfully!"),
          onError: () => toast.error("Failed to save the purchase order."),
        });
      }
    }, showValidationError)();
  };

  const handleFinish = () => {
    methods.handleSubmit((data) => {
      const normalized = normalizePurchaseOrderData(data);
      const onSuccess = (record?: { id: string }) => {
        if (!record) {
          toast.error(
            mode === "edit"
              ? "Could not update the purchase order."
              : "Could not save the purchase order."
          );
          return;
        }
        if (mode === "create") {
          clearDraft();
          toast.success("Purchase order created successfully!");
        } else {
          toast.success("Purchase order updated successfully!");
        }
        router.push(`/dashboard/purchase-orders/${record.id}/view`);
      };
      const onError = () => {
        toast.error(
          mode === "edit"
            ? "Failed to update the purchase order."
            : "Failed to save the purchase order."
        );
      };

      if (mode === "edit") {
        updateMutation.mutate(normalized, { onSuccess, onError });
      } else {
        saveMutation.mutate(normalized, { onSuccess, onError });
      }
    }, showValidationError)();
  };

  const handlePreview = () => {
    setPreviewData(
      normalizePurchaseOrderData(methods.getValues() as PurchaseOrderFormData)
    );
    openPreview();
  };

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col">
        <div className="flex flex-row items-center justify-between border-b pb-4 gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeftIcon className="size-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">
            {mode === "edit" ? "Edit Purchase Order" : "New Purchase Order"}
          </h1>
          <div className="flex items-center gap-2 md:mx-6">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleSave}
                    className="bg-emerald-600 text-white shadow-sm hover:bg-emerald-700"
                  >
                    <SaveIcon className="shrink-0 size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {mode === "edit"
                      ? "Update Purchase Order"
                      : "Save Purchase Order"}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" onClick={handlePreview}>
                    <EyeIcon className="shrink-0 size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Preview Purchase Order</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div className="flex flex-col gap-6 p-4 md:px-6 md:py-6">
          <PurchaseOrderHeaderFields />
          <CompanySection />
          <PartiesSection />
          <LineItemsSection />
          <NotesSection />
        </div>

        <div className="sticky bottom-0 flex items-center justify-end gap-3 border-t bg-white/95 px-6 py-4 backdrop-blur">
          <Button variant="outline" onClick={handlePreview}>
            <EyeIcon className="size-4" />
            Preview
          </Button>
          <Button onClick={handleFinish}>
            {mode === "edit" ? "Update Purchase Order" : "Save Purchase Order"}
          </Button>
        </div>
      </div>
      <PurchaseOrderPreviewDrawer
        mode={mode}
        existingId={existingId}
        data={previewData}
      />
    </FormProvider>
  );
}
