"use client";

import { useEffect, useState } from "react";
import { RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { brand } from "@/constants/brand";
import { paymentTypes } from "@/constants/paymentTypes";
import { CURRENCIES } from "@/modules/invoice";
import { useTravelSettings } from "@/lib/travel-settings-query";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

export default function CvSettingsPage() {
  const { settings: serverSettings, updateMutation } = useTravelSettings();

  const [defaultCurrency, setDefaultCurrency] = useState("USD");
  const [voucherPrefix, setVoucherPrefix] = useState("");
  const [voucherSuffix, setVoucherSuffix] = useState("");
  const [defaultPaymentType, setDefaultPaymentType] = useState("Full Payment");
  const [defaultTaxRate, setDefaultTaxRate] = useState("18");

  useEffect(() => {
    if (!serverSettings) return;
    setDefaultCurrency(serverSettings.defaultCurrency);
    setVoucherPrefix(serverSettings.voucherPrefix);
    setVoucherSuffix(serverSettings.voucherSuffix);
    setDefaultPaymentType(serverSettings.defaultPaymentType);
    setDefaultTaxRate(String(serverSettings.defaultTaxRate));
  }, [serverSettings]);

  const exampleVoucherNo = `${voucherPrefix}001${voucherSuffix}`;

  const handleSave = () => {
    updateMutation.mutate(
      {
        defaultCurrency,
         voucherPrefix: voucherPrefix.trim(),
         voucherSuffix: voucherSuffix.trim(),
        defaultPaymentType,
        defaultTaxRate: Number(defaultTaxRate) || 0,
      },
      {
        onSuccess: () => toast.success("Confirmation voucher settings updated successfully!"),
        onError: (error) => toast.error(error.message),
      },
    );
  };

  const handleReset = () => {
    if (!window.confirm("Reset all confirmation voucher settings and lists?")) {
      return;
    }
    setDefaultCurrency("USD");
    setVoucherPrefix("");
    setVoucherSuffix("");
    setDefaultPaymentType("Full Payment");
    setDefaultTaxRate("18");
    updateMutation.mutate({ defaultCurrency: "USD", voucherPrefix: "", voucherSuffix: "", defaultPaymentType: "Full Payment", defaultTaxRate: 18 }, { onSuccess: () => toast.success("Confirmation voucher settings reset."), onError: (error) => toast.error(error.message) });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row items-center justify-between p-1.5">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            Voucher Settings
          </h1>
          <p className="text-sm text-gray-500">
            Defaults applied when you create a new confirmation voucher.
          </p>
        </div>
        <Button variant="outline" onClick={handleReset}>
          <RotateCcw /> Reset
        </Button>
      </div>

      <div className="p-1.5">
        <Card>
          <CardHeader>
            <CardTitle>Voucher Number</CardTitle>
            <CardDescription>
              Prefix and suffix added around the auto-generated voucher number.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Voucher No Prefix">
                <Input
                  value={voucherPrefix}
                  onChange={(e) => setVoucherPrefix(e.target.value)}
                  placeholder={`e.g. ${brand.name}/Kol/A/`}
                />
              </Field>
              <Field label="Voucher No Suffix">
                <Input
                  value={voucherSuffix}
                  onChange={(e) => setVoucherSuffix(e.target.value)}
                  placeholder="e.g. /CV-2026"
                />
              </Field>
            </div>
            <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-3 text-sm">
              <span className="text-gray-500">Example voucher no: </span>
              <span className="font-semibold text-gray-800">
                {exampleVoucherNo}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Defaults</CardTitle>
            <CardDescription>
              Pre-filled values for new confirmation vouchers.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Default Currency">
                <Select value={defaultCurrency} onValueChange={setDefaultCurrency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Default Payment Type">
                <Select
                  value={defaultPaymentType}
                  onValueChange={setDefaultPaymentType}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentTypes.map((pt) => (
                      <SelectItem key={pt.code} value={pt.name}>
                        {pt.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <Separator />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Default Tax Rate (%)">
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={defaultTaxRate}
                  onChange={(e) => setDefaultTaxRate(e.target.value)}
                  placeholder="e.g. 18"
                />
              </Field>
            </div>
          </CardContent>
          <CardFooter className="justify-end gap-2 border-t px-6 py-4">
            <Button onClick={handleSave}>Save Changes</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
