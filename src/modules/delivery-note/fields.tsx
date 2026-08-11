"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";
import {
  Button,
  Calendar,
  Input,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  cn,
} from "./ui";
import { DeliveryNoteFormData } from "./schema";

type FieldProps = {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  readOnly?: boolean;
  optional?: boolean;
};

function getErrorAt(
  errors: Record<string, unknown>,
  path: string
): { message?: string } | undefined {
  const segments = path.split(".");
  let node: any = errors;
  for (const segment of segments) {
    if (!node || typeof node !== "object") return undefined;
    node = node[segment];
  }
  if (node && typeof node === "object" && "message" in node) {
    return node as { message?: string };
  }
  return undefined;
}

export function TextField({
  name,
  label,
  placeholder,
  type = "text",
  disabled,
  readOnly,
  optional,
}: FieldProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<DeliveryNoteFormData>();

  const error = getErrorAt(errors, name);

  return (
    <div className="grid gap-1.5">
      <Label htmlFor={name}>
        {label}
        {optional && <span className="text-xs text-gray-400"> (optional)</span>}
      </Label>
      <Input
        id={name}
        type={type}
        placeholder={placeholder}
        className="bg-white"
        disabled={disabled}
        readOnly={readOnly}
        aria-invalid={!!error}
        {...register(name as never)}
      />
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
}

export function DateField({
  name,
  label,
  disabled,
}: {
  name: string;
  label: string;
  disabled?: boolean;
}) {
  const {
    control,
    formState: { errors },
  } = useFormContext<DeliveryNoteFormData>();

  const error = getErrorAt(errors, name);

  return (
    <div className="grid gap-1.5">
      <Label>{label}</Label>
      <Controller
        control={control}
        name={name as never}
        render={({ field }) => (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                disabled={disabled}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !field.value && "text-muted-foreground",
                  error && "border-red-500"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {field.value ? (
                  format(new Date(field.value as Date), "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={field.value as Date | undefined}
                onSelect={(day) => day && field.onChange(day)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        )}
      />
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
}

export function SelectField({
  name,
  label,
  options,
  placeholder,
  disabled,
}: {
  name: string;
  label: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  disabled?: boolean;
}) {
  const {
    control,
    formState: { errors },
  } = useFormContext<DeliveryNoteFormData>();

  const error = getErrorAt(errors, name);

  return (
    <div className="grid gap-1.5">
      <Label>{label}</Label>
      <Controller
        control={control}
        name={name as never}
        render={({ field }) => (
          <Select
            value={field.value as string}
            onValueChange={field.onChange}
            disabled={disabled}
          >
            <SelectTrigger className="bg-white" aria-invalid={!!error}>
              <SelectValue placeholder={placeholder ?? "Select..."} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
}
