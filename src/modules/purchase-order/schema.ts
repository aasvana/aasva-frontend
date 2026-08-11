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
  PURCHASE_ORDER_STATUSES,
  DISCOUNT_TYPES,
} from "./constants";

const coerceNumber = (message: string) =>
  z.coerce
    .number({ invalid_type_error: message })
    .min(0, message)
    .finite(message);

export const purchaseOrderPartySchema = z.object({
  name: z.string().min(1, "Name is required"),
  company: z.string(),
  email: z.string().email("Invalid email address").or(z.literal("")),
  phone: z.string(),
  address: z.string(),
});

export type PurchaseOrderParty = z.infer<typeof purchaseOrderPartySchema>;

const lineItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  qty: coerceNumber("Quantity must be a valid number"),
  rate: coerceNumber("Rate must be a valid number"),
  taxRate: coerceNumber("Tax rate must be a valid number").max(
    100,
    "Tax rate cannot exceed 100%"
  ),
});

export type PurchaseOrderLineItem = z.infer<typeof lineItemSchema>;

const companySchema = z.object({
  name: z.string(),
  address: z.string(),
  email: z.string(),
  phone: z.string(),
  taxId: z.string(),
});

export type PurchaseOrderCompany = z.infer<typeof companySchema>;

export const purchaseOrderSchema = z.object({
  poNo: z.string().min(1, "Purchase order number is required"),
  issueDate: z.date({ required_error: "Issue date is required" }),
  deliveryDate: z.date({ required_error: "Delivery date is required" }),
  status: z.enum(PURCHASE_ORDER_STATUSES),
  currency: z.string().min(1, "Currency is required"),

  vendor: purchaseOrderPartySchema,
  shipTo: purchaseOrderPartySchema,
  sameAsBilling: z.boolean(),

  includeCompany: z.boolean().default(false),
  company: companySchema.default({ ...COMPANY_DEFAULTS }),

  items: z.array(lineItemSchema).min(1, "Add at least one line item"),
  discountType: z.enum(DISCOUNT_TYPES),
  discountValue: coerceNumber("Discount must be a valid number"),

  notes: z.string(),
  terms: z.string(),
});

export type PurchaseOrderFormData = z.infer<typeof purchaseOrderSchema>;

export const purchaseOrderStepFieldMap: (keyof PurchaseOrderFormData)[][] = [
  ["poNo", "issueDate", "deliveryDate", "status", "currency"],
  ["vendor", "shipTo"],
  ["items"],
  ["notes", "terms"],
];

export function mergePurchaseOrderDefaults(
  data: Partial<PurchaseOrderFormData>
): PurchaseOrderFormData {
  return {
    ...data,
    poNo: data.poNo ?? "",
    issueDate: data.issueDate ?? new Date(),
    deliveryDate: data.deliveryDate ?? new Date(),
    status: data.status ?? "draft",
    currency: data.currency ?? "USD",
    sameAsBilling: data.sameAsBilling ?? true,
    includeCompany: data.includeCompany ?? false,
    discountType: data.discountType ?? "none",
    discountValue: data.discountValue ?? 0,
    notes: data.notes ?? "",
    terms: data.terms ?? "",
    vendor: { ...PARTY_DEFAULTS, ...(data.vendor ?? {}) },
    shipTo: { ...PARTY_DEFAULTS, ...(data.shipTo ?? {}) },
    company: { ...COMPANY_DEFAULTS, ...(data.company ?? {}) },
    items: Array.isArray(data.items) && data.items.length ? data.items : [],
  };
}

export { toNumber } from "../invoice";
export type { InvoiceTotals as PurchaseOrderTotals } from "../invoice";

export function computeTotals(
  data: Partial<PurchaseOrderFormData>
): InvoiceTotals {
  return invoiceComputeTotals(data as Partial<InvoiceFormData>);
}

export function resolveBusiness(
  data: Partial<PurchaseOrderFormData>,
  fallback: InvoiceBusiness = COMPANY_DEFAULTS
): InvoiceBusiness {
  return invoiceResolveBusiness(data as Partial<InvoiceFormData>, fallback);
}

export function nextPurchaseOrderNo(): string {
  const now = new Date();
  const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(
    2,
    "0"
  )}${String(now.getDate()).padStart(2, "0")}`;
  const seq = Math.floor(1000 + Math.random() * 9000);
  return `PO-${stamp}-${seq}`;
}

export function normalizePurchaseOrderData(
  data: PurchaseOrderFormData
): PurchaseOrderFormData {
  if (!data.sameAsBilling) return data;
  return { ...data, shipTo: data.vendor };
}
