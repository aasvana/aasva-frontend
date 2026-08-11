"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CirclePlusIcon, MinusIcon, PlusIcon, Trash2Icon } from "lucide-react";
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
  Drawer,
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

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const totals = computePosTotals(cart);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.sku.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        category === "all" || product.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { customerName: "", paymentMode: "cash", currency: "USD" },
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
      toast.success(`Invoice ${invoice.data.invoiceNo} created!`);
      setCheckoutOpen(false);
      router.push(`/dashboard/invoices/${invoice.id}/view`);
    } catch {
      toast.error("Could not complete the sale.");
    } finally {
      setSubmitting(false);
    }
  };

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-gray-300 py-24 text-center">
        <p className="text-lg font-medium text-gray-800">No products yet</p>
        <p className="text-sm text-gray-500">
          Add your first product to start taking orders at the store.
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
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-4">
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

          {filteredProducts.length === 0 ? (
            <p className="py-16 text-center text-sm text-gray-500">
              No products match your search.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden">
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
          )}
        </div>

        <div className="lg:sticky lg:top-0 self-start">
          <Card>
            <CardHeader className="border-b p-4">
              <CardTitle className="text-base">Cart</CardTitle>
              <CardDescription className="text-xs">
                {cart.length} item{cart.length === 1 ? "" : "s"}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              {cart.length === 0 ? (
                <p className="py-10 text-center text-sm text-gray-500">
                  Your cart is empty.
                </p>
              ) : (
                <div className="grid gap-3">
                  {cart.map((item) => {
                    const lineTotal = item.price * item.qty;
                    return (
                      <div
                        key={item.productId}
                        className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 p-2.5"
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
            </CardContent>
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
                <div className="p-4 pt-0">
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={() => setCheckoutOpen(true)}
                  >
                    Checkout
                  </Button>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>

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
