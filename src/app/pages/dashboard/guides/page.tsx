"use client";

import { useMemo, useState } from "react";
import {
  Boxes,
  Calculator,
  ChevronDown,
  Clock,
  Plane,
  Rocket,
  Search,
  Store,
  Truck,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GUIDE_MODULES, GUIDES, Guide } from "@/components/guides/guides-data";

const MODULE_META: Record<string, { icon: React.ComponentType<{ className?: string }>; tone: string }> = {
  "Getting Started": { icon: Rocket, tone: "bg-emerald-50 text-emerald-700" },
  Store: { icon: Store, tone: "bg-sky-50 text-sky-700" },
  Inventory: { icon: Boxes, tone: "bg-amber-50 text-amber-700" },
  Accounting: { icon: Calculator, tone: "bg-violet-50 text-violet-700" },
  Travel: { icon: Plane, tone: "bg-indigo-50 text-indigo-700" },
  Delivery: { icon: Truck, tone: "bg-teal-50 text-teal-700" },
};

export default function GuidesPage() {
  const [query, setQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return GUIDES;
    return GUIDES.filter(
      (guide) =>
        guide.title.toLowerCase().includes(q) ||
        guide.module.toLowerCase().includes(q) ||
        guide.description.toLowerCase().includes(q) ||
        guide.steps.some((s) => s.title.toLowerCase().includes(q))
    );
  }, [query]);

  const sections = useMemo(
    () =>
      GUIDE_MODULES.map((module) => ({
        module,
        guides: filtered.filter((g) => g.module === module),
      })).filter((section) => section.guides.length > 0),
    [filtered]
  );

  const toggle = (id: string) =>
    setExpandedId((prev) => (prev === id ? null : id));

  return (
    <div className="flex flex-col gap-4">
      <div className="p-1.5">
        <h1 className="text-xl font-semibold text-gray-800">Guides</h1>
        <p className="text-sm text-gray-500">
          Step-by-step guides to get the most out of your workspace.
        </p>
      </div>

      <div className="p-1.5">
        <div className="relative max-w-sm">
          <label className="sr-only">Search guides</label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search guides…"
            className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 ps-9 pe-3 block text-sm shadow-2xs outline-none transition-[color,box-shadow] focus-visible:border-emerald-400 focus-visible:ring-emerald-100 focus-visible:ring-[3px]"
          />
          <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-3">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      {sections.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <BookOpen className="size-10 text-gray-300" />
          <p className="text-lg font-medium text-gray-800">No guides found</p>
          <p className="text-sm text-gray-500">
            Try a different search term.
          </p>
        </div>
      ) : (
        sections.map((section) => {
          const meta = MODULE_META[section.module];
          const Icon = meta.icon;
          return (
            <div key={section.module} className="p-1.5">
              <div className="mb-2 flex items-center gap-2">
                <span
                  className={cn(
                    "grid size-8 place-items-center rounded-xl",
                    meta.tone
                  )}
                >
                  <Icon className="size-4" />
                </span>
                <p className="text-sm font-semibold text-gray-800">
                  {section.module}
                </p>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                  {section.guides.length}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {section.guides.map((guide) => (
                  <GuideCard
                    key={guide.id}
                    guide={guide}
                    expanded={expandedId === guide.id}
                    onToggle={() => toggle(guide.id)}
                  />
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

function GuideCard({
  guide,
  expanded,
  onToggle,
}: {
  guide: Guide;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-[20px] border border-gray-100 bg-white shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
      >
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-emerald-50 text-base font-bold text-emerald-700">
            <BookOpen className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-800">
              {guide.title}
            </p>
            <p className="mt-0.5 line-clamp-2 text-xs text-gray-500">
              {guide.description}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="hidden items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500 sm:inline-flex">
            <Clock className="size-3.5" /> {guide.minutes} min
          </span>
          <ChevronDown
            className={cn(
              "size-4 text-gray-400 transition-transform",
              expanded && "rotate-180"
            )}
          />
        </div>
      </button>
      {expanded && (
        <div className="divide-y divide-gray-100 border-t border-gray-100 px-5">
          {guide.steps.map((step, index) => (
            <div key={step.title} className="flex gap-3 py-4">
              <div className="grid size-7 shrink-0 place-items-center rounded-full bg-emerald-50 text-xs font-bold text-emerald-700">
                {index + 1}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-800">{step.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-gray-600">
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
