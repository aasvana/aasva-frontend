import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { useFormContext } from "react-hook-form";
import { ConfirmationVoucherFormData } from "../schema";

const GeneralDetails = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<ConfirmationVoucherFormData>();

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="grid gap-1.5">
          <Label htmlFor="checkinTime">Checkin Time</Label>
          <Input
            type="time"
            id="checkinTime"
            className="bg-gray-50"
            aria-invalid={!!errors.checkinTime}
            {...register("checkinTime")}
          />
          {errors.checkinTime && (
            <p className="text-sm text-red-500">{errors.checkinTime.message}</p>
          )}
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="checkoutTime">Checkout Time</Label>
          <Input
            type="time"
            id="checkoutTime"
            className="bg-gray-50"
            aria-invalid={!!errors.checkoutTime}
            {...register("checkoutTime")}
          />
          {errors.checkoutTime && (
            <p className="text-sm text-red-500">{errors.checkoutTime.message}</p>
          )}
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="smokingPolicy">Smoking Policy</Label>
          <Input
            type="text"
            id="smokingPolicy"
            placeholder="As per the hotel policy"
            className="bg-gray-50"
            aria-invalid={!!errors.smokingPolicy}
            {...register("smokingPolicy")}
          />
          {errors.smokingPolicy && (
            <p className="text-sm text-red-500">{errors.smokingPolicy.message}</p>
          )}
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="consumptionOfLiquor">Consumption of Liquor</Label>
          <Input
            type="text"
            id="consumptionOfLiquor"
            placeholder="As per the hotel policy"
            className="bg-gray-50"
            aria-invalid={!!errors.consumptionOfLiquor}
            {...register("consumptionOfLiquor")}
          />
          {errors.consumptionOfLiquor && (
            <p className="text-sm text-red-500">
              {errors.consumptionOfLiquor.message}
            </p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        <div className="grid gap-1.5">
          <Label>Assistance</Label>
          <div className="flex flex-col items-center gap-6">
            <div className="w-full">
              <Input
                type="text"
                placeholder="John Doe"
                className="bg-gray-50"
                aria-invalid={!!errors.assistanceName}
                {...register("assistanceName")}
              />
              {errors.assistanceName && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.assistanceName.message}
                </p>
              )}
            </div>
            <div className="w-full">
              <Input
                type="text"
                placeholder="9876543210"
                className="bg-gray-50"
                maxLength={10}
                aria-invalid={!!errors.assistancePhone}
                {...register("assistancePhone")}
              />
              {errors.assistancePhone && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.assistancePhone.message}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="grid gap-1.5">
          <Label>Support</Label>
          <div className="flex flex-col items-center gap-6">
            <div className="w-full">
              <Input
                type="text"
                placeholder="John Doe"
                className="bg-gray-50"
                aria-invalid={!!errors.supportName}
                {...register("supportName")}
              />
              {errors.supportName && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.supportName.message}
                </p>
              )}
            </div>
            <div className="w-full">
              <Input
                type="text"
                placeholder="9876543210"
                className="bg-gray-50"
                maxLength={10}
                aria-invalid={!!errors.supportPhone}
                {...register("supportPhone")}
              />
              {errors.supportPhone && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.supportPhone.message}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="grid gap-1.5">
          <Label>Emergency</Label>
          <div className="flex flex-col items-center gap-6">
            <div className="w-full">
              <Input
                type="text"
                placeholder="John Doe"
                className="bg-gray-50"
                aria-invalid={!!errors.emergencyName}
                {...register("emergencyName")}
              />
              {errors.emergencyName && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.emergencyName.message}
                </p>
              )}
            </div>
            <div className="w-full">
              <Input
                type="text"
                placeholder="9876543210"
                className="bg-gray-50"
                maxLength={10}
                aria-invalid={!!errors.emergencyPhone}
                {...register("emergencyPhone")}
              />
              {errors.emergencyPhone && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.emergencyPhone.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralDetails;
