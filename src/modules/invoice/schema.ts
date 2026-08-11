import { z } from "zod";
import {
  DEFAULT_BUSINESS,
  INVOICE_STATUSES,
  DISCOUNT_TYPES,
  PAYMENT_MODES,
  InvoiceBusiness,
} from "./constants";

const coerceNumber = (message: string) =>
  z.coerce
    .number({ invalid_type_error: message })
    .min(0, message)
    .finite(message);

const partySchema = z.object({
  name: z.string().min(1, "Name is required"),
  company: z.string(),
  email: z.string().email("Invalid email address").or(z.literal("")),
  phone: z.string(),
  address: z.string(),
});

const lineItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  qty: coerceNumber("Quantity must be a valid number"),
  rate: coerceNumber("Rate must be a valid number"),
  taxRate: coerceNumber("Tax rate must be a valid number").max(
    100,
    "Tax rate cannot exceed 100%"
  ),
});

const bankDetailsSchema = z.object({
  bankName: z.string(),
  accountName: z.string(),
  accountNumber: z.string(),
  ifscCode: z.string(),
  swiftCode: z.string(),
});

const companySchema = z.object({
  name: z.string(),
  address: z.string(),
  email: z.string(),
  phone: z.string(),
  taxId: z.string(),
});

export const PARTY_DEFAULTS = {
  name: "",
  company: "",
  email: "",
  phone: "",
  address: "",
};

export const BANK_DEFAULTS = {
  bankName: "",
  accountName: "",
  accountNumber: "",
  ifscCode: "",
  swiftCode: "",
};

export const COMPANY_DEFAULTS = {
  name: "",
  address: "",
  email: "",
  phone: "",
  taxId: "",
};

export const invoiceSchema = z.object({
  // Invoice header
  invoiceNo: z.string().min(1, "Invoice number is required"),
  issueDate: z.date({ required_error: "Issue date is required" }),
  dueDate: z.date({ required_error: "Due date is required" }),
  status: z.enum(INVOICE_STATUSES),
  currency: z.string().min(1, "Currency is required"),

  // Parties
  billTo: partySchema,
  shipTo: partySchema,
  sameAsBilling: z.boolean(),

  // Seller company
  includeCompany: z.boolean().default(false),
  company: companySchema.default({ ...COMPANY_DEFAULTS }),

  // Line items & totals
  items: z.array(lineItemSchema).min(1, "Add at least one line item"),
  discountType: z.enum(DISCOUNT_TYPES),
  discountValue: coerceNumber("Discount must be a valid number"),

  // Payment & notes
  paymentMode: z.enum(PAYMENT_MODES).default("bank_transfer"),
  paidAmount: coerceNumber("Paid amount must be a valid number"),
  notes: z.string(),
  terms: z.string(),

  // Bank details (only relevant when paymentMode === "bank_transfer")
  bank: bankDetailsSchema,
});

export type InvoiceFormData = z.infer<typeof invoiceSchema>;
export type InvoiceParty = z.infer<typeof partySchema>;
export type InvoiceLineItem = z.infer<typeof lineItemSchema>;
export type InvoiceBankDetails = z.infer<typeof bankDetailsSchema>;
export type InvoiceCompany = z.infer<typeof companySchema>;

export const invoiceStepFieldMap: (keyof InvoiceFormData)[][] = [
  ["invoiceNo", "issueDate", "dueDate", "status", "currency"],
  ["billTo", "shipTo"],
  ["items"],
  ["paymentMode", "paidAmount", "notes", "terms"],
  ["bank"],
];

export const toNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === "number") return isNaN(value) ? fallback : value;
  const n = Number(value ?? "");
  return isNaN(n) ? fallback : n;
};

export type InvoiceTotals = {
  subtotal: number;
  discountAmount: number;
  tax: number;
  total: number;
  paid: number;
  balance: number;
};

export function normalizeInvoiceData(
  data: InvoiceFormData
): InvoiceFormData {
  if (!data.sameAsBilling) return data;
  return { ...data, shipTo: data.billTo };
}

export function mergeInvoiceDefaults(
  data: Partial<InvoiceFormData>
): InvoiceFormData {
  return {
    ...data,
    invoiceNo: data.invoiceNo ?? "",
    issueDate: data.issueDate ?? new Date(),
    dueDate: data.dueDate ?? new Date(),
    status: data.status ?? "draft",
    currency: data.currency ?? "USD",
    sameAsBilling: data.sameAsBilling ?? true,
    includeCompany: data.includeCompany ?? false,
    paymentMode: data.paymentMode ?? "bank_transfer",
    discountType: data.discountType ?? "none",
    discountValue: data.discountValue ?? 0,
    paidAmount: data.paidAmount ?? 0,
    notes: data.notes ?? "",
    terms: data.terms ?? "",
    billTo: { ...PARTY_DEFAULTS, ...(data.billTo ?? {}) },
    shipTo: { ...PARTY_DEFAULTS, ...(data.shipTo ?? {}) },
    company: { ...COMPANY_DEFAULTS, ...(data.company ?? {}) },
    bank: { ...BANK_DEFAULTS, ...(data.bank ?? {}) },
    items: Array.isArray(data.items) && data.items.length ? data.items : [],
  };
}

export function resolveBusiness(
  data: Partial<InvoiceFormData>,
  fallback: InvoiceBusiness = DEFAULT_BUSINESS
): InvoiceBusiness {
  const company = data.company;
  if (data.includeCompany && company?.name) {
    return {
      name: company.name,
      address: company.address,
      email: company.email,
      phone: company.phone,
      taxId: company.taxId,
    };
  }
  return fallback;
}

export function hasBankDetails(bank: Partial<InvoiceBankDetails> | undefined) {
  return Object.values(bank ?? {}).some((value) => value);
}

export function computeTotals(data: Partial<InvoiceFormData>): InvoiceTotals {
  const items = Array.isArray(data.items) ? data.items : [];
  const lineTotal = (it: Partial<InvoiceLineItem>) =>
    toNumber(it.qty) * toNumber(it.rate);

  const subtotal = items.reduce((sum, it) => sum + lineTotal(it), 0);

  const discountValue = toNumber(data.discountValue);
  const discountAmount =
    data.discountType === "percent"
      ? (subtotal * discountValue) / 100
      : data.discountType === "fixed"
      ? Math.min(discountValue, subtotal)
      : 0;

  const tax = items.reduce(
    (sum, it) => sum + (lineTotal(it) * toNumber(it.taxRate)) / 100,
    0
  );

  const total = subtotal - discountAmount + tax;
  const paid = Math.min(toNumber(data.paidAmount), total);
  const balance = total - paid;

  return { subtotal, discountAmount, tax, total, paid, balance };
}
