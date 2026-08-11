"use client";

import { ReactNode, useEffect } from "react";
import { useFieldArray, useFormContext, Controller } from "react-hook-form";
import { MinusIcon, PlusIcon } from "lucide-react";
import {
  PURCHASE_ORDER_STATUS_LABELS,
  CURRENCIES,
  DISCOUNT_TYPE_LABELS,
  DEFAULT_TAX_RATES,
  formatMoney,
} from "./constants";
import {
  PurchaseOrderFormData,
  computeTotals,
  toNumber,
} from "./schema";
import {
  Button,
  Checkbox,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui";
import { DateField, SelectField, TextField } from "./fields";
import { PosProductPicker } from "../pos";

function SectionCard({
  title,
  actions,
  children,
}: {
  title: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white">
      <div className="flex items-center justify-between gap-3 border-b border-gray-200 px-4 py-3">
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        {actions}
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

export function PurchaseOrderHeaderFields() {
  const { watch } = useFormContext<PurchaseOrderFormData>();
  const status = watch("status");
  const currency = watch("currency");

  return (
    <SectionCard title="Purchase Order Details">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <TextField
          name="poNo"
          label="Purchase order number"
          placeholder="PO-2026-0001"
        />
        <SelectField
          name="status"
          label="Status"
          options={Object.entries(PURCHASE_ORDER_STATUS_LABELS).map(
            ([value, label]) => ({ value, label })
          )}
          placeholder={status || "Select status"}
        />
        <DateField name="issueDate" label="Issue date" />
        <DateField name="deliveryDate" label="Expected delivery date" />
        <SelectField
          name="currency"
          label="Currency"
          options={CURRENCIES.map((c) => ({ value: c.value, label: c.label }))}
          placeholder={currency || "Select currency"}
        />
      </div>
    </SectionCard>
  );
}

export function CompanySection() {
  const { watch, control } = useFormContext<PurchaseOrderFormData>();
  const includeCompany = watch("includeCompany");

  return (
    <SectionCard
      title="Your Company"
      actions={
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <Controller
            control={control}
            name="includeCompany"
            render={({ field }) => (
              <Checkbox
                id="includeCompany"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <span>Include company details</span>
        </label>
      }
    >
      {includeCompany ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <TextField
            name="company.name"
            label="Company name"
            placeholder="Your Business Inc."
          />
          <TextField
            name="company.taxId"
            label="Tax ID / VAT"
            placeholder="GST-XXXX / VAT-XXXX"
            optional
          />
          <div className="md:col-span-2">
            <TextField
              name="company.address"
              label="Address"
              placeholder="Street, City, State, ZIP"
              optional
            />
          </div>
          <TextField
            name="company.email"
            label="Email"
            type="email"
            placeholder="billing@yourbusiness.com"
            optional
          />
          <TextField
            name="company.phone"
            label="Phone"
            placeholder="+1 555 000 1234"
            optional
          />
        </div>
      ) : (
        <p className="text-sm text-gray-500">
          Your company details are hidden. Toggle the option above to show them
          on the purchase order.
        </p>
      )}
    </SectionCard>
  );
}

function PartyBlock({
  prefix,
  title,
  readOnly,
}: {
  prefix: "vendor" | "shipTo";
  title: string;
  readOnly?: boolean;
}) {
  return (
    <div className="grid gap-4">
      <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextField
          name={`${prefix}.name`}
          label="Contact name"
          placeholder="Jane Cooper"
          readOnly={readOnly}
        />
        <TextField
          name={`${prefix}.company`}
          label="Company"
          placeholder="Acme Inc."
          readOnly={readOnly}
          optional
        />
        <TextField
          name={`${prefix}.email`}
          label="Email"
          type="email"
          placeholder="sales@acme.com"
          readOnly={readOnly}
          optional
        />
        <TextField
          name={`${prefix}.phone`}
          label="Phone"
          placeholder="+1 555 000 1234"
          readOnly={readOnly}
          optional
        />
        <div className="md:col-span-2">
          <TextField
            name={`${prefix}.address`}
            label="Address"
            placeholder="Street, City, State, ZIP"
            readOnly={readOnly}
            optional
          />
        </div>
      </div>
    </div>
  );
}

export function PartiesSection() {
  const { watch, setValue, control } = useFormContext<PurchaseOrderFormData>();
  const sameAsBilling = watch("sameAsBilling");

  useEffect(() => {
    if (!sameAsBilling) return;
    const vendor = watch("vendor");
    setValue("shipTo", vendor);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sameAsBilling, watch("vendor")]);

  return (
    <SectionCard title="Vendor & Ship To">
      <div className="grid gap-8">
        <PartyBlock prefix="vendor" title="Vendor" />
        <div className="flex items-center gap-2">
          <Controller
            control={control}
            name="sameAsBilling"
            render={({ field }) => (
              <Checkbox
                id="sameAsBilling"
                checked={field.value}
                onCheckedChange={(checked) => {
                  field.onChange(!!checked);
                  if (checked) setValue("shipTo", watch("vendor"));
                }}
              />
            )}
          />
          <Label htmlFor="sameAsBilling" className="text-sm text-gray-700">
            Ship to same as vendor address
          </Label>
        </div>
        <PartyBlock prefix="shipTo" title="Ship To" readOnly={sameAsBilling} />
      </div>
    </SectionCard>
  );
}

export function LineItemsSection() {
  const { control, register, watch, setValue } =
    useFormContext<PurchaseOrderFormData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const formValues = watch();
  const totals = computeTotals(formValues);

  const addItem = () =>
    append({ description: "", qty: 1, rate: 0, taxRate: 0 });

  const addProduct = (product: {
    name: string;
    price: number;
    taxRate: number;
  }) =>
    append({
      description: product.name,
      qty: 1,
      rate: product.price,
      taxRate: product.taxRate,
    });

  return (
    <SectionCard
      title="Line Items"
      actions={
        <div className="flex items-center gap-2">
          <div className="w-56">
            <PosProductPicker onSelect={addProduct} />
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addItem}>
            <PlusIcon className="size-4" />
            Add item
          </Button>
        </div>
      }
    >
      <div className="grid gap-6">
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[220px]">Description</TableHead>
                <TableHead className="w-20">Qty</TableHead>
                <TableHead className="w-28">Rate</TableHead>
                <TableHead className="w-24">Tax %</TableHead>
                <TableHead className="w-28 text-right">Amount</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((field, index) => {
                const item = formValues.items?.[index];
                const amount = toNumber(item?.qty) * toNumber(item?.rate);
                return (
                  <TableRow key={field.id}>
                    <TableCell>
                      <Input
                        className="bg-white"
                        placeholder="Description"
                        {...register(`items.${index}.description`)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        className="bg-white"
                        type="number"
                        min={0}
                        {...register(`items.${index}.qty`, {
                          valueAsNumber: true,
                        })}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        className="bg-white"
                        type="number"
                        min={0}
                        step="0.01"
                        {...register(`items.${index}.rate`, {
                          valueAsNumber: true,
                        })}
                      />
                    </TableCell>
                    <TableCell>
                      <Controller
                        control={control}
                        name={`items.${index}.taxRate`}
                        render={({ field: taxField }) => (
                          <Select
                            value={String(taxField.value ?? 0)}
                            onValueChange={(v) => taxField.onChange(Number(v))}
                          >
                            <SelectTrigger className="bg-white w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {DEFAULT_TAX_RATES.map((rate) => (
                                <SelectItem key={rate} value={rate}>
                                  {rate}%
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </TableCell>
                    <TableCell className="text-right text-sm font-medium">
                      {formatMoney(amount, formValues.currency)}
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label="Remove item"
                        onClick={() => remove(index)}
                      >
                        <MinusIcon className="size-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="grid gap-4">
            <div className="grid gap-1.5">
              <Label>Discount</Label>
              <Select
                value={watch("discountType")}
                onValueChange={(v) => setValue("discountType", v as never)}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(DISCOUNT_TYPE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {watch("discountType") !== "none" && (
              <div className="grid gap-1.5">
                <Label>
                  {watch("discountType") === "percent"
                    ? "Discount %"
                    : "Discount amount"}
                </Label>
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  className="bg-white"
                  {...register("discountValue", { valueAsNumber: true })}
                />
              </div>
            )}
          </div>

          <div className="grid gap-1.5 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-medium">
                {formatMoney(totals.subtotal, formValues.currency)}
              </span>
            </div>
            {totals.discountAmount > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-500">Discount</span>
                <span className="font-medium text-red-500">
                  -{formatMoney(totals.discountAmount, formValues.currency)}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-500">Tax</span>
              <span className="font-medium">
                {formatMoney(totals.tax, formValues.currency)}
              </span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-2">
              <span className="font-semibold">Total</span>
              <span className="font-semibold">
                {formatMoney(totals.total, formValues.currency)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

export function NotesSection() {
  const { register } = useFormContext<PurchaseOrderFormData>();

  return (
    <SectionCard title="Notes">
      <div className="grid gap-6">
        <div className="grid gap-1.5">
          <Label htmlFor="notes">
            Notes <span className="text-xs text-gray-400">(optional)</span>
          </Label>
          <textarea
            id="notes"
            rows={3}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-xs"
            placeholder="Delivery instructions..."
            {...register("notes")}
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="terms">
            Terms & conditions{" "}
            <span className="text-xs text-gray-400">(optional)</span>
          </Label>
          <textarea
            id="terms"
            rows={3}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-xs"
            placeholder="Payment due within 30 days of delivery..."
            {...register("terms")}
          />
        </div>
      </div>
    </SectionCard>
  );
}
