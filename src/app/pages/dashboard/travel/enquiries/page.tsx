"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import {
  CirclePlusIcon,
  EllipsisVertical,
  MessageSquareText,
  Pencil,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { CURRENCIES } from "@/modules/invoice";
import { useCustomerStore } from "@/stores/customerStore";
import {
  ENQUIRY_SERVICE_TYPES,
  ENQUIRY_STATUSES,
  Enquiry,
  EnquiryStatus,
  useEnquiryStore,
} from "@/stores/enquiryStore";
import { notify } from "@/lib/notify";
import { StatusBadge } from "@/components/travel/status-badge";

const CURRENCY_OPTIONS = CURRENCIES.map((c) => ({
  value: c.value,
  label: c.label,
}));

type EnquiryForm = {
  customerId: string;
  customerName: string;
  serviceType: string;
  destination: string;
  startDate: string;
  endDate: string;
  pax: string;
  budget: string;
  currency: string;
  status: string;
  notes: string;
};

const EMPTY_FORM: EnquiryForm = {
  customerId: "",
  customerName: "",
  serviceType: ENQUIRY_SERVICE_TYPES[0],
  destination: "",
  startDate: "",
  endDate: "",
  pax: "1",
  budget: "",
  currency: "USD",
  status: "New",
  notes: "",
};

export default function EnquiriesPage() {
  const enquiries = useEnquiryStore((s) => s.enquiries);
  const addEnquiry = useEnquiryStore((s) => s.addEnquiry);
  const updateEnquiry = useEnquiryStore((s) => s.updateEnquiry);
  const deleteEnquiry = useEnquiryStore((s) => s.deleteEnquiry);
  const customers = useCustomerStore((s) => s.customers);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Enquiry | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);

  const filtered = useMemo(() => {
    const query = searchTerm.toLowerCase();
    if (!query) return enquiries;
    return enquiries.filter((e) =>
      `${e.customerName} ${e.destination} ${e.serviceType} ${e.status}`
        .toLowerCase()
        .includes(query)
    );
  }, [enquiries, searchTerm]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { New: 0, Quoted: 0, Confirmed: 0, Lost: 0 };
    for (const enquiry of enquiries) {
      counts[enquiry.status] = (counts[enquiry.status] ?? 0) + 1;
    }
    return counts;
  }, [enquiries]);

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setOpen(true);
  };

  const openEdit = (enquiry: Enquiry) => {
    setEditing(enquiry);
    setForm({
      customerId: enquiry.customerId,
      customerName: enquiry.customerName,
      serviceType: enquiry.serviceType,
      destination: enquiry.destination,
      startDate: enquiry.startDate,
      endDate: enquiry.endDate,
      pax: enquiry.pax,
      budget: enquiry.budget,
      currency: enquiry.currency,
      status: enquiry.status,
      notes: enquiry.notes,
    });
    setOpen(true);
  };

  const selectCustomer = (customerId: string) => {
    const customer = customers.find((c) => c.id === customerId);
    setForm((prev) => ({
      ...prev,
      customerId,
      customerName: customer?.name ?? prev.customerName,
    }));
  };

  const handleSave = () => {
    if (!form.customerName.trim()) {
      toast.error("Customer name is required.");
      return;
    }
    if (!form.destination.trim()) {
      toast.error("Destination is required.");
      return;
    }
    if (!form.startDate || !form.endDate) {
      toast.error("Travel dates are required.");
      return;
    }
    const paxNum = Number(form.pax);
    if (!Number.isInteger(paxNum) || paxNum <= 0) {
      toast.error("Travellers must be a whole number greater than 0.");
      return;
    }

    const data = {
      ...form,
      status: form.status as EnquiryStatus,
      customerName: form.customerName.trim(),
      destination: form.destination.trim(),
      notes: form.notes.trim(),
      pax: String(paxNum),
    };

    if (editing) {
      updateEnquiry(editing.id, data);
      notify({
        type: "info",
        category: "travel",
        title: "Enquiry updated",
        message: `${data.customerName} · ${data.destination}`,
        customer: data.customerName,
        link: "/dashboard/travel/enquiries",
      });
    } else {
      addEnquiry(data);
      notify({
        type: "success",
        category: "travel",
        title: "Enquiry added",
        message: `${data.customerName} · ${data.destination}`,
        customer: data.customerName,
        link: "/dashboard/travel/enquiries",
      });
    }
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between p-1.5">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Enquiries</h1>
          <p className="text-sm text-gray-500">
            Track travel requests from first contact to confirmed booking.
          </p>
        </div>
        <Button onClick={openAdd}>
          <CirclePlusIcon /> Add Enquiry
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 p-1.5 lg:grid-cols-4">
        {ENQUIRY_STATUSES.map((status) => (
          <div
            key={status}
            className="rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-gray-500">{status}</p>
              <StatusBadge status={status} />
            </div>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {statusCounts[status] ?? 0}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-col p-1.5">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            <div className="border border-gray-100 rounded-[20px] divide-y divide-gray-100 dark:border-neutral-700 dark:divide-neutral-700">
              <div className="py-3 px-4">
                <div className="relative w-lg max-w-sm">
                  <label className="sr-only">Search</label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search enquiries..."
                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 ps-9 pe-3 block text-sm shadow-2xs outline-none transition-[color,box-shadow] focus-visible:border-emerald-400 focus-visible:ring-emerald-100 focus-visible:ring-[3px]"
                  />
                  <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-3">
                    <MessageSquareText className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
              <div className="overflow-hidden min-h-[350px]">
                {enquiries.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-4 h-[350px] text-center">
                    <MessageSquareText className="size-10 text-gray-300" />
                    <p className="text-lg font-medium text-gray-800">
                      No enquiries yet
                    </p>
                    <p className="text-sm text-gray-500">
                      Log the first travel request to start tracking it.
                    </p>
                    <Button onClick={openAdd}>
                      <CirclePlusIcon /> Add Enquiry
                    </Button>
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-4 h-[350px] text-center">
                    <p className="text-lg font-medium text-gray-800">
                      No results found
                    </p>
                    <p className="text-sm text-gray-500">
                      Try adjusting your search term.
                    </p>
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 dark:bg-neutral-700">
                      <tr>
                        {[
                          "customer",
                          "service",
                          "destination",
                          "travel dates",
                          "pax",
                          "budget",
                          "status",
                          "Action",
                        ].map((header, idx) => (
                          <th
                            key={idx}
                            scope="col"
                            className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                      {filtered.map((enquiry) => (
                        <tr key={enquiry.id}>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                            {enquiry.customerName}
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-600 dark:text-neutral-300">
                            {enquiry.serviceType}
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-600 dark:text-neutral-300">
                            {enquiry.destination}
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-500">
                            {format(new Date(enquiry.startDate), "dd MMM")} –{" "}
                            {format(new Date(enquiry.endDate), "dd MMM")}
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-600 dark:text-neutral-300">
                            {enquiry.pax}
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm font-medium text-gray-900">
                            {enquiry.budget
                              ? `${enquiry.currency} ${Number(enquiry.budget).toLocaleString()}`
                              : "—"}
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm">
                            <StatusBadge status={enquiry.status} />
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-end text-sm font-medium">
                            <DropdownMenu>
                              <DropdownMenuTrigger>
                                <EllipsisVertical />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent side="left" align="start">
                                <DropdownMenuItem
                                  onClick={() => openEdit(enquiry)}
                                >
                                  <Pencil /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    if (
                                      window.confirm(
                                        `Delete the enquiry for ${enquiry.customerName}?`
                                      )
                                    ) {
                                      deleteEnquiry(enquiry.id);
                                      toast.success("Enquiry deleted.");
                                    }
                                  }}
                                >
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

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>
              {editing ? "Edit Enquiry" : "Add Enquiry"}
            </SheetTitle>
            <SheetDescription>
              Capture the travel request details below.
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 overflow-y-auto px-4">
            <div className="grid gap-1.5">
              <Label>
                Customer <span className="text-red-500">*</span>
              </Label>
              {customers.length > 0 ? (
                <Select
                  value={form.customerId}
                  onValueChange={selectCustomer}
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Select a customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-xs text-gray-500">
                  No customers yet — type a name below or add one from the
                  Customers page.
                </p>
              )}
              <Input
                value={form.customerName}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    customerName: e.target.value,
                  }))
                }
                placeholder="Customer name"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label>Service Type</Label>
                <Select
                  value={form.serviceType}
                  onValueChange={(v) =>
                    setForm((prev) => ({ ...prev, serviceType: v }))
                  }
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ENQUIRY_SERVICE_TYPES.map((service) => (
                      <SelectItem key={service} value={service}>
                        {service}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5">
                <Label>
                  Destination <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={form.destination}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      destination: e.target.value,
                    }))
                  }
                  placeholder="e.g. Dubai"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label>
                  Start Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="date"
                  value={form.startDate}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="grid gap-1.5">
                <Label>
                  End Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="date"
                  value={form.endDate}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      endDate: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="grid gap-1.5">
                <Label>Travellers</Label>
                <Input
                  type="number"
                  min={1}
                  inputMode="numeric"
                  value={form.pax}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, pax: e.target.value }))
                  }
                />
              </div>
              <div className="grid gap-1.5">
                <Label>Budget</Label>
                <Input
                  type="number"
                  min={0}
                  inputMode="decimal"
                  value={form.budget}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, budget: e.target.value }))
                  }
                  placeholder="e.g. 2500"
                />
              </div>
              <div className="grid gap-1.5">
                <Label>Currency</Label>
                <Select
                  value={form.currency}
                  onValueChange={(v) =>
                    setForm((prev) => ({ ...prev, currency: v }))
                  }
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCY_OPTIONS.map((currency) => (
                      <SelectItem key={currency.value} value={currency.value}>
                        {currency.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) =>
                  setForm((prev) => ({ ...prev, status: v }))
                }
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ENQUIRY_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-1.5">
              <Label>Notes</Label>
              <Textarea
                value={form.notes}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, notes: e.target.value }))
                }
                placeholder="Optional notes..."
                rows={3}
              />
            </div>
          </div>
          <SheetFooter>
            <Button onClick={handleSave}>
              {editing ? "Save Changes" : "Add Enquiry"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
