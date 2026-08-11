"use client";

import { useMemo, useState } from "react";
import {
  BookOpen,
  Calculator,
  ChevronDown,
  Clock,
  Plane,
  Rocket,
  Search,
  Store,
  Truck,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Article = {
  title: string;
  module?: string;
  minutes: number;
  body: string;
};

type ArticleCategory = {
  module: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: string;
  articles: Article[];
};

const ARTICLES: ArticleCategory[] = [
  {
    module: "Getting Started",
    icon: Rocket,
    tone: "bg-emerald-50 text-emerald-700",
    articles: [
      {
        title: "Understanding the workspace",
        minutes: 4,
        body: "Your workspace is organised into modules such as Store, Accounting, Travel, Delivery and Requests. Use the sidebar to navigate between them. Every module has an overview page with key stats, plus dedicated pages for records, settings and reports.",
      },
      {
        title: "How data and storage work",
        minutes: 5,
        body: "All records you create are saved locally in your browser and persist across sessions. Data is organised under namespaces such as xmerge_invoices and xmerge_delivery. Refreshing the page keeps your data; clearing browser data will remove it, so export anything important first.",
      },
      {
        title: "Using Search to find anything",
        minutes: 3,
        body: "Open Search from the sidebar to look across every module at once. Type a keyword and results appear grouped by area. Click any result to jump straight to that record, or press Enter to open the first result.",
      },
    ],
  },
  {
    module: "Store & Inventory",
    icon: Store,
    tone: "bg-sky-50 text-sky-700",
    articles: [
      {
        title: "Setting up products and stock",
        minutes: 6,
        body: "Add products with a name, SKU, category, price and opening stock. Assign each product to an outlet. Stock is tracked per outlet, so keep quantities and transfers accurate to stay in sync with sales.",
      },
      {
        title: "Managing stock transfers",
        minutes: 5,
        body: "Transfers move quantity between outlets. Create a transfer from the source outlet to the destination outlet and record the quantity. The transfer appears in the audit trail and both outlets update.",
      },
      {
        title: "Recording adjustments",
        minutes: 4,
        body: "Use stock adjustments for damage, loss or corrections. Record the product, outlet and the signed delta. A negative delta reduces stock; a positive one increases it.",
      },
    ],
  },
  {
    module: "Accounting",
    icon: Calculator,
    tone: "bg-violet-50 text-violet-700",
    articles: [
      {
        title: "Creating and managing invoices",
        minutes: 7,
        body: "Create invoices with customer details, line items, tax and payment information. Saved invoices appear in the invoice list and are linked to the customer record. Track status from draft to paid.",
      },
      {
        title: "Reconciling bank transactions",
        minutes: 6,
        body: "Bank transactions are recorded against accounts. Use reconciliation to mark transactions as matched on the register. Fully reconciled registers make bank reports accurate.",
      },
      {
        title: "Understanding the chart of accounts",
        minutes: 5,
        body: "The chart of accounts organises your finances by type — assets, liabilities, equity, income and expense. Each account has a code and opening balance used across the general ledger and reports.",
      },
    ],
  },
  {
    module: "Travel",
    icon: Plane,
    tone: "bg-indigo-50 text-indigo-700",
    articles: [
      {
        title: "Managing enquiries and bookings",
        minutes: 6,
        body: "Capture enquiries from customers with their service type and destination. Convert qualified enquiries into bookings linked to suppliers and services, then manage status through confirmation.",
      },
      {
        title: "Building confirmation vouchers",
        minutes: 8,
        body: "Confirmation vouchers combine traveller details, hotels, flight itineraries and payment summary into one document. Keep the itinerary and hotel sections complete so the voucher is client-ready.",
      },
      {
        title: "Keeping travel documents up to date",
        minutes: 4,
        body: "Store passports, visas and other travel documents against customers. Set expiry dates so you can plan renewals before trips.",
      },
    ],
  },
  {
    module: "Delivery",
    icon: Truck,
    tone: "bg-teal-50 text-teal-700",
    articles: [
      {
        title: "Setting up zones and charges",
        minutes: 6,
        body: "Define delivery zones with pincodes and delivery times, then add charge rules for base, per-km and per-kg amounts. Charges are applied automatically when a delivery is created in a zone.",
      },
      {
        title: "Dispatch and tracking deliveries",
        minutes: 5,
        body: "Use the dispatch board to assign partners and confirm dispatch. Track deliveries through pending, dispatched, in transit, delivered and failed statuses.",
      },
      {
        title: "Adding and managing partners",
        minutes: 4,
        body: "Add delivery partners with vehicle type, coverage zones and commission. Active partners appear in the dispatch flow for assignment.",
      },
    ],
  },
  {
    module: "Requests",
    icon: BookOpen,
    tone: "bg-amber-50 text-amber-700",
    articles: [
      {
        title: "Submitting and tracking requests",
        minutes: 4,
        body: "Submit support tickets, feature requests, feedback, bug reports, complaints and announcements from the Requests module. Each request tracks status, priority and assignment.",
      },
      {
        title: "Prioritising your inbox",
        minutes: 3,
        body: "Use the category pages to focus on one request type at a time. Statuses and priority help you see what needs attention first.",
      },
    ],
  },
];

export default function KnowledgeBasePage() {
  const [query, setQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const categories = ARTICLES.map((cat) => ({
      ...cat,
      articles: q
        ? cat.articles.filter(
            (article) =>
              article.title.toLowerCase().includes(q) ||
              (article.module ?? "").toLowerCase().includes(q) ||
              article.body.toLowerCase().includes(q)
          )
        : cat.articles,
    }));
    return categories.filter((cat) => cat.articles.length > 0);
  }, [query]);

  const toggle = (id: string) =>
    setExpandedId((prev) => (prev === id ? null : id));

  return (
    <div className="flex flex-col gap-4">
      <div className="p-1.5">
        <h1 className="text-xl font-semibold text-gray-800">Knowledge Base</h1>
        <p className="text-sm text-gray-500">
          In-depth articles on every module and workflow.
        </p>
      </div>

      <div className="p-1.5">
        <div className="relative max-w-xl">
          <label className="sr-only">Search articles</label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the knowledge base…"
            className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 ps-9 pe-3 block text-sm shadow-2xs outline-none transition-[color,box-shadow] focus-visible:border-emerald-400 focus-visible:ring-emerald-100 focus-visible:ring-[3px]"
          />
          <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-3">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <BookOpen className="size-10 text-gray-300" />
          <p className="text-lg font-medium text-gray-800">
            No articles found
          </p>
          <p className="text-sm text-gray-500">
            Try a different search term.
          </p>
        </div>
      ) : (
        filtered.map((cat) => (
          <div key={cat.module} className="p-1.5">
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
                {cat.module}
              </p>
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                {cat.articles.length}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {cat.articles.map((article) => {
                const id = `${cat.module}:${article.title}`;
                const isOpen = expandedId === id;
                return (
                  <div
                    key={id}
                    className="overflow-hidden rounded-[20px] border border-gray-100 bg-white shadow-sm"
                  >
                    <button
                      type="button"
                      onClick={() => toggle(id)}
                      className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-800">
                          {article.title}
                        </p>
                        <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="size-3.5" /> {article.minutes} min
                        </p>
                      </div>
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
                          {article.body}
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
