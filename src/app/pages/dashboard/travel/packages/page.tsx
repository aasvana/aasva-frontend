"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  apiCreatePackage,
  apiDeletePackage,
  apiSearchPackages,
  apiUpdatePackage,
  PackagePricingType,
  PackageStatus,
  TourPackage,
} from "@/lib/packages-api";
import { apiGetDestinations, Destination } from "@/lib/destinations-api";
import { compressImageToDataUrl } from "@/lib/image-utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Combobox } from "@/components/ui/combobox";
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ArrowUpDown, ArrowDown, ArrowUp, CheckCircle2, CirclePlusIcon, Edit2, Eye, FileImage, PackageOpen, Plus, Search, Star, Trash2, X } from "lucide-react";
import { toast } from "sonner";

type DayDraft = { subject: string; description: string };
type ImageDraft = { imageUrl: string; altText: string; isCover: boolean };
type ItemDraft = { title: string };

const EMPTY_DAY = { subject: "", description: "" };
const STATUS_LABELS: Record<PackageStatus, string> = {
  draft: "Draft",
  active: "Active",
  inactive: "Inactive",
  archived: "Archived",
};

export default function PackagesPage() {
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [destinationFilter, setDestinationFilter] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<TourPackage | null>(null);
  const [viewing, setViewing] = useState<TourPackage | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);

  const [name, setName] = useState("");
  const [destinationId, setDestinationId] = useState("");
  const [durationDays, setDurationDays] = useState("1");
  const [durationNights, setDurationNights] = useState("0");
  const [basePrice, setBasePrice] = useState("0");
  const [pricingType, setPricingType] = useState<PackagePricingType>("PER_PERSON");
  const [status, setStatus] = useState<PackageStatus>("draft");
  const [isPublic, setIsPublic] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [days, setDays] = useState<DayDraft[]>([EMPTY_DAY]);
  const [images, setImages] = useState<ImageDraft[]>([]);
  const [inclusions, setInclusions] = useState<ItemDraft[]>([]);
  const [exclusions, setExclusions] = useState<ItemDraft[]>([]);
  const [reorderOpen, setReorderOpen] = useState(false);
  const [reorderDays, setReorderDays] = useState<DayDraft[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sensors = useSensors(useSensor(PointerSensor));

  const load = () => {
    void apiSearchPackages("")
      .then(setPackages)
      .catch(() => toast.error("Unable to load Packages."));
  };

  useEffect(load, []);

  useEffect(() => {
    void apiGetDestinations()
      .then(setDestinations)
      .catch(() => toast.error("Unable to load Destinations."));
  }, []);

  const destinationOptions = useMemo(
    () =>
      destinations.map((destination) => ({
        value: destination.id,
        label: destination.displayName || destination.name,
      })),
    [destinations],
  );

  const filteredPackages = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return packages.filter((item) => {
      const matchesTerm =
      !query ||
      `${item.name} ${item.status} ${item.shortDescription} ${item.days.map((day) => day.subject).join(" ")}`
          .toLowerCase()
          .includes(query);
      const matchesDestination =
        !destinationFilter || item.destinationId === destinationFilter;
      return matchesTerm && matchesDestination;
    });
  }, [packages, searchTerm, destinationFilter]);

  const openEditor = (item?: TourPackage) => {
    setEditing(item ?? null);
    setName(item?.name ?? "");
    setDestinationId(item?.destinationId ?? "");
    setDurationDays(String(item?.durationDays ?? 1));
    setDurationNights(String(item?.durationNights ?? 0));
    setBasePrice(String(item?.basePrice ?? 0));
    setPricingType(item?.pricingType ?? "PER_PERSON");
    setStatus(item?.status ?? "draft");
    setIsPublic(item?.isPublic ?? false);
    setIsFeatured(item?.isFeatured ?? false);
    setShortDescription(item?.shortDescription ?? "");
    setDescription(item?.description ?? "");
    setDays(
      item?.days.map((day) => ({ subject: day.subject, description: day.description })) ?? [
        EMPTY_DAY,
      ],
    );
    setImages(
      item?.images.map((image) => ({
        imageUrl: image.imageUrl,
        altText: image.altText ?? "",
        isCover: image.isCover ?? false,
      })) ?? [],
    );
    setInclusions(
      item?.inclusions.map((entry) => ({ title: entry.title })) ?? [],
    );
    setExclusions(
      item?.exclusions.map((entry) => ({ title: entry.title })) ?? [],
    );
    setOpen(true);
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const pending = Array.from(files).map(async (file) => {
      const imageUrl = await compressImageToDataUrl(file);
      return { imageUrl, altText: "", isCover: false };
    });
    try {
      const next = await Promise.all(pending);
      setImages((current) => [...current, ...next]);
      toast.success(`${next.length} image${next.length === 1 ? "" : "s"} added.`);
    } catch {
      toast.error("Unable to read the selected image.");
    }
  };

  const save = () => {
    const payload = {
      name: name.trim(),
      destinationId: destinationId || undefined,
      durationDays: Math.max(1, Number(durationDays) || 1),
      durationNights: Math.max(0, Number(durationNights) || 0),
      basePrice: Number(basePrice) || 0,
      pricingType,
      status,
      isPublic,
      isFeatured,
      shortDescription: shortDescription.trim(),
      description: description.trim(),
      days: days.map((day, index) => ({ ...day, dayOrder: index + 1 })),
      images: images.map((image, index) => ({
        imageUrl: image.imageUrl,
        altText: image.altText,
        isCover: image.isCover,
        sortOrder: index,
      })),
      inclusions: inclusions
        .map((entry, index) => ({ title: entry.title, sortOrder: index }))
        .filter((entry) => entry.title.trim()),
      exclusions: exclusions
        .map((entry, index) => ({ title: entry.title, sortOrder: index }))
        .filter((entry) => entry.title.trim()),
    };
    setSaveLoading(true);
    const request = editing
      ? apiUpdatePackage(editing.id, payload)
      : apiCreatePackage(payload);
    void request
      .then(() => {
        toast.success(editing ? "Package updated." : "Package added.");
        setOpen(false);
        load();
      })
      .catch(() => toast.error("Unable to save Package."))
      .finally(() => setSaveLoading(false));
  };

  const openReorder = () => {
    setReorderDays(days.map((day) => ({ ...day })));
    setReorderOpen(true);
  };

  const saveReorder = () => {
    setDays(reorderDays.map((day) => ({ ...day })));
    setReorderOpen(false);
    toast.success("Itinerary order updated.");
  };

  const payloadValid = name.trim() && days.every((day) => day.subject.trim());

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
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
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
                  <div className="w-full sm:w-64">
                    <Combobox
                      options={destinationOptions}
                      value={destinationFilter}
                      onChange={setDestinationFilter}
                      placeholder="All destinations"
                      searchPlaceholder="Search destinations..."
                      emptyLabel="No destinations found."
                      className="h-11"
                    />
                  </div>
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
                    <p className="text-sm text-gray-500">Try adjusting your search term or destination filter.</p>
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 text-left">
                      <tr>
                        {['Package', 'Days', 'Price', 'Status', 'Public', 'Action'].map((header) => (
                          <th key={header} className="px-6 py-3 text-xs font-medium uppercase text-gray-500">{header}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredPackages.map((item) => (
                        <tr key={item.id}>
                          <td className="whitespace-nowrap px-6 py-2.5 text-sm font-medium text-gray-800">
                            <div className="flex items-center gap-2">
                              {item.name}
                              {item.isFeatured && (
                                <Star className="size-3.5 fill-amber-400 text-amber-400" aria-label="Featured" />
                              )}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-2.5 text-sm text-gray-700">
                            {item.durationDays} days
                            {item.durationNights > 0 && ` / ${item.durationNights} nights`}
                          </td>
                          <td className="whitespace-nowrap px-6 py-2.5 text-sm text-gray-700">
                            {Number(item.basePrice ?? 0).toFixed(2)}
                            {item.pricingType === "PER_PACKAGE" ? " / package" : " / person"}
                          </td>
                          <td className="whitespace-nowrap px-6 py-2.5 text-sm">
                            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                              item.status === "active"
                                ? "bg-emerald-50 text-emerald-700"
                                : item.status === "draft"
                                  ? "bg-amber-50 text-amber-700"
                                  : item.status === "archived"
                                    ? "bg-gray-100 text-gray-500"
                                    : "bg-gray-100 text-gray-600"
                            }`}>
                              {STATUS_LABELS[item.status] ?? item.status}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-6 py-2.5 text-sm">
                            {item.isPublic ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-700">
                                <CheckCircle2 className="size-3.5" /> Public
                              </span>
                            ) : (
                              <span className="text-xs text-gray-400">Private</span>
                            )}
                          </td>
                          <td className="whitespace-nowrap px-6 py-2.5 text-sm"><div className="flex items-center gap-1">
                            <Button size="icon" variant="ghost" aria-label="View Package" onClick={() => setViewing(item)}><Eye className="size-4" /></Button>
                            <Button size="icon" variant="ghost" aria-label="Edit Package" onClick={() => openEditor(item)}><Edit2 className="size-4" /></Button>
                            <Button size="icon" variant="ghost" className="text-red-600" aria-label="Delete Package" onClick={() => { if (!window.confirm(`Delete ${item.name}?`)) return; void apiDeletePackage(item.id).then(() => { toast.success("Package deleted."); load(); }).catch(() => toast.error("Unable to delete Package.")); }}><Trash2 className="size-4" /></Button>
                          </div></td>
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
        <DrawerContent className="top-0 right-0 h-full w-full overflow-y-auto sm:max-w-2xl">
          <DrawerHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <DrawerTitle>{editing ? "Edit Package" : "Add Package"}</DrawerTitle>
                <DrawerDescription>
                  Reusable itinerary that can be applied to a voucher. Vouchers copy this
                  content at save time, so edits here never affect existing vouchers.
                </DrawerDescription>
              </div>
            </div>
          </DrawerHeader>
          <div className="grid gap-6 px-4">
            <section className="grid gap-3">
              <h3 className="text-sm font-semibold text-gray-500">Basic info</h3>
              <div className="grid gap-1.5">
                <Label htmlFor="package-name">Package name</Label>
                <Input id="package-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Kashmir 5 Days" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1.5"><Label htmlFor="package-days">Duration days</Label><Input id="package-days" type="number" min="1" value={durationDays} onChange={(event) => setDurationDays(event.target.value)} /></div>
                <div className="grid gap-1.5"><Label htmlFor="package-nights">Duration nights</Label><Input id="package-nights" type="number" min="0" value={durationNights} onChange={(event) => setDurationNights(event.target.value)} /></div>
              </div>
              <div className="grid gap-1.5">
                <Label>Destination</Label>
                <Combobox
                  options={destinationOptions}
                  value={destinationId}
                  onChange={setDestinationId}
                  placeholder="Select destination"
                  searchPlaceholder="Search destinations..."
                  emptyLabel="No destinations found."
                />
              </div>
            </section>

            <section className="grid gap-3">
              <h3 className="text-sm font-semibold text-gray-500">Pricing & status</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1.5"><Label htmlFor="package-price">Base price</Label><Input id="package-price" type="number" min="0" step="0.01" value={basePrice} onChange={(event) => setBasePrice(event.target.value)} /></div>
                <div className="grid gap-1.5"><Label>Pricing type</Label>
                  <Select value={pricingType} onValueChange={(value: PackagePricingType) => setPricingType(value)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PER_PERSON">Per person</SelectItem>
                      <SelectItem value="PER_PACKAGE">Per package</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1.5"><Label>Status</Label>
                  <Select value={status} onValueChange={(value: PackageStatus) => setStatus(value)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(STATUS_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid content-end gap-1.5 pb-1">
                  <div className="flex items-center gap-2">
                    <Checkbox id="package-public" checked={isPublic} onCheckedChange={(checked) => setIsPublic(checked === true)} />
                    <Label htmlFor="package-public" className="cursor-pointer">Publish publicly</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="package-featured" checked={isFeatured} onCheckedChange={(checked) => setIsFeatured(checked === true)} />
                    <Label htmlFor="package-featured" className="cursor-pointer">Featured</Label>
                  </div>
                </div>
              </div>
            </section>

            <section className="grid gap-3">
              <h3 className="text-sm font-semibold text-gray-500">Description</h3>
              <div className="grid gap-1.5">
                <Label htmlFor="package-short">Short description</Label>
                <Textarea id="package-short" value={shortDescription} onChange={(event) => setShortDescription(event.target.value)} placeholder="One-line summary shown in listings." className="min-h-[60px]" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="package-description">Full description</Label>
                <Textarea id="package-description" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Describe the package in detail." className="min-h-[120px]" />
              </div>
            </section>

            <section className="grid gap-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-500">Images</h3>
                <Button type="button" size="sm" variant="outline" onClick={() => fileInputRef.current?.click()}>
                  <FileImage className="size-4" /> Add images
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(event) => { void handleFiles(event.target.files); event.target.value = ""; }}
                />
              </div>
              {images.length === 0 ? (
                <p className="text-sm text-gray-500">No images yet. Add photos to showcase the package.</p>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {images.map((image, index) => {
                    const isCover = image.isCover;
                    const hasCover = images.some((entry) => entry.isCover);
                    return (
                      <div key={index} className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={image.imageUrl} alt={image.altText || "Package image"} className="h-28 w-full object-cover" />
                        {isCover && (
                          <span className="absolute top-2 left-2 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-medium text-white">
                            Cover
                          </span>
                        )}
                        <div className="grid gap-1.5 p-2">
                          <Input
                            value={image.altText}
                            onChange={(event) =>
                              setImages((current) =>
                                current.map((entry, entryIndex) =>
                                  entryIndex === index ? { ...entry, altText: event.target.value } : entry,
                                ),
                              )
                            }
                            placeholder="Alt text"
                            className="h-8 text-xs"
                          />
                          <div className="flex items-center justify-between">
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              className="h-7 px-2 text-xs"
                              disabled={isCover}
                              onClick={() =>
                                setImages((current) =>
                                  current.map((entry, entryIndex) => ({ ...entry, isCover: entryIndex === index })),
                                )
                              }
                            >
                              {isCover ? "Cover" : hasCover ? "Set cover" : "Make cover"}
                            </Button>
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              className="size-7 text-red-600"
                              aria-label="Remove image"
                              onClick={() =>
                                setImages((current) => current.filter((_, entryIndex) => entryIndex !== index))
                              }
                            >
                              <X className="size-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            <section className="grid gap-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-500">Itinerary</h3>
                <div className="flex items-center gap-2">
                  <Button type="button" size="sm" variant="outline" onClick={openReorder} aria-label="Reorder itineraries">
                    <ArrowUpDown className="size-4" /> Reorder
                  </Button>
                  <Button type="button" size="sm" variant="outline" onClick={() => setDays((current) => [...current, EMPTY_DAY])}>
                    <Plus className="size-4" /> Add day
                  </Button>
                </div>
              </div>
              {days.map((day, index) => (
                <div key={index} className="grid gap-3 rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">Day {index + 1}</p>
                    {days.length > 1 && (
                      <Button type="button" size="icon" variant="ghost" className="size-7 text-red-600" aria-label={`Delete Day ${index + 1}`} onClick={() => setDays((current) => current.filter((_, dayIndex) => dayIndex !== index))}>
                        <Trash2 className="size-4" />
                      </Button>
                    )}
                  </div>
                  <Input
                    value={day.subject}
                    onChange={(event) => setDays((current) => current.map((entry, entryIndex) => entryIndex === index ? { ...entry, subject: event.target.value } : entry))}
                    placeholder="Day subject"
                  />
                  <Textarea
                    value={day.description}
                    onChange={(event) => setDays((current) => current.map((entry, entryIndex) => entryIndex === index ? { ...entry, description: event.target.value } : entry))}
                    placeholder="Itinerary description"
                    className="min-h-[80px]"
                  />
                </div>
              ))}
            </section>

            <section className="grid gap-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-500">Included</h3>
                <Button type="button" size="sm" variant="outline" onClick={() => setInclusions((current) => [...current, { title: "" }])}>
                  <Plus className="size-4" /> Add
                </Button>
              </div>
              {inclusions.length === 0 && (
                <p className="text-sm text-gray-500">No inclusion entries yet. Add what&apos;s covered.</p>
              )}
              {inclusions.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Button type="button" size="icon" variant="ghost" className="size-8 shrink-0" aria-label="Move up" disabled={index === 0} onClick={() => setInclusions((current) => moveItem(current, index, -1))}>
                    <ArrowUp className="size-4" />
                  </Button>
                  <Button type="button" size="icon" variant="ghost" className="size-8 shrink-0" aria-label="Move down" disabled={index === inclusions.length - 1} onClick={() => setInclusions((current) => moveItem(current, index, 1))}>
                    <ArrowDown className="size-4" />
                  </Button>
                  <Input
                    value={entry.title}
                    onChange={(event) => setInclusions((current) => current.map((item, itemIndex) => itemIndex === index ? { title: event.target.value } : item))}
                    placeholder="e.g. AC deluxe room"
                  />
                  <Button type="button" size="icon" variant="ghost" className="size-8 shrink-0 text-red-600" aria-label="Remove" onClick={() => setInclusions((current) => current.filter((_, itemIndex) => itemIndex !== index))}>
                    <X className="size-4" />
                  </Button>
                </div>
              ))}
            </section>

            <section className="grid gap-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-500">Not included</h3>
                <Button type="button" size="sm" variant="outline" onClick={() => setExclusions((current) => [...current, { title: "" }])}>
                  <Plus className="size-4" /> Add
                </Button>
              </div>
              {exclusions.length === 0 && (
                <p className="text-sm text-gray-500">No exclusion entries yet. Add what&apos;s not covered.</p>
              )}
              {exclusions.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Button type="button" size="icon" variant="ghost" className="size-8 shrink-0" aria-label="Move up" disabled={index === 0} onClick={() => setExclusions((current) => moveItem(current, index, -1))}>
                    <ArrowUp className="size-4" />
                  </Button>
                  <Button type="button" size="icon" variant="ghost" className="size-8 shrink-0" aria-label="Move down" disabled={index === exclusions.length - 1} onClick={() => setExclusions((current) => moveItem(current, index, 1))}>
                    <ArrowDown className="size-4" />
                  </Button>
                  <Input
                    value={entry.title}
                    onChange={(event) => setExclusions((current) => current.map((item, itemIndex) => itemIndex === index ? { title: event.target.value } : item))}
                    placeholder="e.g. Airfare"
                  />
                  <Button type="button" size="icon" variant="ghost" className="size-8 shrink-0 text-red-600" aria-label="Remove" onClick={() => setExclusions((current) => current.filter((_, itemIndex) => itemIndex !== index))}>
                    <X className="size-4" />
                  </Button>
                </div>
              ))}
            </section>
          </div>
          <DrawerFooter>
            <Button
              disabled={!payloadValid || saveLoading}
              onClick={save}
            >
              {saveLoading ? "Saving..." : editing ? "Update Package" : "Save Package"}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <Drawer open={!!viewing} onOpenChange={(value) => !value && setViewing(null)} direction="right">
        <DrawerContent className="top-0 right-0 h-full w-full overflow-y-auto sm:max-w-2xl">
          <DrawerHeader>
            <DrawerTitle>{viewing?.name}</DrawerTitle>
            <DrawerDescription>
              {viewing?.durationDays} days{viewing && viewing.durationNights > 0 ? ` / ${viewing.durationNights} nights` : ""} ·{" "}
              {Number(viewing?.basePrice ?? 0).toFixed(2)} per{" "}
              {viewing?.pricingType === "PER_PACKAGE" ? "package" : "person"} · {viewing?.status}
              {viewing?.isPublic ? " · Public" : ""}
            </DrawerDescription>
          </DrawerHeader>
          <div className="grid gap-6 px-4">
            {viewing?.images.length ? (
              <div className="grid grid-cols-3 gap-3">
                {viewing.images.map((image, index) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={index} src={image.imageUrl} alt={image.altText || viewing.name} className="h-28 w-full rounded-xl object-cover" />
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No images for this package.</p>
            )}
            {(viewing?.shortDescription || viewing?.description) && (
              <section className="grid gap-2">
                {viewing?.shortDescription && <p className="text-sm text-gray-600">{viewing.shortDescription}</p>}
                {viewing?.description && <p className="whitespace-pre-wrap text-sm text-gray-600">{viewing.description}</p>}
              </section>
            )}
            {viewing?.inclusions.length ? (
              <section className="grid gap-2">
                <h3 className="text-sm font-semibold text-gray-500">Included</h3>
                {viewing.inclusions.map((entry) => <p key={entry.title} className="text-sm text-gray-700">• {entry.title}</p>)}
              </section>
            ) : null}
            {viewing?.exclusions.length ? (
              <section className="grid gap-2">
                <h3 className="text-sm font-semibold text-gray-500">Not included</h3>
                {viewing.exclusions.map((entry) => <p key={entry.title} className="text-sm text-gray-700">• {entry.title}</p>)}
              </section>
            ) : null}
            <section className="grid gap-3">
              <h3 className="text-sm font-semibold text-gray-500">Itinerary</h3>
              {viewing?.days.map((day) => (
                <div key={day.dayOrder} className="rounded-lg border p-3">
                  <p className="font-semibold">Day {day.dayOrder} · {day.subject}</p>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-gray-600">{day.description}</p>
                </div>
              ))}
            </section>
          </div>
        </DrawerContent>
      </Drawer>

      <Sheet open={reorderOpen} onOpenChange={setReorderOpen}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Reorder Itineraries</SheetTitle>
            <SheetDescription>Drag the items to change the itinerary order.</SheetDescription>
          </SheetHeader>
          <div className="px-4">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={({ active, over }) => {
                if (!over || active.id === over.id) return;
                const oldIndex = Number(active.id);
                const newIndex = Number(over.id);
                const next = [...reorderDays];
                const [moved] = next.splice(oldIndex, 1);
                next.splice(newIndex, 0, moved);
                setReorderDays(next);
              }}
            >
              <SortableContext items={reorderDays.map((_, index) => String(index))} strategy={verticalListSortingStrategy}>
                <div className="grid gap-2">
                  {reorderDays.map((day, index) => (
                    <ReorderRow key={index} id={String(index)} index={index} subject={day.subject} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
          <SheetFooter>
            <Button variant="outline" onClick={() => setReorderOpen(false)}>Cancel</Button>
            <Button onClick={saveReorder}>Save Order</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </main>
  );
}

function moveItem<T>(items: T[], index: number, delta: number): T[] {
  const next = [...items];
  const target = index + delta;
  if (target < 0 || target >= next.length) return next;
  const [moved] = next.splice(index, 1);
  next.splice(target, 0, moved);
  return next;
}

function ReorderRow({ id, index, subject }: { id: string; index: number; subject: string }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  return (
    <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }} {...attributes} className="flex min-h-12 items-center gap-3 rounded-lg border bg-white px-3 py-2">
      <button type="button" {...listeners} className="cursor-grab touch-none text-gray-400" aria-label={`Drag Day ${index + 1}`}>
        <ArrowUpDown className="size-4" />
      </button>
      <span className="w-14 text-sm font-medium">Day {index + 1}</span>
      <span className="truncate text-sm">{subject || "Untitled day"}</span>
    </div>
  );
}
