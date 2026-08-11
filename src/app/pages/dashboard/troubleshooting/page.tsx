"use client";

import { useMemo, useState } from "react";
import {
  Boxes,
  Calculator,
  CheckCircle2,
  Plane,
  Search,
  Store,
  Truck,
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Issue = {
  title: string;
  severity: "Common" | "Occasional" | "Rare";
  area: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: string;
  steps: string[];
};

const ISSUES: Issue[] = [
  {
    title: "Product stock shows the wrong quantity",
    severity: "Common",
    area: "Store",
    icon: Store,
    tone: "bg-sky-50 text-sky-700",
    steps: [
      "Open Store → Products and confirm the product is in the correct outlet.",
      "Check Stock Transfers and Stock Adjustments for recent changes to that product.",
      "Check recent sales in POS Sales that may have reduced the quantity.",
      "If it is still wrong, create a stock adjustment to correct the level.",
    ],
  },
  {
    title: "A sale is missing from my sales register",
    severity: "Common",
    area: "Store",
    icon: Boxes,
    tone: "bg-sky-50 text-sky-700",
    steps: [
      "Refresh the POS Sales page.",
      "Verify you were on the correct outlet when the sale was recorded.",
      "Check the Audit Log for any deleted sales in the last session.",
      "Record the sale again if it cannot be found.",
    ],
  },
  {
    title: "Invoice total does not match my calculation",
    severity: "Common",
    area: "Accounting",
    icon: Calculator,
    tone: "bg-violet-50 text-violet-700",
    steps: [
      "Open the invoice and review the line items, quantities and rates.",
      "Check the discount type and value on the invoice.",
      "Verify the tax rate applied to each line item.",
      "Re-save the invoice to recalculate the totals.",
    ],
  },
  {
    title: "Bank reconciliation is not balancing",
    severity: "Occasional",
    area: "Accounting",
    icon: Calculator,
    tone: "bg-violet-50 text-violet-700",
    steps: [
      "Ensure every bank transaction is marked reconciled on the correct account.",
      "Check for transactions recorded under the wrong account or date.",
      "Confirm opening balances on the bank and cash accounts.",
      "Cross-check with Journal Entries that may duplicate a transaction.",
    ],
  },
  {
    title: "A confirmation voucher is missing details",
    severity: "Occasional",
    area: "Travel",
    icon: Plane,
    tone: "bg-indigo-50 text-indigo-700",
    steps: [
      "Open the voucher and edit the travellers and hotel sections.",
      "Add flight itineraries under the airline tab if they are missing.",
      "Complete the payment summary before sending the voucher.",
      "Re-save and verify the voucher preview.",
    ],
  },
  {
    title: "Travel booking status is not updating",
    severity: "Rare",
    area: "Travel",
    icon: Plane,
    tone: "bg-indigo-50 text-indigo-700",
    steps: [
      "Refresh the Travel Bookings page.",
      "Open the booking and confirm you saved the new status.",
      "Check related enquiries for a stuck status that blocks the booking.",
      "Contact support if the status still does not update.",
    ],
  },
  {
    title: "A delivery is stuck in Pending",
    severity: "Common",
    area: "Delivery",
    icon: Truck,
    tone: "bg-teal-50 text-teal-700",
    steps: [
      "Open the Dispatch board and select the delivery.",
      "Assign a delivery partner and confirm dispatch.",
      "Verify the delivery zone and charges are configured.",
      "The status should move to Dispatched after confirmation.",
    ],
  },
  {
    title: "Delivery charges look incorrect",
    severity: "Occasional",
    area: "Delivery",
    icon: Truck,
    tone: "bg-teal-50 text-teal-700",
    steps: [
      "Open Delivery Charges and review the rule for the zone used.",
      "Check the weight and distance entered on the delivery.",
      "Verify the base charge and per-km rates in the charge rule.",
      "Contact support if the configuration looks right but the charge is wrong.",
    ],
  },
  {
    title: "The app feels slow or a page will not load",
    severity: "Common",
    area: "General",
    icon: Wrench,
    tone: "bg-amber-50 text-amber-700",
    steps: [
      "Refresh the page and try again.",
      "Clear the browser cache and reload the app.",
      "Check your internet connection.",
      "If it persists, export your data and contact support.",
    ],
  },
];

const AREAS = ["All", "Store", "Accounting", "Travel", "Delivery", "General"];

export default function TroubleshootingPage() {
  const [query, setQuery] = useState("");
  const [area, setArea] = useState("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ISSUES.filter((issue) => {
      const inArea = area === "All" || issue.area === area;
      const matches =
        !q ||
        issue.title.toLowerCase().includes(q) ||
        issue.area.toLowerCase().includes(q) ||
        issue.steps.some((step) => step.toLowerCase().includes(q));
      return inArea && matches;
    });
  }, [query, area]);

  const severityTone = (severity: Issue["severity"]) =>
    severity === "Common"
      ? "bg-amber-50 text-amber-700"
      : severity === "Occasional"
        ? "bg-orange-50 text-orange-700"
        : "bg-gray-100 text-gray-600";

  return (
    <div className="flex flex-col gap-4">
      <div className="p-1.5">
        <h1 className="text-xl font-semibold text-gray-800">Troubleshooting</h1>
        <p className="text-sm text-gray-500">
          Common issues and the steps to resolve them.
        </p>
      </div>

      <div className="p-1.5">
        <div className="relative max-w-xl">
          <label className="sr-only">Search issues</label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search issues, modules or steps…"
            className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 ps-9 pe-3 block text-sm shadow-2xs outline-none transition-[color,box-shadow] focus-visible:border-emerald-400 focus-visible:ring-emerald-100 focus-visible:ring-[3px]"
          />
          <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-3">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 p-1.5">
        {AREAS.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => setArea(name)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
              area === name
                ? "bg-emerald-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            {name}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <Wrench className="size-10 text-gray-300" />
          <p className="text-lg font-medium text-gray-800">
            No issues found
          </p>
          <p className="text-sm text-gray-500">
            Try a different search term or area.
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((issue) => (
            <div
              key={issue.title}
              className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "grid size-10 shrink-0 place-items-center rounded-xl",
                      issue.tone
                    )}
                  >
                    <issue.icon className="size-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {issue.title}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500">{issue.area}</p>
                  </div>
                </div>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2.5 py-1 text-xs font-medium",
                    severityTone(issue.severity)
                  )}
                >
                  {issue.severity}
                </span>
              </div>
              <div className="mt-4 flex flex-col gap-2.5">
                {issue.steps.map((step, index) => (
                  <div key={index} className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                    <p className="text-sm leading-relaxed text-gray-600">
                      <span className="font-medium text-gray-800">
                        {index + 1}.{" "}
                      </span>
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
