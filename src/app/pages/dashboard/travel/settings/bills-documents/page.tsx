"use client";

import { useEffect, useState } from "react";
import { RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CURRENCIES } from "@/modules/invoice";
import { paymentTypes } from "@/constants/paymentTypes";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTravelSettings } from "@/lib/travel-settings-query";

export default function BillsDocumentsSettingsPage() {
  const { settings: serverSettings, updateMutation } = useTravelSettings();
  const [prefix, setPrefix] = useState("");
  const [suffix, setSuffix] = useState("");
  const [invoicePrefix, setInvoicePrefix] = useState("");
  const [invoiceSuffix, setInvoiceSuffix] = useState("");
  const [defaultCurrency, setDefaultCurrency] = useState("USD");
  const [defaultPaymentType, setDefaultPaymentType] = useState("Full Payment");
  const [defaultTaxRate, setDefaultTaxRate] = useState("18");
  const example = `${prefix}001${suffix}`;

  useEffect(() => {
    if (!serverSettings) return;
    setPrefix(serverSettings.voucherPrefix);
    setSuffix(serverSettings.voucherSuffix);
    setInvoicePrefix(serverSettings.invoicePrefix);
    setInvoiceSuffix(serverSettings.invoiceSuffix);
    setDefaultCurrency(serverSettings.defaultCurrency);
    setDefaultPaymentType(serverSettings.defaultPaymentType);
    setDefaultTaxRate(String(serverSettings.defaultTaxRate));
  }, [serverSettings]);

  const save = () => {
    updateMutation.mutate(
      { voucherPrefix: prefix.trim(), voucherSuffix: suffix.trim(), invoicePrefix, invoiceSuffix, defaultCurrency, defaultPaymentType, defaultTaxRate: Number(defaultTaxRate) || 0 },
      { onSuccess: () => toast.success("Bills and documents settings saved."), onError: (error) => toast.error(error.message) },
    );
  };

  const reset = () => {
    setPrefix("");
    setSuffix("");
    setInvoicePrefix("INV-");
    setInvoiceSuffix("1001");
    setDefaultCurrency("USD");
    setDefaultPaymentType("Full Payment");
    setDefaultTaxRate("18");
    updateMutation.mutate({ voucherPrefix: "", voucherSuffix: "", invoicePrefix: "INV-", invoiceSuffix: "1001", defaultCurrency: "USD", defaultPaymentType: "Full Payment", defaultTaxRate: 18 }, { onSuccess: () => toast.success("Bills and documents settings reset."), onError: (error) => toast.error(error.message) });
  };

  return (
    <div className="flex max-w-3xl flex-col gap-4">
      <div className="flex items-center justify-between p-1.5">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Bills and Documents</h1>
          <p className="text-sm text-gray-500">Configure voucher and invoice document numbering.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={reset}><RotateCcw /> Reset</Button>
          <Button onClick={save}>Save Changes</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Voucher Settings</CardTitle>
          <CardDescription>Defaults applied when creating a new confirmation voucher.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-1.5">
            <Label htmlFor="voucherPrefix">Voucher No Prefix</Label>
            <Input id="voucherPrefix" value={prefix} onChange={(event) => setPrefix(event.target.value)} placeholder="e.g. Aasvana/Kol/A/" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="voucherSuffix">Voucher No Suffix</Label>
            <Input id="voucherSuffix" value={suffix} onChange={(event) => setSuffix(event.target.value)} placeholder="e.g. /CV-2026" />
          </div>
          <div className="sm:col-span-2 rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-3 text-sm">
            <span className="text-gray-500">Example voucher no: </span><span className="font-semibold text-gray-800">{example}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Invoice Number</CardTitle>
          <CardDescription>Prefix and suffix added around the auto-generated invoice number.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-1.5">
            <Label htmlFor="invoicePrefix">Invoice No Prefix</Label>
            <Input id="invoicePrefix" value={invoicePrefix} onChange={(event) => setInvoicePrefix(event.target.value)} placeholder="e.g. Aasvana/Kol/A/" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="invoiceSuffix">Invoice No Suffix</Label>
            <Input id="invoiceSuffix" value={invoiceSuffix} onChange={(event) => setInvoiceSuffix(event.target.value)} placeholder="e.g. /INV-2026" />
          </div>
          <div className="sm:col-span-2 rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-3 text-sm">
            <span className="text-gray-500">Example invoice no: </span><span className="font-semibold text-gray-800">001</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Defaults</CardTitle>
          <CardDescription>Pre-filled values for new confirmation vouchers.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-1.5"><Label htmlFor="defaultCurrency">Default Currency</Label><Select value={defaultCurrency} onValueChange={setDefaultCurrency}><SelectTrigger id="defaultCurrency"><SelectValue /></SelectTrigger><SelectContent>{CURRENCIES.map((currency) => <SelectItem key={currency.value} value={currency.value}>{currency.label}</SelectItem>)}</SelectContent></Select></div>
          <div className="grid gap-1.5"><Label htmlFor="defaultPaymentType">Default Payment Type</Label><Select value={defaultPaymentType} onValueChange={setDefaultPaymentType}><SelectTrigger id="defaultPaymentType"><SelectValue /></SelectTrigger><SelectContent>{paymentTypes.map((paymentType) => <SelectItem key={paymentType.code} value={paymentType.name}>{paymentType.name}</SelectItem>)}</SelectContent></Select></div>
          <div className="grid gap-1.5 sm:col-span-2"><Label htmlFor="defaultTaxRate">Default Tax Rate (%)</Label><Input id="defaultTaxRate" type="number" min={0} max={100} value={defaultTaxRate} onChange={(event) => setDefaultTaxRate(event.target.value)} placeholder="e.g. 18" /></div>
        </CardContent>
      </Card>
    </div>
  );
}
