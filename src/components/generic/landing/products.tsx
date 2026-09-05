import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { brand } from "@/constants/brand";
import {
  Calculator,
  Check,
  Plane,
  ScanBarcode,
  ShoppingBag,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import React from "react";
import { Reveal } from "./motion-primitives";

const products = [
  {
    icon: Plane,
    name: "Travel Management",
    status: "Live",
    statusClass:
      "bg-emerald-100 text-emerald-700 border-transparent dark:bg-emerald-500/10 dark:text-emerald-400",
    tint: "bg-sky-100 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400",
    description:
      "Purpose-built ERP for travel agencies and tour operators to run the entire company.",
    points: ["Confirmation vouchers", "Itineraries & bookings", "Clients & vendors"],
  },
  {
    icon: Stethoscope,
    name: "Healthcare Suite",
    status: "Live",
    statusClass:
      "bg-emerald-100 text-emerald-700 border-transparent dark:bg-emerald-500/10 dark:text-emerald-400",
    tint: "bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
    description:
      "A calm, organized way for doctors and clinics to keep track of every patient.",
    points: ["Patient records & history", "Appointments & follow-ups", "Prescriptions"],
  },
  {
    icon: ShoppingBag,
    name: "E-commerce",
    status: "Beta",
    statusClass:
      "bg-amber-100 text-amber-700 border-transparent dark:bg-amber-500/10 dark:text-amber-400",
    tint: "bg-violet-100 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400",
    description:
      "Launch an online storefront that scales with you — from first sale to full catalog.",
    points: ["Online store & catalog", "Orders & fulfilment", "Payments built-in"],
  },
  {
    icon: Calculator,
    name: "Accounting",
    status: "Beta",
    statusClass:
      "bg-amber-100 text-amber-700 border-transparent dark:bg-amber-500/10 dark:text-amber-400",
    tint: "bg-teal-100 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400",
    description:
      "Clean books without the spreadsheet chaos — built for small and big business alike.",
    points: ["Invoices & expenses", "GST-ready reports", "Bank reconciliation"],
  },
  {
    icon: ScanBarcode,
    name: "POS System",
    status: "Live",
    statusClass:
      "bg-emerald-100 text-emerald-700 border-transparent dark:bg-emerald-500/10 dark:text-emerald-400",
    tint: "bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
    description:
      "Fast, reliable billing for retail counters — online or off, on any device.",
    points: ["Lightning-fast billing", "Inventory sync", "Multi-store support"],
  },
  {
    icon: Sparkles,
    name: "More on the way",
    status: "Coming soon",
    statusClass:
      "bg-gray-100 text-gray-600 border-transparent dark:bg-neutral-800 dark:text-neutral-400",
    tint: "bg-primary/10 text-primary",
    description:
      "HR & payroll, inventory, CRM and more are being integrated into the platform.",
    points: [],
    comingSoon: true,
  },
];

const Products = () => {
  return (
    <section id="products" className="py-20 lg:py-28 scroll-mt-20">
      <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
        <Reveal className="max-w-2xl text-center mx-auto">
          <Badge variant="outline" className="rounded-full mb-4">
            Products
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-balance">
            Every product your business needs.{" "}
            <span className="text-muted-foreground">Finally together.</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            Stop stitching five tools with five logins. {brand.name} grows with
            you — turn on what you need, when you need it.
          </p>
        </Reveal>

        <div className="mt-12 lg:mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {products.map((product, i) => (
            <Reveal key={product.name} delay={(i % 3) * 0.1}>
              <Card
                className={`group relative h-full gap-0 py-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-900/5 dark:hover:shadow-black/30 ${
                  product.comingSoon
                    ? "border-dashed bg-transparent shadow-none"
                    : ""
                }`}
              >
                <CardContent className="space-y-4">
                  <div className="flex items-start justify-between">
                    <span
                      className={`flex justify-center items-center size-11 rounded-xl transition-transform duration-300 group-hover:scale-110 ${product.tint}`}
                    >
                      <product.icon className="size-5" />
                    </span>
                    <Badge variant="outline" className={product.statusClass}>
                      {product.status}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {product.points.length > 0 && (
                    <ul className="space-y-2 pt-1">
                      {product.points.map((point) => (
                        <li
                          key={point}
                          className="flex items-center gap-x-2.5 text-sm text-muted-foreground"
                        >
                          <Check className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;
