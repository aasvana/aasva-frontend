"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CirclePlusIcon,
  EllipsisVertical,
  PackageOpen,
  Pencil,
  Search,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MasterField } from "@/components/cv/master-data-manager";
import { useCustomerStore, Customer } from "@/stores/customerStore";
import {
  useCustomerProfileStore,
  CustomerProfile,
  EMPTY_PROFILE,
  ProfileSection,
} from "@/stores/customerProfileStore";

export function customerInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const statTones = {
  default: "bg-emerald-50 text-emerald-700",
  sky: "bg-sky-50 text-sky-700",
  violet: "bg-violet-50 text-violet-700",
  amber: "bg-amber-50 text-amber-700",
} as const;

export function StatCard({
  label,
  value,
  icon,
  tone = "default",
}: {
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  tone?: keyof typeof statTones;
}) {
  return (
    <div className="rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-gray-500">{label}</p>
        <span
          className={cn(
            "grid size-8 place-items-center rounded-xl",
            statTones[tone]
          )}
        >
          {icon}
        </span>
      </div>
      <p className="mt-2 text-2xl font-semibold text-gray-800">{value}</p>
    </div>
  );
}

export function formatTime(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const actionTones: Record<string, string> = {
  created: "bg-emerald-50 text-emerald-700",
  added: "bg-emerald-50 text-emerald-700",
  updated: "bg-sky-50 text-sky-700",
  deleted: "bg-red-50 text-red-700",
  booked: "bg-violet-50 text-violet-700",
  emailed: "bg-indigo-50 text-indigo-700",
  called: "bg-amber-50 text-amber-700",
  paid: "bg-teal-50 text-teal-700",
  invoiced: "bg-amber-50 text-amber-700",
};

export function actionBadge(action: string) {
  const normalized = action.toLowerCase();
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-[11px] font-medium capitalize",
        actionTones[normalized] ?? "bg-gray-100 text-gray-600"
      )}
    >
      {normalized}
    </span>
  );
}

export function statusPill(status: string) {
  const normalized = status.toLowerCase();
  const tone = [
    "delivered",
    "confirmed",
    "applied",
    "paid",
    "approved",
    "received",
    "completed",
  ].includes(normalized)
    ? "bg-emerald-50 text-emerald-700"
    : [
        "processing",
        "pending",
        "partially_paid",
        "partially paid",
        "requested",
        "cancelled",
        "canceled",
      ].includes(normalized)
      ? "bg-amber-50 text-amber-700"
      : ["cancelled", "canceled", "rejected", "failed"].includes(normalized)
        ? "bg-red-50 text-red-700"
        : "bg-gray-100 text-gray-600";
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium capitalize",
        tone
      )}
    >
      {status}
    </span>
  );
}

export function useSelectedCustomer() {
  const customers = useCustomerStore((s) => s.customers);
  const selectedCustomerId = useCustomerProfileStore((s) => s.selectedCustomerId);
  const setSelectedCustomer = useCustomerProfileStore((s) => s.setSelectedCustomer);
  const profiles = useCustomerProfileStore((s) => s.profiles);

  const customer: Customer | null =
    customers.find((c) => c.id === selectedCustomerId) ?? customers[0] ?? null;
  const profile: CustomerProfile = customer
    ? profiles[customer.id] ?? EMPTY_PROFILE
    : EMPTY_PROFILE;

  return { customers, customer, profile, setSelectedCustomer };
}

export function CustomerPageHeader({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  const { customers, customer, setSelectedCustomer } = useSelectedCustomer();

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-1.5">
      <div className="flex items-center gap-3">
        {customer && (
          <div className="grid size-11 place-items-center rounded-full bg-emerald-50 text-sm font-bold text-emerald-700">
            {customerInitials(customer.name)}
          </div>
        )}
        <div>
          <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {children}
        <select
          value={customer?.id ?? ""}
          onChange={(e) => setSelectedCustomer(e.target.value)}
          className="h-11 max-w-56 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition-[color,box-shadow] focus-visible:border-emerald-400 focus-visible:ring-emerald-100 focus-visible:ring-[3px]"
          aria-label="Select customer"
        >
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export function ProfileCard({
  title,
  subtitle,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm sm:p-6",
        className
      )}
    >
      <div className="mb-4">
        <p className="text-sm font-semibold text-gray-800">{title}</p>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

export function Field({
  label,
  required = false,
  children,
  className,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-1.5", className)}>
      <span className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      {children}
    </div>
  );
}

export const inputClasses =
  "h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition-[color,box-shadow] focus-visible:border-emerald-400 focus-visible:ring-emerald-100 focus-visible:ring-[3px]";

export const selectClasses = inputClasses;

export function EmptyState({
  icon,
  title,
  description,
}: {
  icon?: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      {icon}
      <div>
        <p className="text-lg font-medium text-gray-800">{title}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
}

export type ProfileField = {
  name: string;
  label: string;
  type?: "text" | "date" | "select";
  options?: { value: string; label: string }[];
  full?: boolean;
};

export function ProfileSectionForm({
  pageTitle,
  pageDescription,
  cardTitle,
  cardSubtitle,
  section,
  fields,
}: {
  pageTitle: string;
  pageDescription: string;
  cardTitle: string;
  cardSubtitle: string;
  section: ProfileSection;
  fields: ProfileField[];
}) {
  const { customer, profile } = useSelectedCustomer();
  const updateSection = useCustomerProfileStore((s) => s.updateSection);
  const addActivity = useCustomerProfileStore((s) => s.addActivity);

  const sectionValues = profile[section] as Record<string, string>;

  const [form, setForm] = useState<Record<string, string>>({});

  useEffect(() => {
    setForm(sectionValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customer?.id]);

  if (!customer) return null;

  const setValue = (name: string, value: string) =>
    setForm((prev) => ({ ...prev, [name]: value }));

  const handleSave = () => {
    updateSection(customer.id, section, form);
    addActivity(customer.id, {
      action: "updated",
      details: `Updated the ${cardTitle.toLowerCase()} section.`,
      timestamp: new Date().toISOString(),
    });
    toast.success(`${cardTitle} saved.`);
  };

  return (
    <div className="flex flex-col gap-4">
      <CustomerPageHeader title={pageTitle} description={pageDescription} />
      <div className="p-1.5">
        <ProfileCard title={cardTitle} subtitle={cardSubtitle}>
          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map((field) => (
              <Field
                key={field.name}
                label={field.label}
                className={field.full ? "sm:col-span-2" : undefined}
              >
                {field.type === "select" ? (
                  <select
                    value={form[field.name] ?? ""}
                    onChange={(e) => setValue(field.name, e.target.value)}
                    className={selectClasses}
                  >
                    <option value="">Select…</option>
                    {field.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type ?? "text"}
                    value={form[field.name] ?? ""}
                    onChange={(e) => setValue(field.name, e.target.value)}
                    className={inputClasses}
                  />
                )}
              </Field>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </ProfileCard>
      </div>
    </div>
  );
}

type CollectionManagerProps<T extends { id: string }> = {
  title: string;
  description: string;
  addLabel: string;
  emptyTitle: string;
  emptyDescription: string;
  searchPlaceholder: string;
  fields: MasterField[];
  tableHeaders: string[];
  rowCells: (item: T) => React.ReactNode[];
  getItems: (profile: CustomerProfile) => T[];
  searchText: (item: T) => string;
  add: (customerId: string, data: Omit<T, "id">) => void;
  update?: (customerId: string, id: string, data: Omit<T, "id">) => void;
  remove: (customerId: string, id: string) => void;
};

export function CustomerCollectionManager<T extends { id: string }>({
  title,
  description,
  addLabel,
  emptyTitle,
  emptyDescription,
  searchPlaceholder,
  fields,
  tableHeaders,
  rowCells,
  getItems,
  searchText,
  add,
  update,
  remove,
}: CollectionManagerProps<T>) {
  const { customer, profile } = useSelectedCustomer();
  const addActivity = useCustomerProfileStore((s) => s.addActivity);

  const items = useMemo(
    () => (customer ? getItems(profile) : []),
    [customer, profile, getItems]
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);
  const [draft, setDraft] = useState<Record<string, string>>({});

  const filtered = useMemo(() => {
    const query = searchTerm.toLowerCase();
    if (!query) return items;
    return items.filter((item) => searchText(item).toLowerCase().includes(query));
  }, [items, searchTerm, searchText]);

  if (!customer) {
    return (
      <div className="flex flex-col gap-4">
        <CustomerPageHeader title={title} description={description} />
        <div className="p-1.5">
          <ProfileCard title={title}>
            <EmptyState
              title="No customer selected"
              description="Pick a customer from the switcher above."
            />
          </ProfileCard>
        </div>
      </div>
    );
  }

  const openAdd = () => {
    setEditing(null);
    setDraft(
      Object.fromEntries(fields.map((f) => [f.name, f.options?.[0]?.value ?? ""]))
    );
    setSheetOpen(true);
  };

  const openEdit = (item: T) => {
    setEditing(item);
    const record = item as unknown as Record<string, string>;
    setDraft(Object.fromEntries(fields.map((f) => [f.name, record[f.name] ?? ""])));
    setSheetOpen(true);
  };

  const handleSave = () => {
    for (const field of fields) {
      if (field.required && !draft[field.name]?.trim()) {
        toast.error(`${field.label} is required`);
        return;
      }
    }
    const data = Object.fromEntries(
      fields.map((f) => [f.name, draft[f.name] ?? ""])
    ) as Omit<T, "id">;

    if (editing) {
      update?.(customer.id, editing.id, data);
      addActivity(customer.id, {
        action: "updated",
        details: `Updated ${title.toLowerCase()} record.`,
        timestamp: new Date().toISOString(),
      });
      toast.success(`${title} updated successfully!`);
    } else {
      add(customer.id, data);
      addActivity(customer.id, {
        action: "added",
        details: `Added a new ${title.toLowerCase()} record.`,
        timestamp: new Date().toISOString(),
      });
      toast.success(`${title} added successfully!`);
    }
    setSheetOpen(false);
  };

  const handleDelete = (item: T) => {
    const name = searchText(item);
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    remove(customer.id, item.id);
    addActivity(customer.id, {
      action: "deleted",
      details: `Deleted ${title.toLowerCase()} record.`,
      timestamp: new Date().toISOString(),
    });
    toast.success(`${title} deleted.`);
  };

  return (
    <div className="flex flex-col gap-4">
      <CustomerPageHeader title={title} description={description} />

      <div className="flex flex-col p-1.5">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            <div className="border border-gray-100 rounded-[20px] divide-y divide-gray-100">
              <div className="flex flex-row items-center justify-between gap-3 px-4 py-3">
                <div className="relative w-full max-w-sm">
                  <label className="sr-only">Search</label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 ps-9 pe-3 block text-sm shadow-2xs outline-none transition-[color,box-shadow] focus-visible:border-emerald-400 focus-visible:ring-emerald-100 focus-visible:ring-[3px]"
                  />
                  <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-3">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
                <Button onClick={openAdd}>
                  <CirclePlusIcon /> {addLabel}
                </Button>
              </div>
              <div className="overflow-hidden min-h-[300px]">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-4 h-[300px] text-center">
                    <PackageOpen className="size-10 text-gray-300" />
                    <p className="text-lg font-medium text-gray-800">
                      {emptyTitle}
                    </p>
                    <p className="text-sm text-gray-500">{emptyDescription}</p>
                    <Button onClick={openAdd}>
                      <CirclePlusIcon /> {addLabel}
                    </Button>
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-4 h-[300px] text-center">
                    <p className="text-lg font-medium text-gray-800">
                      No results found
                    </p>
                    <p className="text-sm text-gray-500">
                      Try adjusting your search term.
                    </p>
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {[...tableHeaders, "Action"].map((header, idx) => (
                          <th
                            key={idx}
                            scope="col"
                            className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filtered.map((item) => (
                        <tr key={item.id}>
                          {rowCells(item).map((cell, idx) => (
                            <td
                              key={idx}
                              className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-700"
                            >
                              {cell}
                            </td>
                          ))}
                          <td className="px-6 py-2.5 whitespace-nowrap text-end text-sm font-medium">
                            <DropdownMenu>
                              <DropdownMenuTrigger>
                                <EllipsisVertical />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent side="left" align="start">
                                {update && (
                                  <DropdownMenuItem onClick={() => openEdit(item)}>
                                    <Pencil /> Edit
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem onClick={() => handleDelete(item)}>
                                  <Trash2 /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{editing ? `Edit ${addLabel}` : addLabel}</SheetTitle>
            <SheetDescription>
              {editing
                ? "Update the details below and save your changes."
                : "Fill in the details below to add a new entry."}
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 overflow-y-auto px-4">
            {fields.map((field) => (
              <div key={field.name} className="grid gap-1.5">
                <Label htmlFor={field.name}>
                  {field.label}
                  {field.required && <span className="text-red-500"> *</span>}
                </Label>
                {field.type === "select" ? (
                  <Select
                    value={draft[field.name] ?? ""}
                    onValueChange={(value) =>
                      setDraft((prev) => ({ ...prev, [field.name]: value }))
                    }
                  >
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder={`Select ${field.label}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {(field.options ?? []).map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id={field.name}
                    type={field.type ?? "text"}
                    value={draft[field.name] ?? ""}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        [field.name]: e.target.value,
                      }))
                    }
                    placeholder={field.placeholder}
                  />
                )}
              </div>
            ))}
          </div>
          <SheetFooter>
            <Button onClick={handleSave}>
              {editing ? "Save Changes" : addLabel}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}


