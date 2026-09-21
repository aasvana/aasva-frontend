import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Mars, Venus, X } from "lucide-react";
import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { ConfirmationVoucherFormData } from "../schema";
import { capitalizeWords } from "@/lib/text-format";

const TravellersDetails = () => {
  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<ConfirmationVoucherFormData>();

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "travellers",
  });

  const travellers = watch("travellers");
  const numberOfPersons = watch("numberOfPersons");

  React.useEffect(() => {
    const count = Math.max(1, Number(numberOfPersons) || 0);
    const current = travellers ?? [];
    if (current.length !== count) {
      replace(Array.from({ length: count }, (_, index) => current[index] ?? { name: "", age: "", gender: "male" }));
    }
  }, [numberOfPersons, replace]);

  const handleAddTraveller = () => {
    append({ name: "", age: "", gender: "male" });
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button variant="outline" onClick={handleAddTraveller}>
          Add New Traveller
        </Button>
      </div>

      {errors.travellers?.root && (
        <p className="text-sm text-red-500 mb-2">
          {errors.travellers.root.message}
        </p>
      )}

      {fields.map((field, index) => {
        const gender = travellers?.[index]?.gender;

        return (
        <div
          key={field.id}
          className="relative grid grid-cols-1 md:grid-cols-3 gap-6 border rounded-md p-4 mb-4"
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

          <div className="grid gap-1.5">
            <Label htmlFor={`travellers.${index}.name`}>Traveller Name</Label>
            <Input
              type="text"
              id={`travellers.${index}.name`}
              placeholder="John Doe"
              className="bg-gray-50"
              aria-invalid={!!errors.travellers?.[index]?.name}
               {...control.register(`travellers.${index}.name`, { setValueAs: capitalizeWords })}
            />
            {errors.travellers?.[index]?.name && (
              <p className="text-sm text-red-500">
                {errors.travellers[index]?.name?.message}
              </p>
            )}
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor={`travellers.${index}.age`}>Traveller Age</Label>
            <Input
              type="number"
              id={`travellers.${index}.age`}
              placeholder="30"
              className="bg-gray-50"
              aria-invalid={!!errors.travellers?.[index]?.age}
              {...control.register(`travellers.${index}.age`)}
            />
            {errors.travellers?.[index]?.age && (
              <p className="text-sm text-red-500">
                {errors.travellers[index]?.age?.message}
              </p>
            )}
          </div>

          <div className="flex flex-row items-end gap-4">
            <div className="w-full">
              <label
                htmlFor={`travellers.${index}.gender.male`}
                className={cn(
                  "flex cursor-pointer items-center gap-2 border rounded-md p-2",
                  gender === "male"
                    ? "bg-blue-100 border-blue-600 text-blue-700"
                    : "bg-white border-gray-300 text-gray-700"
                )}
              >
                <input
                  type="radio"
                  id={`travellers.${index}.gender.male`}
                  value="male"
                  checked={gender === "male"}
                  onChange={() =>
                    setValue(`travellers.${index}.gender`, "male")
                  }
                  className="sr-only"
                />
                <Mars className="w-5 h-5" />
                <span>Male</span>
              </label>
            </div>
            <div className="w-full">
              <label
                htmlFor={`travellers.${index}.gender.female`}
                className={cn(
                  "flex cursor-pointer items-center gap-2 border rounded-md p-2",
                  gender === "female"
                    ? "bg-pink-100 border-pink-600 text-pink-700"
                    : "bg-white border-gray-300 text-gray-700"
                )}
              >
                <input
                  type="radio"
                  id={`travellers.${index}.gender.female`}
                  value="female"
                  checked={gender === "female"}
                  onChange={() =>
                    setValue(`travellers.${index}.gender`, "female")
                  }
                  className="sr-only"
                />
                <Venus className="w-5 h-5" />
                <span>Female</span>
              </label>
            </div>
          </div>

          {errors.travellers?.[index]?.gender && (
            <p className="text-sm text-red-500 col-span-3">
              {errors.travellers[index]?.gender?.message}
            </p>
          )}
        </div>
        );
      })}
    </>
  );
};

export default TravellersDetails;
