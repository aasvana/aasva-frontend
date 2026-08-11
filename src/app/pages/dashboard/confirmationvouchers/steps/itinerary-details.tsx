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
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { ConfirmationVoucherFormData } from "../schema";

const ItineraryDetails = () => {
  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<ConfirmationVoucherFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "itineraries",
  });

  const itinerariesValues = watch("itineraries");

  const handleAddItinerary = () => {
    append({ date: new Date(), subject: "", itinerary: "" });
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button variant="outline" onClick={handleAddItinerary}>
          Add New Itinerary
        </Button>
      </div>

      {errors.itineraries?.root && (
        <p className="text-sm text-red-500 mb-2">
          {errors.itineraries.root.message}
        </p>
      )}

      {fields.map((field, index) => {
        const itineraryData = itinerariesValues?.[index];

        return (
          <div
            key={field.id}
            className="relative grid grid-cols-1 gap-4 border rounded-md p-4 mb-4"
          >
            {index !== 0 && (
              <button
                type="button"
                onClick={() => remove(index)}
                className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <div className="grid grid-cols-3">
              <div className="grid gap-1.5">
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`h-12 w-full justify-start rounded-xl border bg-gray-50 px-4 text-left text-[15px] font-normal focus-visible:border-emerald-400 focus-visible:ring-emerald-100 ${
                        errors.itineraries?.[index]?.date ? "border-red-500" : "border-gray-200"
                      }`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {itineraryData?.date ? (
                        format(new Date(itineraryData.date), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={
                        itineraryData?.date
                          ? new Date(itineraryData.date)
                          : undefined
                      }
                      onSelect={(day) =>
                        setValue(`itineraries.${index}.date`, day as Date, {
                          shouldValidate: true,
                        })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.itineraries?.[index]?.date && (
                  <p className="text-sm text-red-500">
                    {errors.itineraries[index]?.date?.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label>Subject</Label>
              <Input
                type="text"
                placeholder="Local Sightseeing Tour"
                className="bg-gray-50"
                aria-invalid={!!errors.itineraries?.[index]?.subject}
                {...control.register(`itineraries.${index}.subject`)}
              />
              {errors.itineraries?.[index]?.subject && (
                <p className="text-sm text-red-500">
                  {errors.itineraries[index]?.subject?.message}
                </p>
              )}
            </div>
            <div className="grid gap-1.5">
              <Label>Itinerary</Label>
              <Textarea
                placeholder="Type here..."
                className={`min-h-[140px] bg-white ${
                  errors.itineraries?.[index]?.itinerary ? "border-red-500" : ""
                }`}
                spellCheck="true"
                {...control.register(`itineraries.${index}.itinerary`)}
              />
              {errors.itineraries?.[index]?.itinerary && (
                <p className="text-sm text-red-500">
                  {errors.itineraries[index]?.itinerary?.message}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default ItineraryDetails;
