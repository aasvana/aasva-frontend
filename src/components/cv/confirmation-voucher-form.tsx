"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider, FieldErrors, DefaultValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { EyeIcon, SaveIcon } from "lucide-react";
import BackButton from "@/components/generic/back-button";
import { getSteps } from "@/app/pages/dashboard/confirmationvouchers/steps";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { notify } from "@/lib/notify";
import { CvPreviewDrawer } from "@/components/cv/cv-preview-drawer";
import { useCvStore } from "@/stores/useCvStore";
import { useCvConfigStore } from "@/stores/cvConfigStore";
import {
  useConfirmationVouchers,
  useSaveConfirmationVoucher,
  useUpdateConfirmationVoucher,
} from "@/lib/cv-query";
import {
  confirmationVoucherSchema,
  ConfirmationVoucherFormData,
  getVoucherDateIssues,
  stepFieldMap,
} from "@/app/pages/dashboard/confirmationvouchers/schema";
import { TermSnapshot } from "@/lib/terms-api";

type ConfirmationVoucherFormProps = {
  mode: "create" | "edit";
  existingId?: string;
  defaultValues?: DefaultValues<ConfirmationVoucherFormData>;
  savedTerms?: TermSnapshot[];
};

export const createConfirmationVoucherDefaults: DefaultValues<ConfirmationVoucherFormData> = {
  packageName: "",
  packageId: undefined,
  customerTitle: "",
  customerName: "",
  mobileNo: "",
  emailAddress: "",
  companyName: "",
  agentName: "",
  numberOfPersons: "2",
  numberOfTourDays: "1",
  boardingAirline: "",
  boardingFrom: "",
  boardingTo: "",
  boardingDepartureTime: "",
  boardingArrivalTime: "",
  returnAirline: "",
  returnFrom: "",
  returnTo: "",
  returnDepartureTime: "",
  returnArrivalTime: "",
  travellers: [
    { name: "", age: "", gender: "male" },
    { name: "", age: "", gender: "female" },
  ],
  hotels: [
    {
      destination: "",
      hotelName: "",
      mealType: "",
      room: "",
      roomCategory: "",
      maxOccupancy: "",
      adults: "",
      children: "",
      extraMattress: "",
      checkinDate: new Date(),
      checkoutDate: new Date(),
    },
  ],
  packageIncluded: "",
  packageExcluded: "",
  itineraries: [{ date: new Date(), subject: "", itinerary: "" }],
  checkinTime: "",
  checkoutTime: "",
  smokingPolicy: "",
  consumptionOfLiquor: "",
  assistanceName: "",
  assistancePhone: "",
  supportName: "",
  supportPhone: "",
  emergencyName: "",
  emergencyPhone: "",
  voucherNo: "",
  bookingDate: new Date(),
  totalAmount: "",
  paymentType: "",
  amountReceived: "",
  amountBalanced: "",
};

export function ConfirmationVoucherForm({
  mode,
  existingId,
  defaultValues,
  savedTerms,
}: ConfirmationVoucherFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [previewData, setPreviewData] =
    useState<ConfirmationVoucherFormData | null>(null);
  const [createdId, setCreatedId] = useState<string | undefined>(undefined);

  const setDraft = useCvStore((s) => s.setDraft);
  const clearDraft = useCvStore((s) => s.clearDraft);
  const openPreview = useCvStore((s) => s.openPreview);

  const effectiveId = mode === "edit" ? existingId : createdId;
  const effectiveMode = effectiveId ? "edit" : mode;

  const saveMutation = useSaveConfirmationVoucher();
  const updateMutation = useUpdateConfirmationVoucher(effectiveId ?? "");

  const { data: vouchersData, isLoading: vouchersLoading } =
    useConfirmationVouchers({ limit: 1000, sortBy: "updatedAt", sortOrder: "desc" });
  const existingVouchers = useMemo(() => vouchersData?.items ?? [], [vouchersData]);
  const initializedRef = useRef(false);

  const methods = useForm<ConfirmationVoucherFormData>({
    resolver: zodResolver(confirmationVoucherSchema),
    mode: "onChange",
    defaultValues: defaultValues ?? createConfirmationVoucherDefaults,
  });

  const steps = getSteps();

  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  useEffect(() => {
    if (mode !== "create") return;
    if (vouchersLoading) return;

    if (!initializedRef.current) {
      initializedRef.current = true;
      const config = useCvConfigStore.getState();
      const existing = existingVouchers;
      const { voucherPrefix, voucherSuffix, defaultPaymentType } =
        config.settings;

      let nextNumber = existing.length + 1;
      if (voucherPrefix || voucherSuffix) {
        const numbers = existing
          .map((v) => v.voucherNo)
          .filter((no) => {
            const inner = no.slice(
              voucherPrefix.length,
              no.length - voucherSuffix.length
            );
            return (
              no.startsWith(voucherPrefix) &&
              no.endsWith(voucherSuffix) &&
              /^\d+$/.test(inner)
            );
          })
          .map((no) =>
            Number(no.slice(voucherPrefix.length, no.length - voucherSuffix.length))
          );
        if (numbers.length > 0) nextNumber = Math.max(...numbers) + 1;
      }

      const general: Partial<ConfirmationVoucherFormData> = {};
      for (const detail of config.generalDetails) {
        if (detail.value) {
          (general as Record<string, unknown>)[detail.key] = detail.value;
        }
      }

      methods.reset({
        ...createConfirmationVoucherDefaults,
        ...general,
        bookingDate: new Date(),
        paymentType: defaultPaymentType,
        voucherNo: `${voucherPrefix}${nextNumber}${voucherSuffix}`,
      });
    }
    const subscription = methods.watch((values) => {
      setDraft(values as ConfirmationVoucherFormData);
    });
    return () => subscription.unsubscribe();
  }, [methods, setDraft, mode, vouchersLoading, existingVouchers]);

  const showValidationError = (
    errors: FieldErrors<ConfirmationVoucherFormData>
  ) => {
    const firstError = Object.values(errors)[0];
    const message =
      firstError && "message" in firstError
        ? (firstError.message as string)
        : "Please fill in all required fields";
    toast.error(message);
  };

  const handleSave = () => {
    const data = methods.getValues() as ConfirmationVoucherFormData;
    if (!data.customerName?.trim()) {
      toast.error("Customer name is required to save a draft.");
      methods.setFocus("customerName");
      return;
    }
    const dateError = getVoucherDateIssues(data)[0];
    if (dateError) {
      toast.error(dateError.message);
      return;
    }
    if (effectiveMode === "edit") {
      updateMutation.mutate(data, {
        onSuccess: () => {
          toast.success("Confirmation voucher updated successfully!");
        },
        onError: (error) => {
          toast.error(error.message || "Failed to update the confirmation voucher.");
        },
      });
    } else {
      saveMutation.mutate(data, {
        onSuccess: (record) => {
          setCreatedId(record.id);
          toast.success("Confirmation voucher saved successfully!");
        },
        onError: (error) => {
          toast.error(error.message || "Failed to save the confirmation voucher.");
        },
      });
    }
  };

  const handleFinish = () => {
    methods.handleSubmit((data) => {
      const onSuccess = (record?: { id: string }) => {
        if (!record) {
          toast.error(
            effectiveMode === "edit"
              ? "Could not update the confirmation voucher."
              : "Could not save the confirmation voucher."
          );
          return;
        }
        if (effectiveMode === "create") {
          clearDraft();
          notify({
            type: "success",
            category: "travel",
            title: "Confirmation voucher created",
            message: `Voucher ${data.voucherNo} has been created.`,
            customer: data.customerName,
            link: `/dashboard/confirmation-vouchers/${record.id}/view`,
          });
        } else {
          notify({
            type: "info",
            category: "travel",
            title: "Confirmation voucher updated",
            message: `Voucher ${data.voucherNo} was updated.`,
          });
        }
        router.push(`/dashboard/confirmation-vouchers/${record.id}/view`);
      };
      const onError = (error: Error) => {
        toast.error(
          error.message ||
            (effectiveMode === "edit"
              ? "Failed to update the confirmation voucher."
              : "Failed to save the confirmation voucher.")
        );
      };

      if (effectiveMode === "edit") {
        updateMutation.mutate(data, { onSuccess, onError });
      } else {
        saveMutation.mutate(data, { onSuccess, onError });
      }
    }, showValidationError)();
  };

  const handlePreview = () => {
    setPreviewData(methods.getValues() as ConfirmationVoucherFormData);
    openPreview();
  };

  const handleNext = async () => {
    const fields = stepFieldMap[currentStep] as any[];
    const isValid = await methods.trigger(fields);
    if (!isValid) {
      const currentErrors = methods.formState.errors;
      const firstError = Object.values(currentErrors)[0];
      const message =
        firstError && "message" in firstError
          ? (firstError.message as string)
          : "Please fill in all required fields";
      toast.error(message);
      return;
    }
    setCurrentStep((prev) => prev + 1);
  };

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col">
        <div className="flex flex-row items-center justify-between border-b pb-4 gap-4">
          <BackButton />
          <h1 className="text-2xl font-bold">{steps[currentStep].title}</h1>
          <div className="flex items-center gap-2">
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
                    {effectiveMode === "edit"
                      ? "Update Confirmation Voucher"
                      : "Save Confirmation Voucher"}
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
                  <p>Preview Confirmation Voucher</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div className="flex flex-col p-4 md:px-6 md:py-4">
          <div className="flex justify-center gap-2 mb-6">
            <ul className="flex justify-center items-center w-full max-w-3xl mx-auto">
              {steps.map((_, index) => {
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;

                return (
                  <li key={index} className="flex items-center flex-1">
                    <div
                      className={`z-10 size-7 flex justify-center items-center rounded-full font-medium 
                    ${
                      isCompleted
                        ? "bg-emerald-500 text-white"
                        : isActive
                        ? "bg-emerald-600 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                    >
                      {!isCompleted ? (
                        index + 1
                      ) : (
                        <svg
                          className="size-3"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>

                    {index < steps.length - 1 && (
                      <div
                        className={`flex-1 h-0.5 mx-2 
                      ${isCompleted ? "bg-emerald-500" : "bg-gray-200"}`}
                      />
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="h-[460px] w-full flex items-center justify-center">
            <div className="min-h-[300px] max-h-[460px] w-full overflow-auto rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm sm:p-6 dark:bg-neutral-800 dark:border-neutral-700">
              {steps[currentStep].content}
            </div>
          </div>
          <div className="mt-6 flex justify-between">
            <Button
              variant="outline"
              disabled={isFirstStep}
              onClick={() => setCurrentStep((prev) => prev - 1)}
            >
              Back
            </Button>

            {!isLastStep ? (
              <Button onClick={handleNext}>Next</Button>
            ) : (
              <Button onClick={handleFinish}>
                {effectiveMode === "edit" ? "Update" : "Finish"}
              </Button>
            )}
          </div>
        </div>
      </div>
      <CvPreviewDrawer
        mode={effectiveMode}
        existingId={effectiveId}
        data={previewData}
        savedTerms={savedTerms}
        onSaved={(id) => setCreatedId(id)}
      />
    </FormProvider>
  );
}
