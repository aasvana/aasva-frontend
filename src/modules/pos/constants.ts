export {
  CURRENCIES,
  PAYMENT_MODES,
  PAYMENT_MODE_LABELS,
  DEFAULT_TAX_RATES,
  formatMoney,
} from "../invoice";
export type { PaymentMode } from "../invoice";

export const POS_PRODUCTS_KEY = "xmerge_pos_products";
export const POS_SALES_KEY = "xmerge_pos_sales";

export const PRODUCT_CATEGORIES = [
  "General",
  "Food & Beverage",
  "Electronics",
  "Apparel",
  "Services",
  "Other",
] as const;

export const PRODUCT_SUBCATEGORIES: Record<string, readonly string[]> = {
  "Food & Beverage": [
    "Coffee",
    "Bakery",
    "Beverages",
    "Snacks",
    "Meals",
    "Desserts",
  ],
  Electronics: [
    "Phones",
    "Laptops",
    "Audio",
    "Accessories",
    "Wearables",
    "Cameras",
  ],
  Apparel: [
    "Shirts",
    "Jeans",
    "Jackets",
    "T-Shirts",
    "Dresses",
    "Shoes",
    "Accessories",
  ],
  Services: ["Repair", "Consulting", "Membership", "Maintenance"],
  Other: ["Gifts", "Household", "Miscellaneous"],
};

export const PRODUCT_SIZES = ["XS", "S", "M", "XL", "XXL"] as const;

export type ProductSize = (typeof PRODUCT_SIZES)[number];

export const PRODUCT_GENDERS = ["Men", "Woman", "Unisex"] as const;

export type ProductGender = (typeof PRODUCT_GENDERS)[number];

export const PRODUCT_DISCOUNT_TYPES = ["percent", "fixed"] as const;

export type ProductDiscountType = (typeof PRODUCT_DISCOUNT_TYPES)[number];
