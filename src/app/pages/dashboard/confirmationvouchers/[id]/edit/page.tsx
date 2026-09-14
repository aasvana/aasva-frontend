"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useConfirmationVoucher } from "@/lib/cv-query";
import { ConfirmationVoucherForm } from "@/components/cv/confirmation-voucher-form";

export default function EditConfirmationVoucher() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: voucher, isLoading } = useConfirmationVoucher(params?.id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-sm text-gray-500">
        Loading...
      </div>
    );
  }

  if (!voucher) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <p className="text-lg font-medium text-gray-800">
          Confirmation voucher not found
        </p>
        <p className="text-sm text-gray-500">
          The voucher may have been deleted.
        </p>
        <Button onClick={() => router.push("/dashboard/confirmation-vouchers")}>
          Back to list
        </Button>
      </div>
    );
  }

  return (
    <ConfirmationVoucherForm
      mode="edit"
      existingId={voucher.id}
      defaultValues={voucher.data}
    />
  );
}