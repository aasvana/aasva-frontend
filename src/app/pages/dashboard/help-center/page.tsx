"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  HelpCircle,
  LifeBuoy,
  Search,
  Sparkles,
  Wrench,
} from "lucide-react";

const QUICK_LINKS = [
  {
    title: "Overview",
    description: "Explore everything the Help Center has to offer.",
    href: "/dashboard/help-center",
    icon: LifeBuoy,
    tone: "bg-emerald-50 text-emerald-700",
  },
  {
    title: "Knowledge Base",
    description: "In-depth articles on every module and workflow.",
    href: "/dashboard/knowledge-base",
    icon: BookOpen,
    tone: "bg-sky-50 text-sky-700",
  },
  {
    title: "FAQs",
    description: "Quick answers to the most commonly asked questions.",
    href: "/dashboard/faqs",
    icon: HelpCircle,
    tone: "bg-violet-50 text-violet-700",
  },
  {
    title: "Guides",
    description: "Step-by-step guides for every module and workflow.",
    href: "/dashboard/guides",
    icon: CompassIcon,
    tone: "bg-indigo-50 text-indigo-700",
  },
  {
    title: "Troubleshooting",
    description: "Fix common issues with clear, ordered steps.",
    href: "/dashboard/troubleshooting",
    icon: Wrench,
    tone: "bg-amber-50 text-amber-700",
  },
  {
    title: "What's New",
    description: "Release notes and the latest features we shipped.",
    href: "/dashboard/whats-new",
    icon: Sparkles,
    tone: "bg-teal-50 text-teal-700",
  },
];

function CompassIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
}

export default function HelpCenterPage() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return QUICK_LINKS;
    return QUICK_LINKS.filter(
      (link) =>
        link.title.toLowerCase().includes(q) ||
        link.description.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="flex flex-col gap-4">
      <div className="p-1.5">
        <h1 className="text-xl font-semibold text-gray-800">Help Center</h1>
        <p className="text-sm text-gray-500">
          Everything you need to get the most out of your workspace.
        </p>
      </div>

      <div className="p-1.5">
        <div className="rounded-[20px] border border-gray-100 bg-white p-6 shadow-sm">
          <div className="relative max-w-2xl">
            <label className="sr-only">Search help topics</label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What do you need help with?"
              className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 ps-10 pe-3 block text-sm shadow-2xs outline-none transition-[color,box-shadow] focus-visible:border-emerald-400 focus-visible:ring-emerald-100 focus-visible:ring-[3px]"
            />
            <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-3">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            Browse topics below or search for something specific — guides,
            FAQs, troubleshooting steps and more.
          </p>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="p-1.5">
          <div className="rounded-[20px] border border-gray-100 bg-white p-10 text-center shadow-sm">
            <Search className="mx-auto size-10 text-gray-300" />
            <p className="mt-3 text-lg font-medium text-gray-800">
              No help topics found
            </p>
            <p className="text-sm text-gray-500">Try a different search term.</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((link) => (
            <button
              key={link.title}
              type="button"
              onClick={() => router.push(link.href)}
              className="group rounded-[20px] border border-gray-100 bg-white p-5 text-left shadow-sm transition-colors hover:border-emerald-200 hover:bg-emerald-50/40"
            >
              <div className="flex items-start justify-between gap-3">
                <span
                  className={`grid size-10 place-items-center rounded-xl ${link.tone}`}
                >
                  <link.icon className="size-5" />
                </span>
                <ArrowRight className="size-4 text-gray-300 transition-colors group-hover:text-emerald-600" />
              </div>
              <p className="mt-4 text-sm font-semibold text-gray-800">
                {link.title}
              </p>
              <p className="mt-1 text-sm text-gray-500">{link.description}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
