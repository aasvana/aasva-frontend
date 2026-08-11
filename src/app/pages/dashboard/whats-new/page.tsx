"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Search, Sparkles, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

type ReleaseItem = {
  text: string;
  kind: "New" | "Improved" | "Fixed";
};

type Release = {
  version: string;
  date: string;
  title: string;
  items: ReleaseItem[];
};

const RELEASES: Release[] = [
  {
    version: "v1.6",
    date: "August 2026",
    title: "Help Center and global search",
    items: [
      { text: "Added a global Search that finds records across every module and links you straight to them.", kind: "New" },
      { text: "Introduced the Help Center with Knowledge Base, FAQs, Guides and Troubleshooting.", kind: "New" },
      { text: "What's New keeps you up to date with every release.", kind: "New" },
    ],
  },
  {
    version: "v1.5",
    date: "July 2026",
    title: "User Requests module",
    items: [
      { text: "Manage support tickets, feature requests, feedback, bug reports, complaints and announcements in one place.", kind: "New" },
      { text: "Track request status, priority and assignment across every category.", kind: "New" },
    ],
  },
  {
    version: "v1.4",
    date: "June 2026",
    title: "Delivery operations",
    items: [
      { text: "New Delivery module for deliveries, dispatch, partners, zones and charges.", kind: "New" },
      { text: "Dispatch board lets you assign partners and move deliveries through their lifecycle.", kind: "New" },
    ],
  },
  {
    version: "v1.3",
    date: "May 2026",
    title: "Customer profiles",
    items: [
      { text: "Full customer profiles with sales, travel, documents, communication and notes.", kind: "New" },
      { text: "Customer sub-records stay in sync with invoices, payments and bookings.", kind: "Improved" },
    ],
  },
  {
    version: "v1.2",
    date: "April 2026",
    title: "Accounting depth",
    items: [
      { text: "Added chart of accounts, journal entries, general ledger, trial balance and tax configuration.", kind: "New" },
      { text: "Bank reconciliation is now tracked against the register.", kind: "Improved" },
    ],
  },
  {
    version: "v1.1",
    date: "March 2026",
    title: "Store and travel",
    items: [
      { text: "Store module with products, POS sales, outlets and stock movements.", kind: "New" },
      { text: "Travel module with bookings, enquiries, itineraries, suppliers and documents.", kind: "New" },
      { text: "Confirmation vouchers combine travellers, hotels and itineraries into one document.", kind: "New" },
    ],
  },
  {
    version: "v1.0",
    date: "February 2026",
    title: "The first release",
    items: [
      { text: "Invoices, estimates, credit notes, debit notes, receipts and expenses.", kind: "New" },
      { text: "Bills, supplier payments, expense claims and financial reports.", kind: "New" },
      { text: "Dashboard with workspace overview and quick actions.", kind: "New" },
    ],
  },
];

const KIND_TONE: Record<ReleaseItem["kind"], string> = {
  New: "bg-emerald-50 text-emerald-700",
  Improved: "bg-sky-50 text-sky-700",
  Fixed: "bg-amber-50 text-amber-700",
};

const KIND_ICON: Record<ReleaseItem["kind"], React.ComponentType<{ className?: string }>> = {
  New: Sparkles,
  Improved: Zap,
  Fixed: CheckCircle2,
};

export default function WhatsNewPage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return RELEASES;
    return RELEASES.filter(
      (release) =>
        release.version.toLowerCase().includes(q) ||
        release.title.toLowerCase().includes(q) ||
        release.items.some((item) => item.text.toLowerCase().includes(q))
    );
  }, [query]);

  return (
    <div className="flex flex-col gap-4">
      <div className="p-1.5">
        <h1 className="text-xl font-semibold text-gray-800">What&apos;s New</h1>
        <p className="text-sm text-gray-500">
          Release notes and the latest features we shipped.
        </p>
      </div>

      <div className="p-1.5">
        <div className="relative max-w-xl">
          <label className="sr-only">Search release notes</label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search release notes…"
            className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 ps-9 pe-3 block text-sm shadow-2xs outline-none transition-[color,box-shadow] focus-visible:border-emerald-400 focus-visible:ring-emerald-100 focus-visible:ring-[3px]"
          />
          <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-3">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <Sparkles className="size-10 text-gray-300" />
          <p className="text-lg font-medium text-gray-800">
            No release notes found
          </p>
          <p className="text-sm text-gray-500">
            Try a different search term.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((release) => (
            <div
              key={release.version}
              className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-emerald-50 text-sm font-bold text-emerald-700">
                    {release.version.replace("v", "")}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {release.title}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500">
                      {release.date}
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500">
                  {release.version}
                </span>
              </div>
              <div className="mt-4 flex flex-col gap-2.5">
                {release.items.map((item, index) => {
                  const ItemIcon = KIND_ICON[item.kind];
                  return (
                    <div
                      key={index}
                      className="flex items-start gap-2.5"
                    >
                      <span
                        className={cn(
                          "grid size-6 shrink-0 place-items-center rounded-lg",
                          KIND_TONE[item.kind]
                        )}
                      >
                        <ItemIcon className="size-3.5" />
                      </span>
                      <p className="text-sm leading-relaxed text-gray-600">
                        {item.text}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
