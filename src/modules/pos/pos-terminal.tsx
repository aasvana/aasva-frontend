"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CirclePlusIcon, LayoutGridIcon, ListIcon, MinusIcon, PlusIcon, ShoppingCartIcon, Trash2Icon, XIcon } from "lucide-react";
import { notify } from "@/lib/notify";
import { OutletSwitcher } from "./outlet-switcher";
import { useOutletStore } from "@/stores/outletStore";
import { CURRENCIES, PAYMENT_MODES, PAYMENT_MODE_LABELS, formatMoney } from "./constants";
import { computePosTotals } from "./schema";
import { usePosStore } from "./store";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  cn,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  toast,
} from "./ui";

const checkoutSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  paymentMode: z.enum(PAYMENT_MODES),
  currency: z.string().min(1, "Currency is required"),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export function PosTerminal() {
  const router = useRouter();
  const products = usePosStore((s) => s.products);
  const cart = usePosStore((s) => s.cart);
  const addToCart = usePosStore((s) => s.addToCart);
  const setCartQty = usePosStore((s) => s.setCartQty);
  const removeFromCart = usePosStore((s) => s.removeFromCart);
  const checkout = usePosStore((s) => s.checkout);
  const activeOutletId = useOutletStore((s) => s.activeOutletId);
  const outlets = useOutletStore((s) => s.outlets);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const totals = computePosTotals(cart);

  const outletProducts = useMemo(
    () => products.filter((p) => p.outletId === activeOutletId),
    [products, activeOutletId]
  );

  const filteredProducts = useMemo(() => {
    return outletProducts.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.sku.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        category === "all" || product.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [outletProducts, search, category]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: "",
      paymentMode: "cash",
      currency:
        outlets.find((o) => o.id === activeOutletId)?.currency ?? "USD",
    },
  });

  const onSubmit = (values: CheckoutForm) => {
    if (cart.length === 0) return;
    setSubmitting(true);
    try {
      const invoice = checkout({
        customerName: values.customerName,
        paymentMode: values.paymentMode,
        currency: values.currency,
      });
      notify({
        type: "success",
        category: "sales",
        title: "Sale completed",
        message: `Invoice ${invoice.data.invoiceNo} was created.`,
        customer: values.customerName,
        link: `/dashboard/invoices/${invoice.id}/view`,
      });
      setCheckoutOpen(false);
      router.push(`/dashboard/invoices/${invoice.id}/view`);
    } catch {
      toast.error("Could not complete the sale.");
    } finally {
      setSubmitting(false);
    }
  };

  if (outletProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-[20px] border border-dashed border-gray-200 py-24 text-center">
        <p className="text-lg font-medium text-gray-800">No products yet</p>
        <p className="text-sm text-gray-500">
          Add your first product to start taking orders at this outlet.
        </p>
        <Button asChild>
          <Link href="/dashboard/pos/products">
            <CirclePlusIcon className="size-4" />
            Add Products
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        <div className="flex items-center justify-between gap-3">
          <OutletSwitcher />
          <Button
            variant="secondary"
            className="cursor-pointer sm:hidden"
            onClick={() => setCartOpen(true)}
          >
            <ShoppingCartIcon className="size-4" />
            <span className="ml-1">
              {cart.reduce((sum, item) => sum + item.qty, 0)}
            </span>
          </Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-[1fr_200px]">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
          />
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {[
                "General",
                "Food & Beverage",
                "Electronics",
                "Apparel",
                "Services",
                "Other",
              ].map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1 rounded-xl border border-gray-200 bg-gray-50 p-1">
            <button
              type="button"
              onClick={() => setView("grid")}
              aria-pressed={view === "grid"}
              className={cn(
                "flex size-9 cursor-pointer items-center justify-center rounded-lg transition-colors",
                view === "grid"
                  ? "bg-white text-emerald-700 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              <LayoutGridIcon className="size-4" />
              <span className="sr-only">Grid view</span>
            </button>
            <button
              type="button"
              onClick={() => setView("list")}
              aria-pressed={view === "list"}
              className={cn(
                "flex size-9 cursor-pointer items-center justify-center rounded-lg transition-colors",
                view === "list"
                  ? "bg-white text-emerald-700 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              <ListIcon className="size-4" />
              <span className="sr-only">List view</span>
            </button>
          </div>

          <Button
            onClick={() => setCartOpen(true)}
            className="h-11 gap-2 bg-emerald-600 text-white shadow-sm hover:bg-emerald-700"
          >
            <ShoppingCartIcon className="size-4" />
            Cart
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold">
              {cart.length}
            </span>
          </Button>
        </div>

        {filteredProducts.length === 0 ? (
          <p className="py-16 text-center text-sm text-gray-500">
            No products match your search.
          </p>
        ) : view === "grid" ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden transition-colors hover:border-emerald-200">
                <CardHeader className="p-3 pb-0">
                  <CardTitle className="text-sm font-semibold text-gray-800">
                    {product.name}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {product.sku || product.category}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-3">
                  <p className="text-base font-bold text-gray-900">
                    {formatMoney(product.price, "USD")}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {product.taxRate}% tax · {product.stock} in stock
                  </p>
                  <Button
                    className="mt-3 w-full"
                    size="sm"
                    onClick={() => addToCart(product)}
                  >
                    <PlusIcon className="size-4" />
                    Add to cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-2.5">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-gray-800">
                    {product.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {product.sku || product.category}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">
                    {formatMoney(product.price, "USD")}
                  </p>
                  <p className="text-xs text-gray-500">
                    {product.taxRate}% tax · {product.stock} in stock
                  </p>
                </div>
                <Button
                  size="sm"
                  className="shrink-0 bg-emerald-600 text-white shadow-sm hover:bg-emerald-700"
                  onClick={() => addToCart(product)}
                >
                  <PlusIcon className="size-4" />
                  Add
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Drawer
        direction="right"
        open={cartOpen}
        onOpenChange={(open) => !open && setCartOpen(false)}
      >
        <DrawerContent className="w-full max-w-md rounded-none border-l">
          <div className="flex h-full flex-col">
            <DrawerHeader className="border-b">
              <div className="flex items-center justify-between pr-1">
                <DrawerTitle className="text-base">Cart</DrawerTitle>
                <DrawerClose asChild>
                  <Button variant="ghost" size="icon" className="size-8">
                    <XIcon className="size-4" />
                  </Button>
                </DrawerClose>
              </div>
              <DrawerDescription className="text-xs">
                {cart.length} item{cart.length === 1 ? "" : "s"} in your cart
              </DrawerDescription>
            </DrawerHeader>

            <div className="flex-1 overflow-y-auto p-4">
              {cart.length === 0 ? (
                <p className="py-10 text-center text-sm text-gray-500">
                  Your cart is empty. Add products to get started.
                </p>
              ) : (
                <div className="grid gap-3">
                  {cart.map((item) => {
                    const lineTotal = item.price * item.qty;
                    return (
                      <div
                        key={item.productId}
                        className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 p-2.5"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-gray-800">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatMoney(item.price, "USD")} × {item.qty} (
                            {item.taxRate}%)
                          </p>
                          <p className="text-sm font-semibold text-gray-900">
                            {formatMoney(lineTotal, "USD")}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="size-7"
                            aria-label="Decrease quantity"
                            onClick={() => setCartQty(item.productId, item.qty - 1)}
                          >
                            <MinusIcon className="size-3" />
                          </Button>
                          <span className="w-6 text-center text-sm">
                            {item.qty}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="size-7"
                            aria-label="Increase quantity"
                            onClick={() => setCartQty(item.productId, item.qty + 1)}
                          >
                            <PlusIcon className="size-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7 text-red-500"
                            aria-label="Remove item"
                            onClick={() => removeFromCart(item.productId)}
                          >
                            <Trash2Icon className="size-3.5" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <>
                <div className="grid gap-1.5 border-t border-gray-200 p-4 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatMoney(totals.subtotal, "USD")}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>{formatMoney(totals.tax, "USD")}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-2 text-base font-bold text-gray-900">
                    <span>Total</span>
                    <span>{formatMoney(totals.total, "USD")}</span>
                  </div>
                </div>
                <div className="border-t border-gray-200 p-4">
                  <Button
                    className="h-12 w-full bg-emerald-600 text-white shadow-sm hover:bg-emerald-700"
                    onClick={() => {
                      setCartOpen(false);
                      setCheckoutOpen(true);
                    }}
                  >
                    Checkout
                  </Button>
                </div>
              </>
            )}
          </div>
        </DrawerContent>
      </Drawer>

      <Drawer
        direction="right"
        open={checkoutOpen}
        onOpenChange={(open) => !open && setCheckoutOpen(false)}
      >
        <DrawerContent className="w-full max-w-md rounded-none border-l">
          <form onSubmit={handleSubmit(onSubmit)} className="flex h-full flex-col">
            <DrawerHeader className="border-b">
              <DrawerTitle>Checkout</DrawerTitle>
              <DrawerDescription>
                Complete the sale to generate the invoice.
              </DrawerDescription>
            </DrawerHeader>

            <div className="flex-1 space-y-5 overflow-y-auto p-6">
              <div className="grid gap-1.5">
                <Label htmlFor="customerName">Customer name</Label>
                <Input
                  id="customerName"
                  placeholder="Walk-in Customer"
                  {...register("customerName")}
                  aria-invalid={!!errors.customerName}
                />
                {errors.customerName && (
                  <p className="text-sm text-red-500">
                    {errors.customerName.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1.5">
                  <Label>Mode of payment</Label>
                  <Select
                    value={watch("paymentMode")}
                    onValueChange={(value) =>
                      setValue("paymentMode", value as CheckoutForm["paymentMode"])
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PAYMENT_MODES.map((mode) => (
                        <SelectItem key={mode} value={mode}>
                          {PAYMENT_MODE_LABELS[mode]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-1.5">
                  <Label>Currency</Label>
                  <Select
                    value={watch("currency")}
                    onValueChange={(value) => setValue("currency", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm">
                <p className="mb-2 font-semibold text-gray-800">Order summary</p>
                <div className="grid gap-1">
                  {cart.map((item) => (
                    <div key={item.productId} className="flex justify-between text-gray-600">
                      <span>
                        {item.name} × {item.qty}
                      </span>
                      <span>{formatMoney(item.price * item.qty, watch("currency"))}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex justify-between border-t border-gray-200 pt-2 font-bold text-gray-900">
                  <span>Total</span>
                  <span>{formatMoney(totals.total, watch("currency"))}</span>
                </div>
              </div>
            </div>

            <DrawerFooter className="flex-row justify-end border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCheckoutOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting || cart.length === 0}>
                {submitting ? "Processing..." : "Complete Sale"}
              </Button>
            </DrawerFooter>
          </form>
        </DrawerContent>
      </Drawer>
    </>
  );
}
