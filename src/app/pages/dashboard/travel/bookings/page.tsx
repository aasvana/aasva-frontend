"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import {
  CirclePlusIcon,
  EllipsisVertical,
  Pencil,
  Ticket,
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
  BOOKING_STATUSES,
  Booking,
  BookingStatus,
  useBookingStore,
} from "@/stores/bookingStore";
import {
  SUPPLIER_CATEGORIES,
  SupplierCategory,
  useSupplierStore,
} from "@/stores/supplierStore";
import { notify } from "@/lib/notify";
import { StatusBadge } from "@/components/travel/status-badge";

const CURRENCY_OPTIONS = CURRENCIES.map((c) => ({
  value: c.value,
  label: c.label,
}));

type BookingForm = {
  reference: string;
  customerId: string;
  customerName: string;
  category: SupplierCategory;
  supplierId: string;
  supplierName: string;
  service: string;
  startDate: string;
  endDate: string;
  pax: string;
  amount: string;
  currency: string;
  status: string;
  notes: string;
};

const EMPTY_FORM: BookingForm = {
  reference: "",
  customerId: "",
  customerName: "",
  category: "hotel",
  supplierId: "",
  supplierName: "",
  service: "",
  startDate: "",
  endDate: "",
  pax: "1",
  amount: "",
  currency: "USD",
  status: "Pending",
  notes: "",
};

export default function BookingsPage() {
  const bookings = useBookingStore((s) => s.bookings);
  const addBooking = useBookingStore((s) => s.addBooking);
  const updateBooking = useBookingStore((s) => s.updateBooking);
  const deleteBooking = useBookingStore((s) => s.deleteBooking);
  const customers = useCustomerStore((s) => s.customers);
  const suppliers = useSupplierStore((s) => s.suppliers);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Booking | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);

  const categorySuppliers = useMemo(
    () => suppliers.filter((s) => s.category === form.category),
    [suppliers, form.category]
  );

  const filtered = useMemo(() => {
    const query = searchTerm.toLowerCase();
    if (!query) return bookings;
    return bookings.filter((b) =>
      `${b.reference} ${b.customerName} ${b.supplierName} ${b.service} ${b.status}`
        .toLowerCase()
        .includes(query)
    );
  }, [bookings, searchTerm]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      Pending: 0,
      Confirmed: 0,
      Cancelled: 0,
      Completed: 0,
    };
    for (const booking of bookings) {
      counts[booking.status] = (counts[booking.status] ?? 0) + 1;
    }
    return counts;
  }, [bookings]);

  const openAdd = () => {
    setEditing(null);
    setForm({ ...EMPTY_FORM, reference: `BK-${1000 + bookings.length + 1}` });
    setOpen(true);
  };

  const openEdit = (booking: Booking) => {
    setEditing(booking);
    setForm({
      reference: booking.reference,
      customerId: booking.customerId,
      customerName: booking.customerName,
      category: booking.category,
      supplierId: booking.supplierId,
      supplierName: booking.supplierName,
      service: booking.service,
      startDate: booking.startDate,
      endDate: booking.endDate,
      pax: booking.pax,
      amount: booking.amount,
      currency: booking.currency,
      status: booking.status,
      notes: booking.notes,
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

  const changeCategory = (category: SupplierCategory) => {
    setForm((prev) => ({
      ...prev,
      category,
      supplierId: "",
      supplierName: "",
    }));
  };

  const selectSupplier = (supplierId: string) => {
    const supplier = suppliers.find((s) => s.id === supplierId);
    setForm((prev) => ({
      ...prev,
      supplierId,
      supplierName: supplier?.name ?? prev.supplierName,
    }));
  };

  const handleSave = () => {
    if (!form.reference.trim()) {
      toast.error("Booking reference is required.");
      return;
    }
    if (!form.customerName.trim()) {
      toast.error("Customer name is required.");
      return;
    }
    if (!form.supplierName.trim()) {
      toast.error("Supplier is required.");
      return;
    }
    if (!form.startDate || !form.endDate) {
      toast.error("Booking dates are required.");
      return;
    }
    const paxNum = Number(form.pax);
    if (!Number.isInteger(paxNum) || paxNum <= 0) {
      toast.error("Travellers must be a whole number greater than 0.");
      return;
    }

    const data = {
      ...form,
      status: form.status as BookingStatus,
      reference: form.reference.trim(),
      customerName: form.customerName.trim(),
      supplierName: form.supplierName.trim(),
      service: form.service.trim(),
      notes: form.notes.trim(),
      pax: String(paxNum),
    };

    if (editing) {
      updateBooking(editing.id, data);
      notify({
        type: "info",
        category: "travel",
        title: "Booking updated",
        message: `${data.reference} · ${data.supplierName}`,
        customer: data.customerName,
        link: "/dashboard/travel/bookings",
      });
    } else {
      addBooking(data);
      notify({
        type: "success",
        category: "travel",
        title: "Booking added",
        message: `${data.reference} · ${data.supplierName}`,
        customer: data.customerName,
        link: "/dashboard/travel/bookings",
      });
    }
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between p-1.5">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Bookings</h1>
          <p className="text-sm text-gray-500">
            Manage hotel, airline, transport and activity bookings.
          </p>
        </div>
        <Button onClick={openAdd}>
          <CirclePlusIcon /> Add Booking
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 p-1.5 lg:grid-cols-4">
        {BOOKING_STATUSES.map((status) => (
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
                    placeholder="Search bookings..."
                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 ps-9 pe-3 block text-sm shadow-2xs outline-none transition-[color,box-shadow] focus-visible:border-emerald-400 focus-visible:ring-emerald-100 focus-visible:ring-[3px]"
                  />
                  <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-3">
                    <Ticket className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
              <div className="overflow-hidden min-h-[350px]">
                {bookings.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-4 h-[350px] text-center">
                    <Ticket className="size-10 text-gray-300" />
                    <p className="text-lg font-medium text-gray-800">
                      No bookings yet
                    </p>
                    <p className="text-sm text-gray-500">
                      Add the first hotel, flight or activity booking.
                    </p>
                    <Button onClick={openAdd}>
                      <CirclePlusIcon /> Add Booking
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
                          "reference",
                          "customer",
                          "category",
                          "supplier",
                          "service",
                          "dates",
                          "pax",
                          "amount",
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
                      {filtered.map((booking) => (
                        <tr key={booking.id}>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                            {booking.reference}
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-600 dark:text-neutral-300">
                            {booking.customerName}
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-600 dark:text-neutral-300">
                            {booking.category.charAt(0).toUpperCase() +
                              booking.category.slice(1)}
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                            {booking.supplierName}
                          </td>
                          <td className="px-6 py-2.5 max-w-[220px] truncate text-sm text-gray-600 dark:text-neutral-300">
                            {booking.service || "—"}
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-500">
                            {format(new Date(booking.startDate), "dd MMM")} –{" "}
                            {format(new Date(booking.endDate), "dd MMM")}
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-600 dark:text-neutral-300">
                            {booking.pax}
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm font-medium text-gray-900">
                            {booking.amount
                              ? `${booking.currency} ${Number(booking.amount).toLocaleString()}`
                              : "—"}
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm">
                            <StatusBadge status={booking.status} />
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-end text-sm font-medium">
                            <DropdownMenu>
                              <DropdownMenuTrigger>
                                <EllipsisVertical />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent side="left" align="start">
                                <DropdownMenuItem
                                  onClick={() => openEdit(booking)}
                                >
                                  <Pencil /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    if (
                                      window.confirm(
                                        `Delete booking ${booking.reference}?`
                                      )
                                    ) {
                                      deleteBooking(booking.id);
                                      toast.success("Booking deleted.");
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
              {editing ? "Edit Booking" : "Add Booking"}
            </SheetTitle>
            <SheetDescription>
              Record a confirmed or pending booking with a supplier.
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 overflow-y-auto px-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label>
                  Reference <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={form.reference}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      reference: e.target.value,
                    }))
                  }
                  placeholder="e.g. BK-1001"
                />
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
                    {BOOKING_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

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
                <Label>Category</Label>
                <Select value={form.category} onValueChange={changeCategory}>
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPLIER_CATEGORIES.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5">
                <Label>
                  Supplier <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={form.supplierId}
                  onValueChange={selectSupplier}
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue
                      placeholder={
                        categorySuppliers.length === 0
                          ? "No suppliers in this category"
                          : "Select a supplier"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {categorySuppliers.map((supplier) => (
                      <SelectItem key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label>Service</Label>
              <Input
                value={form.service}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    service: e.target.value,
                  }))
                }
                placeholder="e.g. Deluxe Room, 2 nights"
              />
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
                <Label>Amount</Label>
                <Input
                  type="number"
                  min={0}
                  inputMode="decimal"
                  value={form.amount}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, amount: e.target.value }))
                  }
                  placeholder="e.g. 620"
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
              <Label>Notes</Label>
              <Textarea
                value={form.notes}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, notes: e.target.value }))
                }
                rows={2}
                placeholder="Optional notes..."
              />
            </div>
          </div>
          <SheetFooter>
            <Button onClick={handleSave}>
              {editing ? "Save Changes" : "Add Booking"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
