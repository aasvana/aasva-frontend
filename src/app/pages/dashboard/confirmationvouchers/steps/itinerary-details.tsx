"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { CalendarIcon, X, Bookmark, Plus, ArrowUpDown } from "lucide-react";
import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Save } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { apiCreatePackage } from "@/lib/packages-api";
import { usePackageSearch } from "@/lib/packages-query";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { addDays } from "date-fns";
import { ConfirmationVoucherFormData } from "../schema";

const ItineraryDetails = () => {
  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<ConfirmationVoucherFormData>();

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "itineraries",
  });

  const itinerariesValues = watch("itineraries");
  const numberOfTourDays = watch("numberOfTourDays");
  const [templateName, setTemplateName] = React.useState("");
  const [saveDialogOpen, setSaveDialogOpen] = React.useState(false);
  const [templateSearch, setTemplateSearch] = React.useState("");
  const [templateDialogOpen, setTemplateDialogOpen] = React.useState(false);
  const [reorderOpen, setReorderOpen] = React.useState(false);
  const [reorderItems, setReorderItems] = React.useState<typeof itinerariesValues>([]);
  const sensors = useSensors(useSensor(PointerSensor));
  const { data: templates = [] } = usePackageSearch(templateSearch);
  const journeyDate = watch("journeyDate");

  React.useEffect(() => {
    const count = Math.max(1, Number(numberOfTourDays) || 0);
    const current = itinerariesValues ?? [];
    if (current.length !== count) {
      replace(Array.from({ length: count }, (_, index) => current[index] ?? { date: new Date(), subject: "", itinerary: "" }));
    }
  }, [numberOfTourDays, replace]);

  const handleAddItinerary = () => {
    append({ date: new Date(), subject: "", itinerary: "" });
  };

  const applyTemplate = (template: (typeof templates)[number]) => {
    const count = Math.max(1, Number(numberOfTourDays) || 1);
    const current = itinerariesValues ?? [];
    replace(Array.from({ length: count }, (_, index) => ({
      date: current[index]?.date ?? new Date(),
      subject: template.days[index]?.subject ?? "",
      itinerary: template.days[index]?.description ?? "",
    })));
    setValue("packageName", template.name, { shouldDirty: true, shouldValidate: true });
    if (template.days.length !== count) toast.info(`This saved itinerary contains ${template.days.length} days, but this voucher has ${count} tour days. Only the first ${Math.min(template.days.length, count)} days were applied.`);
    setTemplateDialogOpen(false);
  };
  const openReorder = () => { setReorderItems([...(itinerariesValues ?? [])]); setReorderOpen(true); };
  const saveReorder = () => { const start = journeyDate ? new Date(journeyDate) : new Date(); replace((reorderItems ?? []).map((item, index) => ({ ...item, date: addDays(start, index) }))); setReorderOpen(false); toast.success("Itinerary order updated successfully."); };

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-end gap-2">
        <Input value={templateSearch} onChange={(event) => setTemplateSearch(event.target.value)} placeholder="Search Package..." className="h-10 w-full max-w-[350px] min-w-[220px]" />
        <TooltipProvider>
          <Tooltip><TooltipTrigger asChild><Button type="button" variant="outline" size="icon" className="size-10 shrink-0" aria-label="View Packages" onClick={() => setTemplateDialogOpen(true)}><Bookmark className="size-4" /></Button></TooltipTrigger><TooltipContent>View Packages</TooltipContent></Tooltip>
          <Tooltip><TooltipTrigger asChild><Button type="button" variant="outline" size="icon" className="size-10 shrink-0" aria-label="Save as Package" onClick={() => setSaveDialogOpen(true)}><Save className="size-4" /></Button></TooltipTrigger><TooltipContent>Save as Package</TooltipContent></Tooltip>
          <Tooltip><TooltipTrigger asChild><Button type="button" variant="outline" size="icon" className="size-10 shrink-0" aria-label="Reorder itineraries" onClick={openReorder}><ArrowUpDown className="size-4" /></Button></TooltipTrigger><TooltipContent>Reorder itineraries</TooltipContent></Tooltip>
          <Tooltip><TooltipTrigger asChild><Button type="button" variant="outline" size="icon" className="size-10 shrink-0" aria-label="Add new itinerary" onClick={handleAddItinerary}><Plus className="size-4" /></Button></TooltipTrigger><TooltipContent>Add new itinerary</TooltipContent></Tooltip>
        </TooltipProvider>
      </div>

      {errors.itineraries?.root && (
        <p className="text-sm text-red-500 mb-2">
          {errors.itineraries.root.message}
        </p>
      )}

      {fields.map((field, index) => {
        const itineraryData = itinerariesValues?.[index];

        return (
          <div
            key={field.id}
            className="relative grid grid-cols-1 gap-4 border rounded-md p-4 mb-4"
          >
            {index !== 0 && (
              <button
                type="button"
                onClick={() => remove(index)}
                className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <div className="grid grid-cols-3">
              <div className="grid gap-1.5">
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`h-12 w-full justify-start rounded-xl border bg-gray-50 px-4 text-left text-[15px] font-normal focus-visible:border-emerald-400 focus-visible:ring-emerald-100 ${
                        errors.itineraries?.[index]?.date ? "border-red-500" : "border-gray-200"
                      }`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {itineraryData?.date ? (
                        format(new Date(itineraryData.date), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={
                        itineraryData?.date
                          ? new Date(itineraryData.date)
                          : undefined
                      }
                      onSelect={(day) =>
                        setValue(`itineraries.${index}.date`, day as Date, {
                          shouldValidate: true,
                        })
                      }
                      autoFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.itineraries?.[index]?.date && (
                  <p className="text-sm text-red-500">
                    {errors.itineraries[index]?.date?.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label>Subject</Label>
              <Input
                type="text"
                placeholder="Local Sightseeing Tour"
                className="bg-gray-50"
                aria-invalid={!!errors.itineraries?.[index]?.subject}
                {...control.register(`itineraries.${index}.subject`)}
              />
              {errors.itineraries?.[index]?.subject && (
                <p className="text-sm text-red-500">
                  {errors.itineraries[index]?.subject?.message}
                </p>
              )}
            </div>
            <div className="grid gap-1.5">
              <Label>Itinerary</Label>
              <Textarea
                placeholder="Type here..."
                className={`min-h-[140px] bg-white ${
                  errors.itineraries?.[index]?.itinerary ? "border-red-500" : ""
                }`}
                spellCheck="true"
                {...control.register(`itineraries.${index}.itinerary`)}
              />
              {errors.itineraries?.[index]?.itinerary && (
                <p className="text-sm text-red-500">
                  {errors.itineraries[index]?.itinerary?.message}
                </p>
              )}
            </div>
          </div>
        );
      })}
      <Sheet open={reorderOpen} onOpenChange={setReorderOpen}><SheetContent className="w-full sm:max-w-md"><SheetHeader><SheetTitle>Reorder Itineraries</SheetTitle><SheetDescription>Drag the items to change the itinerary order.</SheetDescription></SheetHeader><div className="px-4"><DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={({ active, over }) => { if (!over || active.id === over.id) return; const oldIndex = Number(active.id); const newIndex = Number(over.id); const next = [...(reorderItems ?? [])]; const [moved] = next.splice(oldIndex, 1); next.splice(newIndex, 0, moved); setReorderItems(next); }}><SortableContext items={(reorderItems ?? []).map((_, index) => String(index))} strategy={verticalListSortingStrategy}><div className="grid gap-2">{(reorderItems ?? []).map((item, index) => <ReorderRow key={index} id={String(index)} index={index} item={item} startDate={journeyDate} />)}</div></SortableContext></DndContext></div><SheetFooter><Button variant="outline" onClick={() => setReorderOpen(false)}>Cancel</Button><Button onClick={saveReorder}>Save Order</Button></SheetFooter></SheetContent></Sheet>
      <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}><DialogContent><DialogHeader><DialogTitle>Select Package</DialogTitle></DialogHeader><div className="grid gap-3">{templates.map((template) => <button key={template.id} type="button" className="rounded-lg border p-3 text-left hover:bg-gray-50" onClick={() => applyTemplate(template)}><p className="font-medium">{template.name}</p><p className="text-xs text-gray-500">{template.days.length} Days · Updated {new Date(template.updatedAt).toLocaleDateString()}</p>{template.days.map((day) => <p key={day.dayOrder} className="text-sm">Day {day.dayOrder} — {day.subject}</p>)}</button>)}</div></DialogContent></Dialog>
       <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}><DialogContent><DialogHeader><DialogTitle>Save as Package</DialogTitle></DialogHeader><div className="grid gap-4"><div className="grid gap-1.5"><Label htmlFor="package-name">Package Name</Label><Input id="package-name" value={templateName} onChange={(event) => setTemplateName(event.target.value)} placeholder="e.g. Kashmir 5 Days" autoFocus /></div><div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setSaveDialogOpen(false)}>Cancel</Button><Button disabled={!templateName.trim()} onClick={() => void apiCreatePackage({ name: templateName.trim(), days: (itinerariesValues ?? []).map((day, index) => ({ dayOrder: index + 1, subject: day.subject, description: day.itinerary })) }).then(() => { toast.success("Package saved."); setTemplateName(""); setSaveDialogOpen(false); }).catch(() => toast.error("Unable to save Package."))}>Save Package</Button></div></div></DialogContent></Dialog>
    </>
  );
};

function ReorderRow({ id, index, item, startDate }: { id: string; index: number; item: { date: Date; subject: string; itinerary: string }; startDate?: Date }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  return <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }} {...attributes} className="flex min-h-12 items-center gap-3 rounded-lg border bg-white px-3 py-2"><button type="button" {...listeners} className="cursor-grab touch-none text-gray-400" aria-label={`Drag Day ${index + 1}`}><ArrowUpDown className="size-4" /></button><span className="w-14 text-sm font-medium">Day {index + 1}</span><span className="w-20 text-xs text-gray-500">{format(addDays(startDate ? new Date(startDate) : new Date(), index), "dd MMM")}</span><span className="truncate text-sm">{item.subject || "Untitled itinerary"}</span></div>;
}

export default ItineraryDetails;
