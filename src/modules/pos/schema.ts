import { z } from "zod";
import {
  PaymentMode,
  PRODUCT_DISCOUNT_TYPES,
  PRODUCT_GENDERS,
  PRODUCT_SIZES,
} from "./constants";

const nonNegativeNumber = (message: string) =>
  z.coerce
    .number({ invalid_type_error: message })
    .min(0, message)
    .finite(message);

export const posProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  sku: z.string().default(""),
  outletId: z.string().min(1, "Outlet is required"),
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().default(""),
  price: nonNegativeNumber("Price must be a valid number"),
  taxRate: nonNegativeNumber("Tax rate must be a valid number")
    .max(100, "Tax rate cannot exceed 100%")
    .default(0),
  stock: nonNegativeNumber("Stock must be a valid number").int(
    "Stock must be a whole number"
  ),
  description: z.string().default(""),
  sizes: z.array(z.enum(PRODUCT_SIZES)).default([]),
  gender: z.enum(PRODUCT_GENDERS).default("Unisex"),
  images: z.array(z.string().min(1, "Invalid image data")).default([]),
  discount: nonNegativeNumber("Discount must be a valid number").default(0),
  discountType: z.enum(PRODUCT_DISCOUNT_TYPES).default("percent"),
});

export type PosProductInput = z.infer<typeof posProductSchema>;

export type PosProduct = PosProductInput & {
  id: string;
};

export const posCartItemSchema = z.object({
  productId: z.string(),
  name: z.string().min(1, "Product name is required"),
  price: z.number().min(0),
  taxRate: z.number().min(0).max(100),
  qty: z.number().int().min(1, "Quantity must be at least 1"),
});

export type PosCartItem = z.infer<typeof posCartItemSchema>;

export type PosSaleItem = {
  productId: string;
  name: string;
  qty: number;
  rate: number;
  taxRate: number;
};

export type PosSale = {
  id: string;
  outletId: string;
  invoiceId: string;
  customerName: string;
  items: PosSaleItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMode: PaymentMode;
  currency: string;
  createdAt: string;
};

export type PosTotals = {
  subtotal: number;
  tax: number;
  total: number;
};

export function computePosTotals(
  items: Pick<PosCartItem, "price" | "qty" | "taxRate">[]
): PosTotals {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = items.reduce(
    (sum, item) => sum + item.price * item.qty * (item.taxRate / 100),
    0
  );
  return { subtotal, tax, total: subtotal + tax };
}
