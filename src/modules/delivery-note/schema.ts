import { z } from "zod";
import {
  COMPANY_DEFAULTS,
  PARTY_DEFAULTS,
  computeTotals as invoiceComputeTotals,
  resolveBusiness as invoiceResolveBusiness,
} from "../invoice";
import type {
  InvoiceBusiness,
  InvoiceFormData,
  InvoiceTotals,
} from "../invoice";
import {
  DELIVERY_NOTE_STATUSES,
  DISCOUNT_TYPES,
} from "./constants";

const coerceNumber = (message: string) =>
  z.coerce
    .number({ invalid_type_error: message })
    .min(0, message)
    .finite(message);

export const deliveryNotePartySchema = z.object({
  name: z.string().min(1, "Name is required"),
  company: z.string(),
  email: z.string().email("Invalid email address").or(z.literal("")),
  phone: z.string(),
  address: z.string(),
});

export type DeliveryNoteParty = z.infer<typeof deliveryNotePartySchema>;

const lineItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  qty: coerceNumber("Quantity must be a valid number"),
  rate: coerceNumber("Rate must be a valid number"),
  taxRate: coerceNumber("Tax rate must be a valid number").max(
    100,
    "Tax rate cannot exceed 100%"
  ),
});

export type DeliveryNoteLineItem = z.infer<typeof lineItemSchema>;

const companySchema = z.object({
  name: z.string(),
  address: z.string(),
  email: z.string(),
  phone: z.string(),
  taxId: z.string(),
});

export type DeliveryNoteCompany = z.infer<typeof companySchema>;

export const deliveryNoteSchema = z.object({
  dnNo: z.string().min(1, "Delivery note number is required"),
  issueDate: z.date({ required_error: "Issue date is required" }),
  status: z.enum(DELIVERY_NOTE_STATUSES),
  currency: z.string().min(1, "Currency is required"),
  reference: z.string(),

  deliverTo: deliveryNotePartySchema,

  includeCompany: z.boolean().default(false),
  company: companySchema.default({ ...COMPANY_DEFAULTS }),

  items: z.array(lineItemSchema).min(1, "Add at least one line item"),
  discountType: z.enum(DISCOUNT_TYPES),
  discountValue: coerceNumber("Discount must be a valid number"),

  notes: z.string(),
  terms: z.string(),
});

export type DeliveryNoteFormData = z.infer<typeof deliveryNoteSchema>;

export const deliveryNoteStepFieldMap: (keyof DeliveryNoteFormData)[][] = [
  ["dnNo", "issueDate", "status", "currency", "reference"],
  ["deliverTo"],
  ["items"],
  ["notes", "terms"],
];

export function mergeDeliveryNoteDefaults(
  data: Partial<DeliveryNoteFormData>
): DeliveryNoteFormData {
  return {
    ...data,
    dnNo: data.dnNo ?? "",
    issueDate: data.issueDate ?? new Date(),
    status: data.status ?? "draft",
    currency: data.currency ?? "USD",
    reference: data.reference ?? "",
    includeCompany: data.includeCompany ?? false,
    discountType: data.discountType ?? "none",
    discountValue: data.discountValue ?? 0,
    notes: data.notes ?? "",
    terms: data.terms ?? "",
    deliverTo: { ...PARTY_DEFAULTS, ...(data.deliverTo ?? {}) },
    company: { ...COMPANY_DEFAULTS, ...(data.company ?? {}) },
    items: Array.isArray(data.items) && data.items.length ? data.items : [],
  };
}

export { toNumber } from "../invoice";
export type { InvoiceTotals as DeliveryNoteTotals } from "../invoice";

export function computeTotals(
  data: Partial<DeliveryNoteFormData>
): InvoiceTotals {
  return invoiceComputeTotals(data as Partial<InvoiceFormData>);
}

export function resolveBusiness(
  data: Partial<DeliveryNoteFormData>,
  fallback: InvoiceBusiness = COMPANY_DEFAULTS
): InvoiceBusiness {
  return invoiceResolveBusiness(data as Partial<InvoiceFormData>, fallback);
}

export function nextDeliveryNoteNo(): string {
  const now = new Date();
  const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(
    2,
    "0"
  )}${String(now.getDate()).padStart(2, "0")}`;
  const seq = Math.floor(1000 + Math.random() * 9000);
  return `DN-${stamp}-${seq}`;
}

export function normalizeDeliveryNoteData(
  data: DeliveryNoteFormData
): DeliveryNoteFormData {
  return data;
}
