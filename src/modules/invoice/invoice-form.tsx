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
import { useInvoiceDraftStore } from "./store";
import { useSaveInvoice, useUpdateInvoice } from "./query";
import {
  invoiceSchema,
  InvoiceFormData,
  normalizeInvoiceData,
  mergeInvoiceDefaults,
  COMPANY_DEFAULTS,
  BANK_DEFAULTS,
} from "./schema";
import {
  InvoiceHeaderFields,
  CompanySection,
  PartiesSection,
  LineItemsSection,
  PaymentSection,
} from "./steps";
import { InvoicePreviewDrawer } from "./invoice-preview-drawer";
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  toast,
} from "./ui";

type InvoiceFormProps = {
  mode: "create" | "edit";
  existingId?: string;
  defaultValues?: DefaultValues<InvoiceFormData>;
};

export const createInvoiceDefaults: DefaultValues<InvoiceFormData> = {
  invoiceNo: "",
  issueDate: new Date(),
  dueDate: new Date(),
  status: "draft",
  currency: "USD",
  billTo: { name: "", company: "", email: "", phone: "", address: "" },
  shipTo: { name: "", company: "", email: "", phone: "", address: "" },
  sameAsBilling: true,
  items: [{ description: "", qty: 1, rate: 0, taxRate: 0 }],
  discountType: "none",
  discountValue: 0,
  includeCompany: false,
  company: { ...COMPANY_DEFAULTS },
  paymentMode: "bank_transfer",
  paidAmount: 0,
  notes: "",
  terms: "",
  bank: { ...BANK_DEFAULTS },
};

export function InvoiceForm({
  mode,
  existingId,
  defaultValues,
}: InvoiceFormProps) {
  const router = useRouter();
  const [previewData, setPreviewData] = useState<InvoiceFormData | null>(null);

  const setDraft = useInvoiceDraftStore((s) => s.setDraft);
  const clearDraft = useInvoiceDraftStore((s) => s.clearDraft);
  const openPreview = useInvoiceDraftStore((s) => s.openPreview);

  const saveMutation = useSaveInvoice();
  const updateMutation = useUpdateInvoice(existingId ?? "");

  const methods = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    mode: "onChange",
    defaultValues: defaultValues
      ? mergeInvoiceDefaults(defaultValues as Partial<InvoiceFormData>)
      : createInvoiceDefaults,
  });

  useEffect(() => {
    if (mode !== "create") return;

    const draft = useInvoiceDraftStore.getState().draft;
    if (draft) {
      methods.reset(mergeInvoiceDefaults(draft));
    }
    const subscription = methods.watch((values) => {
      setDraft(values as InvoiceFormData);
    });
    return () => subscription.unsubscribe();
  }, [methods, setDraft, mode]);

  const showValidationError = (errors: FieldErrors<InvoiceFormData>) => {
    const firstError = Object.values(errors)[0];
    const message =
      firstError && "message" in firstError
        ? (firstError.message as string)
        : "Please fill in all required fields";
    toast.error(message);
  };

  const handleSave = () => {
    methods.handleSubmit((data) => {
      const normalized = normalizeInvoiceData(data);
      if (mode === "edit") {
        updateMutation.mutate(normalized, {
          onSuccess: () => toast.success("Invoice updated successfully!"),
          onError: () => toast.error("Failed to update the invoice."),
        });
      } else {
        saveMutation.mutate(normalized, {
          onSuccess: () => toast.success("Invoice saved successfully!"),
          onError: () => toast.error("Failed to save the invoice."),
        });
      }
    }, showValidationError)();
  };

  const handleFinish = () => {
    methods.handleSubmit((data) => {
      const normalized = normalizeInvoiceData(data);
      const onSuccess = (record?: { id: string }) => {
        if (!record) {
          toast.error(
            mode === "edit" ? "Could not update the invoice." : "Could not save the invoice."
          );
          return;
        }
        if (mode === "create") {
          clearDraft();
          toast.success("Invoice created successfully!");
        } else {
          toast.success("Invoice updated successfully!");
        }
        router.push(`/dashboard/invoices/${record.id}/view`);
      };
      const onError = () => {
        toast.error(
          mode === "edit" ? "Failed to update the invoice." : "Failed to save the invoice."
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
      normalizeInvoiceData(methods.getValues() as InvoiceFormData)
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
            {mode === "edit" ? "Edit Invoice" : "New Invoice"}
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
                  <p>{mode === "edit" ? "Update Invoice" : "Save Invoice"}</p>
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
                  <p>Preview Invoice</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div className="flex flex-col gap-6 p-4 md:px-6 md:py-6">
          <InvoiceHeaderFields />
          <CompanySection />
          <PartiesSection />
          <LineItemsSection />
          <PaymentSection />
        </div>

        <div className="sticky bottom-0 flex items-center justify-end gap-3 border-t bg-white/95 px-6 py-4 backdrop-blur">
          <Button variant="outline" onClick={handlePreview}>
            <EyeIcon className="size-4" />
            Preview
          </Button>
          <Button onClick={handleFinish}>
            {mode === "edit" ? "Update Invoice" : "Save Invoice"}
          </Button>
        </div>
      </div>
      <InvoicePreviewDrawer
        mode={mode}
        existingId={existingId}
        data={previewData}
      />
    </FormProvider>
  );
}
