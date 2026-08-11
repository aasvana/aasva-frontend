"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { paymentTypes } from "@/constants/paymentTypes";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { ConfirmationVoucherFormData } from "../schema";

const OfficialDetails = () => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<ConfirmationVoucherFormData>();

  const bookingDate = watch("bookingDate");
  const paymentType = watch("paymentType");
  const totalAmount = watch("totalAmount");
  const amountReceived = watch("amountReceived");

  useEffect(() => {
    const total = Number(totalAmount);
    const received = Number(amountReceived);

    if (
      totalAmount === "" ||
      amountReceived === "" ||
      isNaN(total) ||
      isNaN(received)
    ) {
      setValue("amountBalanced", "", { shouldValidate: true });
      return;
    }

    setValue("amountBalanced", String(total - received), {
      shouldValidate: true,
    });
  }, [totalAmount, amountReceived, setValue]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="grid gap-1.5">
        <Label htmlFor="voucherNo">Voucher No.</Label>
        <Input
          type="text"
          id="voucherNo"
          placeholder="Xmerge/Kol/A/001"
          className="bg-white"
          aria-invalid={!!errors.voucherNo}
          {...register("voucherNo")}
        />
        {errors.voucherNo && (
          <p className="text-sm text-red-500">{errors.voucherNo.message}</p>
        )}
      </div>
      <div className="grid gap-1.5">
        <Label>Booking Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`w-full justify-start text-left font-normal ${
                errors.bookingDate ? "border-red-500" : ""
              }`}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {bookingDate ? (
                format(new Date(bookingDate), "PPP")
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={bookingDate ? new Date(bookingDate) : undefined}
              onSelect={(day) =>
                setValue("bookingDate", day as Date, { shouldValidate: true })
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {errors.bookingDate && (
          <p className="text-sm text-red-500">{errors.bookingDate.message}</p>
        )}
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="totalAmount">Total Amount</Label>
        <Input
          type="number"
          id="totalAmount"
          placeholder="2450"
          className="bg-white"
          aria-invalid={!!errors.totalAmount}
          {...register("totalAmount")}
        />
        {errors.totalAmount && (
          <p className="text-sm text-red-500">{errors.totalAmount.message}</p>
        )}
      </div>
      <div className="grid gap-1.5">
        <Label>Payment Type</Label>
        <Select
          value={paymentType}
          onValueChange={(value) =>
            setValue("paymentType", value, { shouldValidate: true })
          }
        >
          <SelectTrigger
            className={`w-full bg-white ${
              errors.paymentType ? "border-red-500" : ""
            }`}
          >
            <SelectValue placeholder="Select payment type" />
          </SelectTrigger>
          <SelectContent>
            {paymentTypes.map((pt) => (
              <SelectItem key={pt.code} value={pt.name}>
                {pt.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.paymentType && (
          <p className="text-sm text-red-500">{errors.paymentType.message}</p>
        )}
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="amountReceived">Amount Received</Label>
        <Input
          type="number"
          id="amountReceived"
          placeholder="2450"
          className="bg-white"
          aria-invalid={!!errors.amountReceived}
          {...register("amountReceived")}
        />
        {errors.amountReceived && (
          <p className="text-sm text-red-500">{errors.amountReceived.message}</p>
        )}
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="amountBalanced">Amount Balanced</Label>
        <Input
          type="number"
          id="amountBalanced"
          placeholder="0"
          readOnly
          className="bg-white"
          aria-invalid={!!errors.amountBalanced}
          {...register("amountBalanced")}
        />
        {errors.amountBalanced && (
          <p className="text-sm text-red-500">{errors.amountBalanced.message}</p>
        )}
      </div>
    </div>
  );
};

export default OfficialDetails;
