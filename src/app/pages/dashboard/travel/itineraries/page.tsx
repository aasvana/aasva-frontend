"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import {
  CirclePlusIcon,
  EllipsisVertical,
  Pencil,
  Plus,
  Route,
  Trash2,
  X,
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
import { useCustomerStore } from "@/stores/customerStore";
import {
  ITINERARY_STATUSES,
  Itinerary,
  ItineraryItem,
  ItineraryStatus,
  useItineraryStore,
} from "@/stores/itineraryStore";
import { SUPPLIER_CATEGORIES } from "@/stores/supplierStore";
import { notify } from "@/lib/notify";
import { StatusBadge } from "@/components/travel/status-badge";

const newItem = (): ItineraryItem => ({
  id: `item_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
  day: "",
  category: "activity",
  title: "",
  location: "",
  description: "",
});

type ItineraryForm = {
  title: string;
  customerId: string;
  customerName: string;
  destination: string;
  startDate: string;
  endDate: string;
  status: string;
  notes: string;
  items: ItineraryItem[];
};

const EMPTY_FORM: ItineraryForm = {
  title: "",
  customerId: "",
  customerName: "",
  destination: "",
  startDate: "",
  endDate: "",
  status: "Draft",
  notes: "",
  items: [],
};

export default function ItinerariesPage() {
  const itineraries = useItineraryStore((s) => s.itineraries);
  const addItinerary = useItineraryStore((s) => s.addItinerary);
  const updateItinerary = useItineraryStore((s) => s.updateItinerary);
  const deleteItinerary = useItineraryStore((s) => s.deleteItinerary);
  const customers = useCustomerStore((s) => s.customers);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Itinerary | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);

  const filtered = useMemo(() => {
    const query = searchTerm.toLowerCase();
    if (!query) return itineraries;
    return itineraries.filter((i) =>
      `${i.title} ${i.customerName} ${i.destination} ${i.status}`
        .toLowerCase()
        .includes(query)
    );
  }, [itineraries, searchTerm]);

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setOpen(true);
  };

  const openEdit = (itinerary: Itinerary) => {
    setEditing(itinerary);
    setForm({
      title: itinerary.title,
      customerId: itinerary.customerId,
      customerName: itinerary.customerName,
      destination: itinerary.destination,
      startDate: itinerary.startDate,
      endDate: itinerary.endDate,
      status: itinerary.status,
      notes: itinerary.notes,
      items: itinerary.items.map((item) => ({ ...item })),
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

  const updateItem = (id: string, patch: Partial<ItineraryItem>) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id ? { ...item, ...patch } : item
      ),
    }));
  };

  const removeItem = (id: string) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  };

  const handleSave = () => {
    if (!form.title.trim()) {
      toast.error("Itinerary title is required.");
      return;
    }
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
    for (const item of form.items) {
      if (!item.title.trim()) {
        toast.error("Every itinerary day needs a title.");
        return;
      }
    }

    const data = {
      ...form,
      status: form.status as ItineraryStatus,
      title: form.title.trim(),
      customerName: form.customerName.trim(),
      destination: form.destination.trim(),
      notes: form.notes.trim(),
      items: form.items.map((item) => ({
        ...item,
        title: item.title.trim(),
        location: item.location.trim(),
        description: item.description.trim(),
      })),
    };

    if (editing) {
      updateItinerary(editing.id, data);
      notify({
        type: "info",
        category: "travel",
        title: "Itinerary updated",
        message: `${data.title} · ${data.destination}`,
        customer: data.customerName,
        link: "/dashboard/travel/itineraries",
      });
    } else {
      addItinerary(data);
      notify({
        type: "success",
        category: "travel",
        title: "Itinerary created",
        message: `${data.title} · ${data.destination}`,
        customer: data.customerName,
        link: "/dashboard/travel/itineraries",
      });
    }
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between p-1.5">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Itineraries</h1>
          <p className="text-sm text-gray-500">
            Plan day-by-day trips with hotels, flights, transport and activities.
          </p>
        </div>
        <Button onClick={openAdd}>
          <CirclePlusIcon /> Add Itinerary
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 p-1.5 lg:grid-cols-4">
        {ITINERARY_STATUSES.map((status) => {
          const count = itineraries.filter((i) => i.status === status).length;
          return (
            <div
              key={status}
              className="rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-gray-500">{status}</p>
                <StatusBadge status={status} />
              </div>
              <p className="mt-1 text-2xl font-bold text-gray-900">{count}</p>
            </div>
          );
        })}
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
                    placeholder="Search itineraries..."
                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 ps-9 pe-3 block text-sm shadow-2xs outline-none transition-[color,box-shadow] focus-visible:border-emerald-400 focus-visible:ring-emerald-100 focus-visible:ring-[3px]"
                  />
                  <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-3">
                    <Route className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
              <div className="overflow-hidden min-h-[350px]">
                {itineraries.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-4 h-[350px] text-center">
                    <Route className="size-10 text-gray-300" />
                    <p className="text-lg font-medium text-gray-800">
                      No itineraries yet
                    </p>
                    <p className="text-sm text-gray-500">
                      Create the first day-by-day plan for a trip.
                    </p>
                    <Button onClick={openAdd}>
                      <CirclePlusIcon /> Add Itinerary
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
                          "title",
                          "customer",
                          "destination",
                          "dates",
                          "days",
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
                      {filtered.map((itinerary) => (
                        <tr key={itinerary.id}>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                            {itinerary.title}
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-600 dark:text-neutral-300">
                            {itinerary.customerName}
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-600 dark:text-neutral-300">
                            {itinerary.destination}
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-500">
                            {format(new Date(itinerary.startDate), "dd MMM")} –{" "}
                            {format(new Date(itinerary.endDate), "dd MMM")}
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-600 dark:text-neutral-300">
                            {itinerary.items.length}
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm">
                            <StatusBadge status={itinerary.status} />
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-end text-sm font-medium">
                            <DropdownMenu>
                              <DropdownMenuTrigger>
                                <EllipsisVertical />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent side="left" align="start">
                                <DropdownMenuItem
                                  onClick={() => openEdit(itinerary)}
                                >
                                  <Pencil /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    if (
                                      window.confirm(
                                        `Delete the itinerary "${itinerary.title}"?`
                                      )
                                    ) {
                                      deleteItinerary(itinerary.id);
                                      toast.success("Itinerary deleted.");
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
              {editing ? "Edit Itinerary" : "Add Itinerary"}
            </SheetTitle>
            <SheetDescription>
              Build the trip outline and add day-by-day items.
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 overflow-y-auto px-4">
            <div className="grid gap-1.5">
              <Label>
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                value={form.title}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="e.g. Dubai Family Getaway"
              />
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
                    {ITINERARY_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

            <div className="flex items-center justify-between">
              <Label>Day-by-day plan</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    items: [...prev.items, newItem()],
                  }))
                }
              >
                <Plus /> Add Item
              </Button>
            </div>

            {form.items.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-center text-sm text-gray-500">
                No itinerary items yet. Add the first activity, stay or transfer.
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {form.items.map((item, index) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-gray-100 bg-gray-50/60 p-3"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-xs font-semibold text-gray-600">
                        Item {index + 1}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500"
                        aria-label="Remove item"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="grid gap-1">
                        <Label>Day</Label>
                        <Input
                          type="number"
                          min={1}
                          value={item.day}
                          onChange={(e) =>
                            updateItem(item.id, { day: e.target.value })
                          }
                          placeholder="1"
                        />
                      </div>
                      <div className="col-span-2 grid gap-1">
                        <Label>Category</Label>
                        <Select
                          value={item.category}
                          onValueChange={(v) =>
                            updateItem(item.id, { category: v as typeof item.category })
                          }
                        >
                          <SelectTrigger className="w-full bg-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {SUPPLIER_CATEGORIES.map((category) => (
                              <SelectItem
                                key={category.value}
                                value={category.value}
                              >
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="mt-2 grid gap-1">
                      <Label>
                        Title <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        value={item.title}
                        onChange={(e) =>
                          updateItem(item.id, { title: e.target.value })
                        }
                        placeholder="e.g. Check-in at Atlantis"
                      />
                    </div>
                    <div className="mt-2 grid gap-1">
                      <Label>Location</Label>
                      <Input
                        value={item.location}
                        onChange={(e) =>
                          updateItem(item.id, { location: e.target.value })
                        }
                        placeholder="e.g. Palm Jumeirah"
                      />
                    </div>
                    <div className="mt-2 grid gap-1">
                      <Label>Description</Label>
                      <Textarea
                        value={item.description}
                        onChange={(e) =>
                          updateItem(item.id, { description: e.target.value })
                        }
                        rows={2}
                        placeholder="Optional details..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="grid gap-1.5">
              <Label>Notes</Label>
              <Textarea
                value={form.notes}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, notes: e.target.value }))
                }
                rows={2}
                placeholder="Optional trip notes..."
              />
            </div>
          </div>
          <SheetFooter>
            <Button onClick={handleSave}>
              {editing ? "Save Changes" : "Create Itinerary"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
