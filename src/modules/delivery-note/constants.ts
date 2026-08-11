export {
  CURRENCIES,
  DEFAULT_TAX_RATES,
  DISCOUNT_TYPES,
  DISCOUNT_TYPE_LABELS,
  formatMoney,
} from "../invoice";
export type { DiscountType, InvoiceBusiness } from "../invoice";

export const DELIVERY_NOTE_STATUSES = [
  "draft",
  "sent",
  "delivered",
  "cancelled",
] as const;

export type DeliveryNoteStatus = (typeof DELIVERY_NOTE_STATUSES)[number];

export const DELIVERY_NOTE_STATUS_LABELS: Record<
  DeliveryNoteStatus,
  string
> = {
  draft: "Draft",
  sent: "Sent",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const DELIVERY_NOTES_KEY = "xmerge_delivery_notes";
export const DELIVERY_NOTE_DRAFT_KEY = "xmerge_delivery_note_draft";
