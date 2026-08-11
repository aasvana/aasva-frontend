"use client";

import Link from "next/link";
import { MapPin, Settings2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOutletStore } from "@/stores/outletStore";
import { cn } from "@/lib/utils";

export function OutletSwitcher({ className }: { className?: string }) {
  const outlets = useOutletStore((s) => s.outlets);
  const activeOutletId = useOutletStore((s) => s.activeOutletId);
  const setActiveOutlet = useOutletStore((s) => s.setActiveOutlet);

  return (
    <Select value={activeOutletId} onValueChange={setActiveOutlet}>
      <SelectTrigger
        className={cn("w-[230px] bg-white", className)}
      >
        <MapPin className="size-4 shrink-0 text-gray-400" />
        <SelectValue placeholder="Select outlet" />
      </SelectTrigger>
      <SelectContent>
        {outlets.map((outlet) => (
          <SelectItem key={outlet.id} value={outlet.id}>
            <span className="flex items-center gap-2">
              {outlet.name}
              {outlet.isDefault && (
                <span className="rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                  Default
                </span>
              )}
            </span>
          </SelectItem>
        ))}
        <div className="border-t border-gray-100 p-1.5">
          <Link
            href="/dashboard/pos/outlets"
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
          >
            <Settings2 className="size-4" />
            Manage outlets
          </Link>
        </div>
      </SelectContent>
    </Select>
  );
}
