"use client";

import { create } from "zustand";
import { SavedInvoice, useInvoiceStore } from "../invoice";
import {
  getProducts,
  getSales,
  saveProduct,
  updateProduct,
  deleteProduct,
  saveSale,
  deleteSale,
  assignDefaultOutlet,
  newId,
} from "./storage";
import {
  PosProduct,
  PosProductInput,
  PosCartItem,
  PosSale,
} from "./schema";
import {
  buildInvoiceFromCart,
  buildPosSale,
  CheckoutOptions,
} from "./invoice-builder";
import { useOutletStore } from "@/stores/outletStore";

const canUseWindow = typeof window !== "undefined";

interface PosStoreState {
  products: PosProduct[];
  sales: PosSale[];
  cart: PosCartItem[];
  hydrate: () => void;
  addProduct: (data: PosProductInput) => PosProduct;
  updateProductById: (id: string, data: PosProductInput) => PosProduct | undefined;
  deleteProductById: (id: string) => void;
  addToCart: (product: PosProduct, qty?: number) => void;
  setCartQty: (productId: string, qty: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  checkout: (options: CheckoutOptions) => SavedInvoice;
  deleteSaleById: (id: string) => void;
}

export const usePosStore = create<PosStoreState>()((set, get) => ({
  products: [],
  sales: [],
  cart: [],

  hydrate: () => {
    if (!canUseWindow) return;
    const activeId = useOutletStore.getState().activeOutletId;
    set({
      products: assignDefaultOutlet(getProducts(), activeId),
      sales: getSales(),
    });
  },
  addProduct: (data) => {
    const product: PosProduct = {
      ...data,
      outletId: data.outletId || useOutletStore.getState().activeOutletId,
      id: newId(),
    };
    saveProduct(product);
    set((state) => ({ products: [...state.products, product] }));
    return product;
  },

  updateProductById: (id, data) => {
    const current = get().products.find((p) => p.id === id);
    if (!current) return undefined;
    const updated: PosProduct = { ...data, id };
    const saved = updateProduct(id, updated);
    if (saved) {
      set((state) => ({
        products: state.products.map((p) => (p.id === id ? updated : p)),
      }));
    }
    return saved;
  },

  deleteProductById: (id) => {
    deleteProduct(id);
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
      cart: state.cart.filter((item) => item.productId !== id),
    }));
  },

  addToCart: (product, qty = 1) => {
    set((state) => {
      const existing = state.cart.find((item) => item.productId === product.id);
      if (existing) {
        return {
          cart: state.cart.map((item) =>
            item.productId === product.id
              ? { ...item, qty: item.qty + qty }
              : item
          ),
        };
      }
      return {
        cart: [
          ...state.cart,
          {
            productId: product.id,
            name: product.name,
            price: product.price,
            taxRate: product.taxRate,
            qty,
          },
        ],
      };
    });
  },

  setCartQty: (productId, qty) => {
    if (qty <= 0) {
      get().removeFromCart(productId);
      return;
    }
    set((state) => ({
      cart: state.cart.map((item) =>
        item.productId === productId ? { ...item, qty } : item
      ),
    }));
  },

  removeFromCart: (productId) => {
    set((state) => ({
      cart: state.cart.filter((item) => item.productId !== productId),
    }));
  },

  clearCart: () => set({ cart: [] }),

  checkout: (options) => {
    const cart = get().cart;
    if (cart.length === 0) {
      throw new Error("Cart is empty");
    }
    const data = buildInvoiceFromCart(cart, options);
    const invoice = useInvoiceStore.getState().addInvoice(data);
    const sale = buildPosSale({
      invoiceId: invoice.id,
      cart,
      customerName: options.customerName,
      paymentMode: options.paymentMode,
      currency: options.currency,
      outletId: useOutletStore.getState().activeOutletId,
    });
    saveSale(sale);
    set((state) => ({ sales: [sale, ...state.sales], cart: [] }));
    return invoice;
  },

  deleteSaleById: (id) => {
    deleteSale(id);
    set((state) => ({ sales: state.sales.filter((s) => s.id !== id) }));
  },
}));
