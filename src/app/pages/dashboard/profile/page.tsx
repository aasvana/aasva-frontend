"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Mail, IdCard } from "lucide-react";
import { useAuthStore } from "@/stores/AuthStore";
import { ROLE_LABELS } from "@/constants/roles";
import { currentUserName } from "@/utils/user";
import type { UserRole } from "@/constants/roles";

export default function ProfilePage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const role = useAuthStore((state) => state.role);

  const name = currentUserName("fullname", user);
  const initials = currentUserName("initial", user);

  const roleLabels = new Set(
    (user?.roles ?? []).map((r) => r.name).filter(Boolean)
  );
  if (role) roleLabels.add(role as string);

  const roleNames = Array.from(roleLabels)
    .map((r) => (ROLE_LABELS[r as UserRole] ?? r))
    .filter(Boolean);

  return (
    <div className="flex flex-col gap-4">
      <div className="p-1.5">
        <h1 className="text-xl font-semibold text-gray-800">Account</h1>
        <p className="text-sm text-gray-500">
          Your personal information and account details.
        </p>
      </div>

      <div className="p-1.5">
        <div className="rounded-[20px] border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="grid size-14 place-items-center rounded-full bg-emerald-600 text-lg font-bold text-white">
              {initials}
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-lg font-semibold text-gray-800">
                {name}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-gray-500">
                <Mail className="size-4" />
                {user?.email ?? "—"}
              </span>
            </div>
          </div>

          {roleNames.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {roleNames.map((label) => (
                <span
                  key={label}
                  className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium uppercase tracking-wide text-emerald-700"
                >
                  {label}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <button
          type="button"
          onClick={() => router.push("/dashboard/settings")}
          className="group rounded-[20px] border border-gray-100 bg-white p-5 text-left shadow-sm transition-colors hover:border-emerald-200 hover:bg-emerald-50/40"
        >
          <div className="flex items-start justify-between gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
              <IdCard className="size-5" />
            </span>
            <ArrowRight className="size-4 text-gray-300 transition-colors group-hover:text-emerald-600" />
          </div>
          <p className="mt-4 text-sm font-semibold text-gray-800">
            Edit Profile
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Update your name, email, phone and role in Settings.
          </p>
        </button>
      </div>
    </div>
  );
}
