"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CURRENCIES } from "@/modules/invoice";
import { useAccountSettingsStore } from "@/stores/accountSettingsStore";
import { useClientReady } from "@/hooks/useClientReady";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function AccountingSettingsPage() {
  const general = useAccountSettingsStore((s) => s.general);
  const updateGeneral = useAccountSettingsStore((s) => s.updateGeneral);
  const [draft, setDraft] = useState(general);

  const ready = useClientReady();
  if (!ready) return null;

  const save = () => {
    updateGeneral(draft);
    toast.success("Accounting settings saved.");
  };

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <div className="flex items-center justify-between p-1.5">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            Accounting Settings
          </h1>
          <p className="text-sm text-gray-500">
            Defaults used across your accounting books.
          </p>
        </div>
        <Button onClick={save}>Save Changes</Button>
      </div>

      <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm">
        <div className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="currency">Default currency</Label>
            <Select
              value={draft.defaultCurrency}
              onValueChange={(value) =>
                setDraft((prev) => ({ ...prev, defaultCurrency: value }))
              }
            >
              <SelectTrigger id="currency" className="w-full bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((currency) => (
                  <SelectItem key={currency.value} value={currency.value}>
                    {currency.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="fiscalYearStart">Fiscal year start</Label>
            <Select
              value={draft.fiscalYearStart}
              onValueChange={(value) =>
                setDraft((prev) => ({ ...prev, fiscalYearStart: value }))
              }
            >
              <SelectTrigger id="fiscalYearStart" className="w-full bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="taxId">Tax ID / VAT number</Label>
            <Input
              id="taxId"
              value={draft.taxId}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, taxId: e.target.value }))
              }
              placeholder="e.g. VAT-123456789"
            />
          </div>

          <div className="flex items-start gap-3">
            <Checkbox
              id="enableBankSync"
              checked={draft.enableBankSync}
              onCheckedChange={(checked) =>
                setDraft((prev) => ({
                  ...prev,
                  enableBankSync: checked === true,
                }))
              }
            />
            <div className="grid gap-1">
              <Label htmlFor="enableBankSync">Enable bank sync</Label>
              <p className="text-xs text-gray-500">
                Allow automatic import of bank statements.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
