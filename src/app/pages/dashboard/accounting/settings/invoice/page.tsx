"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PAYMENT_MODES, PAYMENT_MODE_LABELS } from "@/modules/invoice";
import { useAccountSettingsStore } from "@/stores/accountSettingsStore";
import { useClientReady } from "@/hooks/useClientReady";

export default function InvoiceSettingsPage() {
  const invoice = useAccountSettingsStore((s) => s.invoice);
  const updateInvoice = useAccountSettingsStore((s) => s.updateInvoice);
  const [draft, setDraft] = useState(invoice);

  const ready = useClientReady();
  if (!ready) return null;

  const save = () => {
    updateInvoice(draft);
    toast.success("Invoice settings saved.");
  };

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <div className="flex items-center justify-between p-1.5">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            Invoice Settings
          </h1>
          <p className="text-sm text-gray-500">
            Defaults applied when creating invoices and estimates.
          </p>
        </div>
        <Button onClick={save}>Save Changes</Button>
      </div>

      <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm">
        <div className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="paymentMode">Default payment mode</Label>
            <Select
              value={draft.defaultPaymentMode}
              onValueChange={(value) =>
                setDraft((prev) => ({ ...prev, defaultPaymentMode: value }))
              }
            >
              <SelectTrigger id="paymentMode" className="w-full bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_MODES.map((mode) => (
                  <SelectItem key={mode} value={mode}>
                    {PAYMENT_MODE_LABELS[mode]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-start gap-3">
            <Checkbox
              id="includeCompany"
              checked={draft.includeCompany}
              onCheckedChange={(checked) =>
                setDraft((prev) => ({
                  ...prev,
                  includeCompany: checked === true,
                }))
              }
            />
            <div className="grid gap-1">
              <Label htmlFor="includeCompany">
                Include company details by default
              </Label>
              <p className="text-xs text-gray-500">
                Pre-fill your business details on every new invoice.
              </p>
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="defaultTerms">Default payment terms</Label>
            <Textarea
              id="defaultTerms"
              value={draft.defaultTerms}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, defaultTerms: e.target.value }))
              }
              rows={3}
              placeholder="Payment terms shown on invoices..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
