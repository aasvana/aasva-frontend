import { format } from "date-fns";
import {
  InvoiceFormData,
  COMPANY_DEFAULTS,
  BANK_DEFAULTS,
  computeTotals,
} from "../invoice";
import type { PaymentMode } from "./constants";
import { PosCartItem, PosSale } from "./schema";
import { newId } from "./storage";

export type CheckoutOptions = {
  customerName: string;
  paymentMode: PaymentMode;
  currency: string;
  invoiceNo?: string;
};

export function nextInvoiceNo(): string {
  const stamp = format(new Date(), "yyyyMMdd");
  const seq = Math.floor(1000 + Math.random() * 9000);
  return `INV-${stamp}-${seq}`;
}

export function buildInvoiceFromCart(
  cart: PosCartItem[],
  options: CheckoutOptions
): InvoiceFormData {
  const party = {
    name: options.customerName || "Walk-in Customer",
    company: "",
    email: "",
    phone: "",
    address: "",
  };
  const items = cart.map((item) => ({
    description: item.name,
    qty: item.qty,
    rate: item.price,
    taxRate: item.taxRate,
  }));
  const totals = computeTotals({
    items,
    discountType: "none",
    discountValue: 0,
    paidAmount: 0,
  });

  return {
    invoiceNo: options.invoiceNo ?? nextInvoiceNo(),
    issueDate: new Date(),
    dueDate: new Date(),
    status: "paid",
    currency: options.currency,
    billTo: party,
    shipTo: party,
    sameAsBilling: true,
    includeCompany: false,
    company: { ...COMPANY_DEFAULTS },
    items,
    discountType: "none",
    discountValue: 0,
    paymentMode: options.paymentMode,
    paidAmount: totals.total,
    notes: "Thank you for shopping with us!",
    terms: "",
    bank: { ...BANK_DEFAULTS },
  };
}

export function buildPosSale(params: {
  invoiceId: string;
  cart: PosCartItem[];
  customerName: string;
  paymentMode: PaymentMode;
  currency: string;
}): PosSale {
  const totals = computeTotals({
    items: params.cart.map((item) => ({
      description: item.name,
      qty: item.qty,
      rate: item.price,
      taxRate: item.taxRate,
    })),
    discountType: "none",
    discountValue: 0,
    paidAmount: 0,
  });

  return {
    id: newId(),
    invoiceId: params.invoiceId,
    customerName: params.customerName || "Walk-in Customer",
    items: params.cart.map((item) => ({
      productId: item.productId,
      name: item.name,
      qty: item.qty,
      rate: item.price,
      taxRate: item.taxRate,
    })),
    subtotal: totals.subtotal,
    discount: 0,
    tax: totals.tax,
    total: totals.total,
    paymentMode: params.paymentMode,
    currency: params.currency,
    createdAt: new Date().toISOString(),
  };
}
