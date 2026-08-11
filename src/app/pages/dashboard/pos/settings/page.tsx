"use client";

import { useState } from "react";
import Link from "next/link";
import { Printer, Save, Settings2, Store, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { usePosSettingsStore } from "@/stores/posSettingsStore";
import { useOutletStore } from "@/stores/outletStore";
import { notify } from "@/lib/notify";

export default function PosSettingsPage() {
  const settings = usePosSettingsStore((s) => s.settings);
  const updateSettings = usePosSettingsStore((s) => s.updateSettings);
  const outlets = useOutletStore((s) => s.outlets);

  const [threshold, setThreshold] = useState(String(settings.lowStockThreshold));
  const [copies, setCopies] = useState(String(settings.defaultLabelCopies));

  const handleSave = () => {
    const thresholdNum = Number(threshold);
    const copiesNum = Number(copies);
    if (!Number.isInteger(thresholdNum) || thresholdNum < 0) {
      toast.error("Low stock threshold must be a whole number.");
      return;
    }
    if (!Number.isInteger(copiesNum) || copiesNum < 1) {
      toast.error("Label copies must be a whole number of at least 1.");
      return;
    }
    updateSettings({
      lowStockThreshold: thresholdNum,
      defaultLabelCopies: copiesNum,
    });
    notify({
      type: "success",
      category: "system",
      title: "Store settings saved",
      message: `Low stock threshold set to ${thresholdNum} units.`,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between p-1.5">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Store Settings</h1>
          <p className="text-sm text-gray-500">
            Configure how your store and inventory behave.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-2">
            <Tag className="size-5 text-emerald-600" />
            <h2 className="text-base font-semibold text-gray-800">
              Inventory
            </h2>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            The stock level at which a product is flagged as low.
          </p>
          <div className="mt-4 grid max-w-xs gap-1.5">
            <Label htmlFor="threshold">Low stock threshold</Label>
            <Input
              id="threshold"
              type="number"
              min={0}
              inputMode="numeric"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-2">
            <Printer className="size-5 text-emerald-600" />
            <h2 className="text-base font-semibold text-gray-800">Labels</h2>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Default number of copies when printing a product label.
          </p>
          <div className="mt-4 grid max-w-xs gap-1.5">
            <Label htmlFor="copies">Default label copies</Label>
            <Input
              id="copies"
              type="number"
              min={1}
              inputMode="numeric"
              value={copies}
              onChange={(e) => setCopies(e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-2">
            <Store className="size-5 text-emerald-600" />
            <h2 className="text-base font-semibold text-gray-800">Outlets</h2>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            {outlets.length} outlet{outlets.length === 1 ? "" : "s"} configured.
            Add, edit, or remove outlets here.
          </p>
          <Button variant="outline" asChild className="mt-4">
            <Link href="/dashboard/pos/outlets">
              <Settings2 /> Manage outlets
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex justify-end p-1.5">
        <Button onClick={handleSave}>
          <Save /> Save Settings
        </Button>
      </div>
    </div>
  );
}
