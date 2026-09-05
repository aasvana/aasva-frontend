'use client';
import { brand } from "@/constants/brand";
import { MODULE_PAGE_KEY } from "@/constants/pages";
import { ROLE_LABELS, ROLE_MODULES } from "@/constants/roles";
import { useAuthStore } from "@/stores/AuthStore";
import { usePageAccessStore } from "@/stores/pageAccessStore";
import { getNextOnboardingRoute } from "@/helpers/pageAccess";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";

const isModuleAllowed = (
  title: string,
  access: Record<string, boolean>
): boolean => {
  const key = MODULE_PAGE_KEY[title];
  return key ? access[key] ?? true : true;
};

const ModuleSelectionPage = () => {
  const router = useRouter();
  const role = useAuthStore((state) => state.role);
  const setModules = useAuthStore((state) => state.setModules);
  const access = usePageAccessStore((state) => state.access);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!role) {
      router.replace(getNextOnboardingRoute());
      return;
    }
    const available = (ROLE_MODULES[role] ?? []).filter((title) =>
      isModuleAllowed(title, access)
    );
    setSelected(new Set(available));
  }, [role, access, router]);

  const availableModules = useMemo(() => {
    if (!role) return [];
    return (ROLE_MODULES[role] ?? []).filter((title) =>
      isModuleAllowed(title, access)
    );
  }, [role, access]);

  if (!role) return null;

  const toggleModule = (title: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(title)) {
        next.delete(title);
      } else {
        next.add(title);
      }
      return next;
    });
  };

  const handleContinue = () => {
    if (submitting) return;
    setSubmitting(true);
    setModules(Array.from(selected));
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-primary-100 px-4 py-10">
      <div className="max-w-4xl w-full mx-auto my-auto">
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-semibold uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            Welcome to {brand.name}
          </span>
          <h1 className="mt-5 text-slate-900 text-3xl sm:text-4xl font-bold">
            Pick your modules
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-500 max-w-xl mx-auto leading-relaxed">
            {role ? (
              <>
                As a <span className="font-medium text-slate-800">{ROLE_LABELS[role]}</span>,
                choose which modules you want on your dashboard. You can change
                this anytime.
              </>
            ) : (
              "Choose which modules you want on your dashboard."
            )}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {availableModules.map((title) => {
            const isSelected = selected.has(title);
            return (
              <button
                key={title}
                type="button"
                onClick={() => toggleModule(title)}
                disabled={submitting}
                className={cn(
                  "group flex items-center justify-between gap-4 bg-white rounded-2xl border p-5 text-left transition-all duration-200 cursor-pointer",
                  "hover:border-emerald-300 hover:shadow-md",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500",
                  isSelected && "border-emerald-500 ring-1 ring-emerald-500",
                  submitting && "pointer-events-none opacity-60"
                )}
              >
                <span className="text-slate-900 font-semibold text-base">
                  {title}
                </span>
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-colors",
                    isSelected
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : "border-slate-300 bg-white text-transparent group-hover:border-emerald-400"
                  )}
                >
                  <svg
                    className="h-3.5 w-3.5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
              </button>
            );
          })}
        </div>

        {availableModules.length === 0 && (
          <p className="mt-6 text-center text-sm text-slate-500">
            No modules are available for this role right now.
          </p>
        )}

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            onClick={handleContinue}
            disabled={submitting}
            className="w-full sm:w-auto cursor-pointer shadow-xl py-2.5 px-8 text-sm font-semibold rounded text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none disabled:opacity-60"
          >
            {submitting ? "Setting up your dashboard..." : "Continue to Dashboard"}
          </button>
          <Link
            href="/onboarding/role"
            className="text-sm text-slate-600 hover:text-emerald-600 font-medium"
          >
            Change role
          </Link>
        </div>
      </div>

      <p className="text-center text-sm text-slate-500">
        You can always change your modules later from the{" "}
        <Link href="/dashboard/settings" className="text-emerald-600 font-medium hover:underline">
          Settings
        </Link>{" "}
        or your profile menu.
      </p>
    </div>
  );
};

export default ModuleSelectionPage;
