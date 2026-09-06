'use client';
import { brand } from "@/constants/brand";
import { ROLE_OPTIONS, type UserRole } from "@/constants/roles";
import { useAuthStore } from "@/stores/AuthStore";
import { usePageAccessStore } from "@/stores/pageAccessStore";
import { getNextOnboardingRoute } from "@/helpers/pageAccess";
import { getSessionState, useSessionRestore } from "@/hooks/useSessionRestore";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const RoleSelectionPage = () => {
  const router = useRouter();
  const setRole = useAuthStore((state) => state.setRole);
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const lastUserId = useAuthStore((state) => state.lastUserId);
  const role = useAuthStore((state) => state.role);
  const modules = useAuthStore((state) => state.modules);
  const access = usePageAccessStore((state) => state.access);
  const { restoring } = useSessionRestore();
  const [selected, setSelected] = useState<UserRole | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (getSessionState() === 'restoring') return;

    if (!token) {
      router.replace(
        user || lastUserId || role || modules.length > 0 ? '/login' : '/'
      );
      return;
    }

    if (!(access["role-onboarding"] ?? true)) {
      router.replace(getNextOnboardingRoute());
    }
  }, [access, router, token, user, lastUserId, role, modules]);

  if (restoring || !token) return null;

  const handleSelect = (value: UserRole) => {
    if (submitting) return;
    setSelected(value);
    setSubmitting(true);
    setRole(value);
    router.push(getNextOnboardingRoute());
  };

  return (
    <div className="min-h-screen flex flex-col bg-primary-100 px-4 py-10">
      <div className="max-w-5xl w-full mx-auto my-auto">
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-semibold uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            Welcome to {brand.name}
          </span>
          <h1 className="mt-5 text-slate-900 text-3xl sm:text-4xl font-bold">
            What defines you best?
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-500 max-w-xl mx-auto leading-relaxed">
            Pick the space you work in and we&apos;ll tailor your dashboard to
            show the modules that matter to you.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ROLE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              disabled={submitting}
              className={cn(
                "group relative flex flex-col items-center text-center bg-white rounded-2xl border p-6 transition-all duration-200 cursor-pointer",
                "hover:-translate-y-1 hover:shadow-lg hover:border-emerald-300",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500",
                selected === option.value &&
                  "border-emerald-500 ring-2 ring-emerald-500",
                submitting && "pointer-events-none opacity-60"
              )}
            >
              <div
                className={cn(
                  "flex h-16 w-16 items-center justify-center rounded-2xl border transition-colors",
                  option.accent
                )}
              >
                <option.icon className="h-8 w-8" />
              </div>
              <h3 className="mt-5 text-slate-900 font-semibold text-base">
                {option.title}
              </h3>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                {option.description}
              </p>
              {selected === option.value && (
                <span className="absolute top-3 end-3 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white">
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
              )}
            </button>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-slate-500">
          {submitting
            ? "Setting up your dashboard..."
            : "You can change your role anytime."}
        </p>
      </div>

      <p className="text-center text-sm text-slate-500">
        Not sure yet?{" "}
        <Link href="/dashboard" className="text-emerald-600 font-medium hover:underline">
          Explore the full dashboard
        </Link>{" "}
        or{" "}
        <Link href="/login" className="text-emerald-600 font-medium hover:underline">
          sign in with a different account
        </Link>
      </p>
    </div>
  );
};

export default RoleSelectionPage;
