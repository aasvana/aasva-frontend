export {
  POS_PRODUCTS_KEY,
  POS_SALES_KEY,
  PRODUCT_CATEGORIES,
  PRODUCT_SUBCATEGORIES,
  PRODUCT_SIZES,
  PRODUCT_GENDERS,
  PRODUCT_DISCOUNT_TYPES,
  CURRENCIES,
  PAYMENT_MODES,
  PAYMENT_MODE_LABELS,
  DEFAULT_TAX_RATES,
  formatMoney,
} from "./constants";
export type {
  ProductSize,
  ProductGender,
  ProductDiscountType,
  PaymentMode,
} from "./constants";

export {
  posProductSchema,
  posCartItemSchema,
  computePosTotals,
} from "./schema";
export type {
  PosProduct,
  PosProductInput,
  PosCartItem,
  PosSale,
  PosSaleItem,
  PosTotals,
} from "./schema";

export {
  getProducts,
  getProduct,
  saveProduct,
  updateProduct,
  deleteProduct,
  getSales,
  getSale,
  saveSale,
  deleteSale,
  assignDefaultOutlet,
} from "./storage";

export { nextInvoiceNo, buildInvoiceFromCart, buildPosSale } from "./invoice-builder";
export type { CheckoutOptions } from "./invoice-builder";

export { usePosStore } from "./store";

export { ProductCreateForm } from "./product-create-form";
export { PosTerminal } from "./pos-terminal";
export { PosProductPicker } from "./pos-product-picker";
export { OutletSwitcher } from "./outlet-switcher";
export { LabelPrintDialog } from "./label-print-dialog";
export { ProductLabel, Barcode, printProductLabels } from "./product-label";
