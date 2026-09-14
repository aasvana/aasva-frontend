"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Search, SearchX, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useClientReady } from "@/hooks/useClientReady";
import { useCustomerProfileStore } from "@/stores/customerProfileStore";
import {
  GROUPS,
  GROUP_HREF,
  SearchResult,
  filterIndex,
  indexAll,
} from "@/modules/search";

const MAX_PER_GROUP = 12;

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState<SearchResult[]>([]);
  const router = useRouter();
  const setSelectedCustomer = useCustomerProfileStore(
    (s) => s.setSelectedCustomer
  );

  useEffect(() => {
    let cancelled = false;
    indexAll().then((results) => {
      if (!cancelled) setIndex(results);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const results = useMemo(
    () => filterIndex(index, query),
    [index, query]
  );
  const grouped = useMemo(() => {
    const map = new Map<string, SearchResult[]>();
    for (const resultItem of results) {
      const list = map.get(resultItem.group);
      if (list) {
        list.push(resultItem);
      } else {
        map.set(resultItem.group, [resultItem]);
      }
    }
    return GROUPS.filter((group) => map.has(group)).map((group) => ({
      group,
      items: map.get(group)!,
    }));
  }, [results]);

  const ready = useClientReady();
  if (!ready) return null;

  const trimmed = query.trim();
  const showModules = trimmed.length === 0;
  const showHint = trimmed.length > 0 && trimmed.length < 2;
  const totalResults = results.length;
  const firstResult = results[0];

  const open = (resultItem: SearchResult) => {
    if (resultItem.customerId) {
      setSelectedCustomer(resultItem.customerId);
    }
    router.push(resultItem.href);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="p-1.5">
        <h1 className="text-xl font-semibold text-gray-800">Search</h1>
        <p className="text-sm text-gray-500">
          Search the entire workspace and jump straight to any record, module or guide.
        </p>
      </div>

      <div className="p-1.5">
        <div className="relative max-w-2xl">
          <label className="sr-only">Search workspace</label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && firstResult) open(firstResult);
            }}
            placeholder="Search invoices, customers, bookings, products…"
            className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 ps-10 pe-3 block text-sm shadow-2xs outline-none transition-[color,box-shadow] focus-visible:border-emerald-400 focus-visible:ring-emerald-100 focus-visible:ring-[3px]"
          />
          <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-3">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          {trimmed && (
            <span className="absolute inset-y-0 end-3 flex items-center text-xs text-gray-400">
              {totalResults} result{totalResults === 1 ? "" : "s"}
            </span>
          )}
        </div>
      </div>

      {showModules && (
        <div className="p-1.5">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="size-4 text-emerald-600" />
            <p className="text-sm font-semibold text-gray-800">
              Browse modules
            </p>
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
              {results.length}
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((resultItem) => (
              <button
                key={resultItem.id}
                type="button"
                onClick={() => open(resultItem)}
                className="rounded-[20px] border border-gray-100 bg-white p-4 text-left shadow-sm transition-colors hover:border-emerald-200 hover:bg-emerald-50/40"
              >
                <p className="text-sm font-semibold text-gray-800">
                  {resultItem.label}
                </p>
                <p className="mt-0.5 text-xs text-gray-500">
                  {resultItem.subtitle}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {showHint && (
        <div className="p-1.5">
          <div className="rounded-[20px] border border-gray-100 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-800">
              Keep typing to search the workspace
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Results appear for customers, invoices, bookings, products,
              deliveries, requests, guides and more.
            </p>
          </div>
        </div>
      )}

      {!showModules &&
        !showHint &&
        grouped.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <SearchX className="size-10 text-gray-300" />
            <p className="text-lg font-medium text-gray-800">
              No results for &ldquo;{query}&rdquo;
            </p>
            <p className="text-sm text-gray-500">
              Try a different keyword or a shorter term.
            </p>
          </div>
        )}

      {!showModules &&
        !showHint &&
        grouped.length > 0 &&
        grouped.map(({ group, items }) => {
          const visible = items.slice(0, MAX_PER_GROUP);
          const hidden = items.length - visible.length;
          return (
            <div key={group} className="p-1.5">
              <div className="mb-2 flex items-center gap-2">
                <p className="text-sm font-semibold text-gray-800">{group}</p>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                  {items.length}
                </span>
              </div>
              <div className="overflow-hidden rounded-[20px] border border-gray-100 bg-white shadow-sm">
                <div className="divide-y divide-gray-100">
                  {visible.map((resultItem) => (
                    <button
                      key={resultItem.id}
                      type="button"
                      onClick={() => open(resultItem)}
                      className="group flex w-full items-center justify-between gap-3 px-5 py-3 text-left transition-colors hover:bg-gray-50"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-gray-800">
                          {resultItem.label}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-gray-500">
                          {resultItem.subtitle}
                        </p>
                      </div>
                      <ArrowUpRight className="size-4 shrink-0 text-gray-300 transition-colors group-hover:text-emerald-600" />
                    </button>
                  ))}
                  {hidden > 0 && (
                    <button
                      type="button"
                      onClick={() =>
                        router.push(GROUP_HREF[group] ?? firstResult.href)
                      }
                      className="flex w-full items-center justify-between gap-3 px-5 py-3 text-left transition-colors hover:bg-gray-50"
                    >
                      <p className="text-sm font-medium text-emerald-700">
                        View all {hidden} more {group.toLowerCase()} record
                        {hidden === 1 ? "" : "s"}
                      </p>
                      <ArrowUpRight className="size-4 shrink-0 text-emerald-600" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

      {!showModules && !showHint && grouped.length > 0 && (
        <div className="p-1.5">
          <p className={cn("text-xs text-gray-400")}>
            Press Enter to open the first result.
          </p>
        </div>
      )}
    </div>
  );
}
