"use client";

import { useEffect, useMemo, useState } from "react";
import { apiCreatePackage, apiDeletePackage, apiSearchPackages, apiUpdatePackage, ItineraryTemplate } from "@/lib/itinerary-templates-api";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CirclePlusIcon, Edit2, Eye, PackageOpen, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

type Day = { subject: string; description: string };

export default function PackagesPage() {
  const [packages, setPackages] = useState<ItineraryTemplate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ItineraryTemplate | null>(null);
  const [viewing, setViewing] = useState<ItineraryTemplate | null>(null);
  const [name, setName] = useState("");
  const [numberOfDays, setNumberOfDays] = useState("1");
  const [price, setPrice] = useState("0");
  const [status, setStatus] = useState("active");
  const [days, setDays] = useState<Day[]>([{ subject: "", description: "" }]);

  const load = () => {
    void apiSearchPackages("")
      .then(setPackages)
      .catch(() => toast.error("Unable to load Packages."));
  };

  useEffect(load, []);

  const filteredPackages = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return packages;
    return packages.filter((item) =>
      `${item.subject} ${item.status} ${item.days.map((day) => day.subject).join(" ")}`
        .toLowerCase()
        .includes(query),
    );
  }, [packages, searchTerm]);

  const resizeDays = (value: string) => {
    setNumberOfDays(value);
    const count = Math.max(1, Number(value) || 1);
    setDays((current) =>
      Array.from({ length: count }, (_, index) =>
        current[index] ?? { subject: "", description: "" },
      ),
    );
  };

  const openEditor = (item?: ItineraryTemplate) => {
    setEditing(item ?? null);
    setName(item?.subject ?? "");
    setNumberOfDays(String(item?.days.length ?? 1));
    setPrice(String(item?.price ?? 0));
    setStatus(item?.status ?? "active");
    setDays(
      item?.days.map((day) => ({ subject: day.subject, description: day.description })) ?? [
        { subject: "", description: "" },
      ],
    );
    setOpen(true);
  };

  const save = () => {
    const payload = {
      name: name.trim(),
      price: Number(price) || 0,
      status,
      days: days.map((day, index) => ({ ...day, dayOrder: index + 1 })),
    };
    const request = editing
      ? apiUpdatePackage(editing.id, {
          subject: payload.name,
          price: payload.price,
          status: payload.status,
          days: payload.days,
        })
      : apiCreatePackage({ name: payload.name, days: payload.days });

    void request
      .then(() => {
        toast.success(editing ? "Package updated." : "Package added.");
        setOpen(false);
        load();
      })
      .catch(() => toast.error("Unable to save Package."));
  };

  return (
    <main className="space-y-6 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Packages</h1>
          <p className="text-sm text-gray-500">
            Manage reusable package itineraries for future vouchers.
          </p>
        </div>
        <Button onClick={() => openEditor()}>
          <CirclePlusIcon /> Add Package
        </Button>
      </div>

      <div className="flex flex-col p-1.5">
        <div className="-m-1.5 overflow-x-auto">
          <div className="inline-block min-w-full align-middle p-1.5">
            <div className="divide-y divide-gray-100 rounded-[20px] border border-gray-100 bg-white">
              <div className="px-4 py-3">
                <div className="relative w-full max-w-sm">
                  <label className="sr-only" htmlFor="package-search">Search Packages</label>
                  <Input
                    id="package-search"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search Packages..."
                    className="h-11 rounded-xl border-gray-200 bg-gray-50 pl-9"
                  />
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div className="min-h-[350px] overflow-hidden">
                {packages.length === 0 ? (
                  <div className="flex h-[350px] flex-col items-center justify-center gap-4 text-center">
                    <PackageOpen className="size-10 text-gray-300" />
                    <p className="text-lg font-medium text-gray-800">No Packages yet</p>
                    <p className="text-sm text-gray-500">Create the first reusable package itinerary.</p>
                    <Button onClick={() => openEditor()}><CirclePlusIcon /> Add Package</Button>
                  </div>
                ) : filteredPackages.length === 0 ? (
                  <div className="flex h-[350px] flex-col items-center justify-center gap-4 text-center">
                    <p className="text-lg font-medium text-gray-800">No results found</p>
                    <p className="text-sm text-gray-500">Try adjusting your search term.</p>
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 text-left">
                      <tr>
                        {['Package', 'Days', 'Price', 'Status', 'Action'].map((header) => (
                          <th key={header} className="px-6 py-3 text-xs font-medium uppercase text-gray-500">{header}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredPackages.map((item) => (
                        <tr key={item.id}>
                          <td className="whitespace-nowrap px-6 py-2.5 text-sm font-medium text-gray-800">{item.subject}</td>
                          <td className="whitespace-nowrap px-6 py-2.5 text-sm text-gray-700">{item.days.length}</td>
                          <td className="whitespace-nowrap px-6 py-2.5 text-sm text-gray-700">{Number(item.price ?? 0).toFixed(2)}</td>
                          <td className="whitespace-nowrap px-6 py-2.5 text-sm"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${item.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>{item.status === "active" ? "Active" : "Inactive"}</span></td>
                          <td className="whitespace-nowrap px-6 py-2.5 text-sm"><div className="flex items-center gap-1"><Button size="icon" variant="ghost" aria-label="View Package" onClick={() => setViewing(item)}><Eye className="size-4" /></Button><Button size="icon" variant="ghost" aria-label="Edit Package" onClick={() => openEditor(item)}><Edit2 className="size-4" /></Button><Button size="icon" variant="ghost" className="text-red-600" aria-label="Delete Package" onClick={() => { if (!window.confirm(`Delete ${item.subject}?`)) return; void apiDeletePackage(item.id).then(() => { toast.success("Package deleted."); load(); }).catch(() => toast.error("Unable to delete Package.")); }}><Trash2 className="size-4" /></Button></div></td>
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

      <Drawer open={open} onOpenChange={setOpen} direction="right">
        <DrawerContent className="top-0 right-0 h-full w-full overflow-y-auto sm:max-w-lg">
          <DrawerHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <DrawerTitle>{editing ? "Edit Package" : "Add Package"}</DrawerTitle>
                <DrawerDescription>Manage package details and ordered itinerary days.</DrawerDescription>
              </div>
              <Toggle checked={status === "active"} onChange={() => setStatus((current) => current === "active" ? "inactive" : "active")} />
            </div>
          </DrawerHeader>
          <div className="grid gap-4 px-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5"><Label>No. of Days</Label><Input type="number" min="1" value={numberOfDays} onChange={(event) => resizeDays(event.target.value)} /></div>
              <div className="grid gap-1.5"><Label>Price</Label><Input type="number" min="0" step="0.01" value={price} onChange={(event) => setPrice(event.target.value)} /></div>
            </div>
            <div className="grid gap-1.5"><Label>Package Name</Label><Input value={name} onChange={(event) => setName(event.target.value)} /></div>
            {days.map((day, index) => <div key={index} className="grid gap-3 rounded-lg border p-3"><p className="font-semibold">Day {index + 1}</p><Input value={day.subject} onChange={(event) => setDays((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, subject: event.target.value } : item))} placeholder="Day subject" /><Textarea value={day.description} onChange={(event) => setDays((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, description: event.target.value } : item))} placeholder="Itinerary description" /></div>)}
          </div>
          <DrawerFooter><Button disabled={!name.trim() || days.some((day) => !day.subject.trim() || !day.description.trim())} onClick={save}>{editing ? "Update Package" : "Save Package"}</Button></DrawerFooter>
        </DrawerContent>
      </Drawer><Drawer open={!!viewing} onOpenChange={(value) => !value && setViewing(null)} direction="right"><DrawerContent className="top-0 right-0 h-full w-full overflow-y-auto sm:max-w-lg"><DrawerHeader><DrawerTitle>{viewing?.subject}</DrawerTitle><DrawerDescription>{viewing?.days.length} days · Price {Number(viewing?.price ?? 0).toFixed(2)} · {viewing?.status}</DrawerDescription></DrawerHeader><div className="grid gap-3 px-4">{viewing?.days.map((day) => <div key={day.dayOrder} className="rounded-lg border p-3"><p className="font-semibold">Day {day.dayOrder} · {day.subject}</p><p className="mt-2 whitespace-pre-wrap text-sm text-gray-600">{day.description}</p></div>)}</div></DrawerContent></Drawer>
    </main>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return <button type="button" role="switch" aria-checked={checked} aria-label="Toggle Package status" title={checked ? "Deactivate Package" : "Activate Package"} onClick={onChange} className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${checked ? "bg-emerald-600" : "bg-slate-300"}`}><span className={`inline-block size-4 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-[18px]" : "translate-x-0.5"}`} /></button>;
}
