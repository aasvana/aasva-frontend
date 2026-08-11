"use client";

import { useMemo, useState } from "react";
import {
  Calculator,
  ChevronDown,
  HelpCircle,
  Inbox,
  Plane,
  Rocket,
  Search,
  Store,
  Truck,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Faq = {
  q: string;
  a: string;
};

type FaqCategory = {
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: string;
  items: Faq[];
};

const FAQS: FaqCategory[] = [
  {
    category: "Getting Started",
    icon: Rocket,
    tone: "bg-emerald-50 text-emerald-700",
    items: [
      {
        q: "How do I create my first invoice?",
        a: "Open Invoices from the Accounting section and press Create. Fill in the customer details and line items, then save. The invoice appears instantly in your invoice list.",
      },
      {
        q: "Where is my data stored?",
        a: "Everything you create is saved locally in your browser under the xmerge_ namespace, so it stays available across sessions on the same device.",
      },
      {
        q: "How do I change the workspace brand?",
        a: "Go to Settings and update your company name, logo and contact details. These are used across invoices, vouchers and other documents.",
      },
    ],
  },
  {
    category: "Store & Inventory",
    icon: Store,
    tone: "bg-sky-50 text-sky-700",
    items: [
      {
        q: "How do I add a product to my store?",
        a: "Open Store from the sidebar, go to Products and press Add Product. Set a name, SKU, category, price and stock, then save.",
      },
      {
        q: "How does stock automatically update on a sale?",
        a: "When you record a sale, product quantities are reduced automatically based on the line items included in the sale.",
      },
      {
        q: "What is the difference between a stock transfer and a stock adjustment?",
        a: "A transfer moves quantity between two outlets, while an adjustment records a change in stock level for a single outlet such as damage or loss.",
      },
    ],
  },
  {
    category: "Accounting",
    icon: Calculator,
    tone: "bg-violet-50 text-violet-700",
    items: [
      {
        q: "How do I record an expense?",
        a: "Open Expenses from the Accounting section and add a new entry with a party, category, amount and status. It will be included in your expense reports.",
      },
      {
        q: "How do I reconcile a bank transaction?",
        a: "Open Bank Transactions, find the transaction and mark it reconciled against your register so it matches your real bank statement.",
      },
      {
        q: "Why is my general ledger not matching my reports?",
        a: "Reports are generated from journal entries and accounting documents. Check that all your invoices, expenses and payments are saved with the correct status.",
      },
      {
        q: "Can I create credit notes for customers?",
        a: "Yes. Open Credit Notes from Accounting, create a credit note against a customer, and it is applied to their customer record automatically.",
      },
    ],
  },
  {
    category: "Travel",
    icon: Plane,
    tone: "bg-indigo-50 text-indigo-700",
    items: [
      {
        q: "How do I create a travel booking?",
        a: "Open Travel, go to Bookings and add a new booking with the customer, service, supplier and dates. You can link an enquiry or itinerary to it.",
      },
      {
        q: "What is a confirmation voucher?",
        a: "A confirmation voucher is the travel document given to the customer. It combines traveller details, hotels, flight itineraries and payment summary.",
      },
      {
        q: "How do I convert an enquiry into a booking?",
        a: "Open the enquiry in Travel, review the details, then use the Create Booking action. The enquiry status updates to Booked.",
      },
    ],
  },
  {
    category: "Delivery",
    icon: Truck,
    tone: "bg-teal-50 text-teal-700",
    items: [
      {
        q: "How do I dispatch a delivery?",
        a: "Open Delivery, go to the Dispatch board and select the deliveries ready for dispatch. Assign a partner and confirm — the status moves to Dispatched.",
      },
      {
        q: "How are delivery charges calculated?",
        a: "Charges are based on the delivery zones and charge rules you configure. Weight, distance and base charge rules are applied to each delivery.",
      },
      {
        q: "How do I add a delivery partner?",
        a: "Open Delivery, go to Partners and add a partner with their vehicle type, coverage zones and commission.",
      },
    ],
  },
  {
    category: "Requests & Support",
    icon: Inbox,
    tone: "bg-amber-50 text-amber-700",
    items: [
      {
        q: "How do I submit a feature request?",
        a: "Open Requests, choose Feature Request, fill in the details and submit. You can track its status from My Requests.",
      },
      {
        q: "How do I contact support?",
        a: "Use Contact Support in the Help & Support section. Include the affected module and what you were doing so we can help faster.",
      },
      {
        q: "Where do I find what is new in the app?",
        a: "Open What's New in the Help & Support section to read the latest release notes and features.",
      },
    ],
  },
];

export default function FaqsPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const byCategory = FAQS.filter(
      (cat) => !activeCategory || cat.category === activeCategory
    ).map((cat) => ({
      ...cat,
      items: q
        ? cat.items.filter(
            (item) =>
              item.q.toLowerCase().includes(q) ||
              item.a.toLowerCase().includes(q)
          )
        : cat.items,
    }));
    return byCategory.filter((cat) => cat.items.length > 0);
  }, [query, activeCategory]);

  const toggle = (key: string) =>
    setExpanded((prev) => (prev === key ? null : key));

  return (
    <div className="flex flex-col gap-4">
      <div className="p-1.5">
        <h1 className="text-xl font-semibold text-gray-800">FAQs</h1>
        <p className="text-sm text-gray-500">
          Quick answers to the most commonly asked questions.
        </p>
      </div>

      <div className="p-1.5">
        <div className="relative max-w-xl">
          <label className="sr-only">Search FAQs</label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search frequently asked questions…"
            className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 ps-9 pe-3 block text-sm shadow-2xs outline-none transition-[color,box-shadow] focus-visible:border-emerald-400 focus-visible:ring-emerald-100 focus-visible:ring-[3px]"
          />
          <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-3">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 p-1.5">
        <button
          type="button"
          onClick={() => setActiveCategory(null)}
          className={cn(
            "rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
            activeCategory === null
              ? "bg-emerald-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          )}
        >
          All
        </button>
        {FAQS.map((cat) => (
          <button
            key={cat.category}
            type="button"
            onClick={() =>
              setActiveCategory((prev) =>
                prev === cat.category ? null : cat.category
              )
            }
            className={cn(
              "rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
              activeCategory === cat.category
                ? "bg-emerald-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            {cat.category}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <HelpCircle className="size-10 text-gray-300" />
          <p className="text-lg font-medium text-gray-800">No FAQs found</p>
          <p className="text-sm text-gray-500">
            Try a different search term or category.
          </p>
        </div>
      ) : (
        filtered.map((cat) => (
          <div key={cat.category} className="p-1.5">
            <div className="mb-2 flex items-center gap-2">
              <span
                className={cn(
                  "grid size-8 place-items-center rounded-xl",
                  cat.tone
                )}
              >
                <cat.icon className="size-4" />
              </span>
              <p className="text-sm font-semibold text-gray-800">
                {cat.category}
              </p>
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                {cat.items.length}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {cat.items.map((item) => {
                const key = `${cat.category}:${item.q}`;
                const isOpen = expanded === key;
                return (
                  <div
                    key={key}
                    className="overflow-hidden rounded-[20px] border border-gray-100 bg-white shadow-sm"
                  >
                    <button
                      type="button"
                      onClick={() => toggle(key)}
                      className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
                    >
                      <p className="text-sm font-semibold text-gray-800">
                        {item.q}
                      </p>
                      <ChevronDown
                        className={cn(
                          "size-4 shrink-0 text-gray-400 transition-transform",
                          isOpen && "rotate-180"
                        )}
                      />
                    </button>
                    {isOpen && (
                      <div className="border-t border-gray-100 px-5 py-4">
                        <p className="text-sm leading-relaxed text-gray-600">
                          {item.a}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
