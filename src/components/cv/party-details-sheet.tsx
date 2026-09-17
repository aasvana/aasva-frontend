"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Agent } from "@/stores/agentStore";
import type { Customer } from "@/stores/customerStore";

type PartyDetails = {
  name: string;
  company: string;
  email: string;
  phone: string;
  place: string;
  notes: string;
  country?: string;
  address?: string;
  currency?: string;
  taxId?: string;
};

type PartyDetailsSheetProps = {
  kind: "customer" | "agent";
  open: boolean;
  initialName: string;
  onOpenChange: (open: boolean) => void;
  onSave: (details: PartyDetails) => void;
};

const emptyDetails = (kind: PartyDetailsSheetProps["kind"], name: string): PartyDetails =>
  kind === "customer"
    ? {
        name,
        company: "",
        email: "",
        phone: "",
        place: "",
        country: "",
        address: "",
        currency: "",
        taxId: "",
        notes: "",
      }
    : {
        name,
        company: "",
        phone: "",
        email: "",
        place: "",
        notes: "",
      };

export function PartyDetailsSheet({
  kind,
  open,
  initialName,
  onOpenChange,
  onSave,
}: PartyDetailsSheetProps) {
  const [details, setDetails] = useState<PartyDetails>(() => emptyDetails(kind, initialName));
  const isCustomer = kind === "customer";
  const label = isCustomer ? "Customer" : "Agent";

  useEffect(() => {
    if (open) setDetails(emptyDetails(kind, initialName));
  }, [initialName, kind, open]);

  const setField = (field: string, value: string) => {
    setDetails((current) => ({ ...current, [field]: value }));
  };

  const handleSave = () => {
    if (!details.name.trim()) return;
    onSave({ ...details, name: details.name.trim() });
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Add {label}</SheetTitle>
          <SheetDescription>Fill in the details below to add this {label.toLowerCase()}.</SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 overflow-y-auto px-4">
          <div className="grid gap-1.5">
            <Label htmlFor={`${kind}-details-name`}>{label} Name</Label>
            <Input
              id={`${kind}-details-name`}
              value={details.name}
              onChange={(event) => setField("name", event.target.value)}
              placeholder={isCustomer ? "e.g. Jane Cooper" : "e.g. Sekhar Rao"}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor={`${kind}-details-company`}>{isCustomer ? "Company" : "Agency / Company"}</Label>
            <Input
              id={`${kind}-details-company`}
              value={details.company}
              onChange={(event) => setField("company", event.target.value)}
              placeholder={isCustomer ? "e.g. Acme Inc." : "e.g. VR Holidays"}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor={`${kind}-details-email`}>Email</Label>
            <Input
              id={`${kind}-details-email`}
              value={details.email}
              onChange={(event) => setField("email", event.target.value)}
              placeholder="name@example.com"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor={`${kind}-details-phone`}>Phone</Label>
            <Input
              id={`${kind}-details-phone`}
              value={details.phone}
              onChange={(event) => setField("phone", event.target.value)}
              placeholder="e.g. +91 98450 11223"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor={`${kind}-details-place`}>Place / City</Label>
            <Input
              id={`${kind}-details-place`}
              value={details.place}
              onChange={(event) => setField("place", event.target.value)}
              placeholder="e.g. Mumbai"
            />
          </div>
          {isCustomer && (
            <>
              <div className="grid gap-1.5">
                <Label htmlFor="customer-details-country">Country</Label>
                <Input
                  id="customer-details-country"
                  value={details.country}
                  onChange={(event) => setField("country", event.target.value)}
                  placeholder="e.g. India"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="customer-details-address">Address</Label>
                <Input
                  id="customer-details-address"
                  value={details.address}
                  onChange={(event) => setField("address", event.target.value)}
                  placeholder="Street, area, state, ZIP"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="customer-details-currency">Currency</Label>
                <Input
                  id="customer-details-currency"
                  value={details.currency}
                  onChange={(event) => setField("currency", event.target.value)}
                  placeholder="e.g. INR"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="customer-details-tax-id">GSTIN / Tax ID</Label>
                <Input
                  id="customer-details-tax-id"
                  value={details.taxId}
                  onChange={(event) => setField("taxId", event.target.value)}
                  placeholder="e.g. 27AABCU9603R1ZM"
                />
              </div>
            </>
          )}
          <div className="grid gap-1.5">
            <Label htmlFor={`${kind}-details-notes`}>Notes</Label>
            <Textarea
              id={`${kind}-details-notes`}
              value={details.notes}
              onChange={(event) => setField("notes", event.target.value)}
              placeholder="Optional notes..."
            />
          </div>
        </div>
        <SheetFooter>
          <Button onClick={handleSave}>Add {label}</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
