export const INVOICE_STATUSES = [
  "draft",
  "sent",
  "partially_paid",
  "paid",
  "overdue",
  "cancelled",
] as const;

export type InvoiceStatus = (typeof INVOICE_STATUSES)[number];

export const INVOICE_STATUS_LABELS: Record<InvoiceStatus, string> = {
  draft: "Draft",
  sent: "Sent",
  partially_paid: "Partially Paid",
  paid: "Paid",
  overdue: "Overdue",
  cancelled: "Cancelled",
};

export const DISCOUNT_TYPES = ["none", "percent", "fixed"] as const;

export type DiscountType = (typeof DISCOUNT_TYPES)[number];

export const DISCOUNT_TYPE_LABELS: Record<DiscountType, string> = {
  none: "No discount",
  percent: "Percentage (%)",
  fixed: "Fixed amount",
};

export const CURRENCIES = [
  { value: "USD", label: "USD - US Dollar" },
  { value: "EUR", label: "EUR - Euro" },
  { value: "GBP", label: "GBP - British Pound" },
  { value: "INR", label: "INR - Indian Rupee" },
  { value: "AED", label: "AED - UAE Dirham" },
  { value: "AUD", label: "AUD - Australian Dollar" },
  { value: "CAD", label: "CAD - Canadian Dollar" },
  { value: "SGD", label: "SGD - Singapore Dollar" },
  { value: "JPY", label: "JPY - Japanese Yen" },
  { value: "CNY", label: "CNY - Chinese Yuan" },
] as const;

export const DEFAULT_TAX_RATES = ["0", "5", "12", "18", "20", "25", "28"];

export const PAYMENT_MODES = [
  "bank_transfer",
  "cash",
  "cheque",
  "card",
  "other",
] as const;

export type PaymentMode = (typeof PAYMENT_MODES)[number];

export const PAYMENT_MODE_LABELS: Record<PaymentMode, string> = {
  bank_transfer: "Bank Transfer",
  cash: "Cash",
  cheque: "Cheque",
  card: "Card",
  other: "Other",
};

export type InvoiceBusiness = {
  name: string;
  address: string;
  email: string;
  phone: string;
  taxId?: string;
};

export const DEFAULT_BUSINESS: InvoiceBusiness = {
  name: "Your Business",
  address: "123 Main Street, City, Country",
  email: "billing@yourbusiness.com",
  phone: "+1 (000) 000-0000",
};

export function formatMoney(
  amount: number,
  currency: string,
  options?: Intl.NumberFormatOptions
) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
      ...options,
    }).format(amount);
  } catch {
    return `${currency || "USD"} ${amount.toFixed(2)}`;
  }
}
