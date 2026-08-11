export {
  CURRENCIES,
  DEFAULT_TAX_RATES,
  DISCOUNT_TYPES,
  DISCOUNT_TYPE_LABELS,
  formatMoney,
} from "../invoice";
export type { DiscountType, InvoiceBusiness } from "../invoice";

export const PURCHASE_ORDER_STATUSES = [
  "draft",
  "sent",
  "approved",
  "received",
  "cancelled",
] as const;

export type PurchaseOrderStatus = (typeof PURCHASE_ORDER_STATUSES)[number];

export const PURCHASE_ORDER_STATUS_LABELS: Record<
  PurchaseOrderStatus,
  string
> = {
  draft: "Draft",
  sent: "Sent",
  approved: "Approved",
  received: "Received",
  cancelled: "Cancelled",
};

export const PURCHASE_ORDERS_KEY = "xmerge_purchase_orders";
export const PURCHASE_ORDER_DRAFT_KEY = "xmerge_purchase_order_draft";
