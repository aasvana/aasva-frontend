"use client";

import { useMemo, useState } from "react";
import {
  CirclePlusIcon,
  EllipsisVertical,
  PackageOpen,
  Pencil,
  Search,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
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

export type MasterField = {
  name: string;
  label: string;
  placeholder?: string;
  type?: "text" | "number" | "date" | "time" | "select";
  options?: { value: string; label: string }[];
  required?: boolean;
};

type MasterDataManagerProps<T extends { id: string }> = {
  title: string;
  description: string;
  addLabel: string;
  emptyTitle: string;
  emptyDescription: string;
  searchPlaceholder: string;
  fields: MasterField[];
  tableHeaders: string[];
  rowCells: (item: T) => React.ReactNode[];
  items: T[];
  searchText: (item: T) => string;
  add: (data: Omit<T, "id">) => void;
  update: (id: string, data: Omit<T, "id">) => void;
  remove: (id: string) => void;
  hideAddButton?: boolean;
  onAddButton?: () => void;
  onEditButton?: (item: T) => void;
  hideFormDrawer?: boolean;
  customDrawer?: (args: { open: boolean; editing: T | null; close: () => void }) => React.ReactNode;
};

export function MasterDataManager<T extends { id: string }>({
  title,
  description,
  addLabel,
  emptyTitle,
  emptyDescription,
  searchPlaceholder,
  fields,
  tableHeaders,
  rowCells,
  items,
  searchText,
  add,
  update,
  remove,
  hideAddButton = false,
  onAddButton,
  onEditButton,
  hideFormDrawer = false,
  customDrawer,
}: MasterDataManagerProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);
  const [draft, setDraft] = useState<Record<string, string>>({});

  const filtered = useMemo(() => {
    const query = searchTerm.toLowerCase();
    if (!query) return items;
    return items.filter((item) => searchText(item).toLowerCase().includes(query));
  }, [items, searchTerm, searchText]);

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
    setDraft(
      Object.fromEntries(
        fields.map((f) => [f.name, record[f.name] ?? ""])
      )
    );
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
      update(editing.id, data);
      toast.success(`${title.slice(0, -1) || "Item"} updated successfully!`);
    } else {
      add(data);
      toast.success(`${title.slice(0, -1) || "Item"} added successfully!`);
    }
    setSheetOpen(false);
  };

  const handleDelete = (item: T) => {
    const name = searchText(item);
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    remove(item.id);
    toast.success(`${title.slice(0, -1) || "Item"} deleted.`);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row items-center justify-between p-1.5">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        {!hideAddButton && (
          <Button onClick={onAddButton ?? openAdd}>
            <CirclePlusIcon /> {addLabel}
          </Button>
        )}
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
                    placeholder={searchPlaceholder}
                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 ps-9 pe-3 block text-sm shadow-2xs outline-none transition-[color,box-shadow] focus-visible:border-emerald-400 focus-visible:ring-emerald-100 focus-visible:ring-[3px]"
                  />
                  <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-3">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
              <div className="overflow-hidden min-h-[300px]">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-4 h-[300px] text-center">
                    <PackageOpen className="size-10 text-gray-300" />
                    <p className="text-lg font-medium text-gray-800">
                      {emptyTitle}
                    </p>
                    <p className="text-sm text-gray-500">{emptyDescription}</p>
                    <Button onClick={onAddButton ?? openAdd}>
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
                    <thead className="bg-gray-50 dark:bg-neutral-700">
                      <tr>
                        {[...tableHeaders, "Action"].map((header, idx) => (
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
                      {filtered.map((item) => (
                        <tr key={item.id}>
                          {rowCells(item).map((cell, idx) => (
                            <td
                              key={idx}
                              className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-700 dark:text-neutral-300"
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
                                <DropdownMenuItem
                                  onClick={() => onEditButton?.(item) ?? openEdit(item)}
                                >
                                  <Pencil /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDelete(item)}
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

      {customDrawer?.({ open: sheetOpen, editing, close: () => setSheetOpen(false) })}
      {!hideFormDrawer && <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>
              {editing ? `Edit ${addLabel}` : addLabel}
            </SheetTitle>
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
                    type={
                      field.name === "value" &&
                      (draft.key === "checkinTime" || draft.key === "checkoutTime")
                        ? "time"
                        : field.type ?? "text"
                    }
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
      </Sheet>}
    </div>
  );
}
