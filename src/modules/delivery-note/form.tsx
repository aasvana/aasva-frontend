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
import { useDeliveryNoteDraftStore } from "./store";
import { useSaveDeliveryNote, useUpdateDeliveryNote } from "./query";
import {
  deliveryNoteSchema,
  DeliveryNoteFormData,
  mergeDeliveryNoteDefaults,
  nextDeliveryNoteNo,
} from "./schema";
import {
  DeliveryNoteHeaderFields,
  CompanySection,
  DeliverToSection,
  LineItemsSection,
  NotesSection,
} from "./steps";
import { DeliveryNotePreviewDrawer } from "./preview-drawer";
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  toast,
} from "./ui";

type DeliveryNoteFormProps = {
  mode: "create" | "edit";
  existingId?: string;
  defaultValues?: DefaultValues<DeliveryNoteFormData>;
};

export const createDeliveryNoteDefaults: DefaultValues<DeliveryNoteFormData> = {
  dnNo: nextDeliveryNoteNo(),
  issueDate: new Date(),
  status: "draft",
  currency: "USD",
  reference: "",
  deliverTo: { name: "", company: "", email: "", phone: "", address: "" },
  includeCompany: false,
  items: [{ description: "", qty: 1, rate: 0, taxRate: 0 }],
  discountType: "none",
  discountValue: 0,
  notes: "",
  terms: "",
};

export function DeliveryNoteForm({
  mode,
  existingId,
  defaultValues,
}: DeliveryNoteFormProps) {
  const router = useRouter();
  const [previewData, setPreviewData] = useState<DeliveryNoteFormData | null>(
    null
  );

  const setDraft = useDeliveryNoteDraftStore((s) => s.setDraft);
  const clearDraft = useDeliveryNoteDraftStore((s) => s.clearDraft);
  const openPreview = useDeliveryNoteDraftStore((s) => s.openPreview);

  const saveMutation = useSaveDeliveryNote();
  const updateMutation = useUpdateDeliveryNote(existingId ?? "");

  const methods = useForm<DeliveryNoteFormData>({
    resolver: zodResolver(deliveryNoteSchema),
    mode: "onChange",
    defaultValues: defaultValues
      ? mergeDeliveryNoteDefaults(defaultValues as Partial<DeliveryNoteFormData>)
      : createDeliveryNoteDefaults,
  });

  useEffect(() => {
    if (mode !== "create") return;

    const draft = useDeliveryNoteDraftStore.getState().draft;
    if (draft) {
      methods.reset(mergeDeliveryNoteDefaults(draft));
    }
    const subscription = methods.watch((values) => {
      setDraft(values as DeliveryNoteFormData);
    });
    return () => subscription.unsubscribe();
  }, [methods, setDraft, mode]);

  const showValidationError = (errors: FieldErrors<DeliveryNoteFormData>) => {
    const firstError = Object.values(errors)[0];
    const message =
      firstError && "message" in firstError
        ? (firstError.message as string)
        : "Please fill in all required fields";
    toast.error(message);
  };

  const handleSave = () => {
    methods.handleSubmit((data) => {
      if (mode === "edit") {
        updateMutation.mutate(data, {
          onSuccess: () => toast.success("Delivery note updated successfully!"),
          onError: () => toast.error("Failed to update the delivery note."),
        });
      } else {
        saveMutation.mutate(data, {
          onSuccess: () => toast.success("Delivery note saved successfully!"),
          onError: () => toast.error("Failed to save the delivery note."),
        });
      }
    }, showValidationError)();
  };

  const handleFinish = () => {
    methods.handleSubmit((data) => {
      const onSuccess = (record?: { id: string }) => {
        if (!record) {
          toast.error(
            mode === "edit"
              ? "Could not update the delivery note."
              : "Could not save the delivery note."
          );
          return;
        }
        if (mode === "create") {
          clearDraft();
          toast.success("Delivery note created successfully!");
        } else {
          toast.success("Delivery note updated successfully!");
        }
        router.push(`/dashboard/delivery-notes/${record.id}/view`);
      };
      const onError = () => {
        toast.error(
          mode === "edit"
            ? "Failed to update the delivery note."
            : "Failed to save the delivery note."
        );
      };

      if (mode === "edit") {
        updateMutation.mutate(data, { onSuccess, onError });
      } else {
        saveMutation.mutate(data, { onSuccess, onError });
      }
    }, showValidationError)();
  };

  const handlePreview = () => {
    setPreviewData(methods.getValues() as DeliveryNoteFormData);
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
            {mode === "edit" ? "Edit Delivery Note" : "New Delivery Note"}
          </h1>
          <div className="flex items-center gap-2 md:mx-6">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" onClick={handleSave}>
                    <SaveIcon className="shrink-0 size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {mode === "edit" ? "Update Delivery Note" : "Save Delivery Note"}
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
                  <p>Preview Delivery Note</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div className="flex flex-col gap-6 p-4 md:px-6 md:py-6">
          <DeliveryNoteHeaderFields />
          <CompanySection />
          <DeliverToSection />
          <LineItemsSection />
          <NotesSection />
        </div>

        <div className="sticky bottom-0 flex items-center justify-end gap-3 border-t bg-white/95 px-6 py-4 backdrop-blur">
          <Button variant="outline" onClick={handlePreview}>
            <EyeIcon className="size-4" />
            Preview
          </Button>
          <Button onClick={handleFinish}>
            {mode === "edit" ? "Update Delivery Note" : "Save Delivery Note"}
          </Button>
        </div>
      </div>
      <DeliveryNotePreviewDrawer
        mode={mode}
        existingId={existingId}
        data={previewData}
      />
    </FormProvider>
  );
}
