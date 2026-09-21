"use client";

import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, LoaderCircle, Plus } from "lucide-react";

export interface ComboboxOption {
  value: string;
  label: string;
}

interface ComboboxProps {
  id?: string;
  options: ComboboxOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  className?: string;
  invalid?: boolean;
  onAddNew?: (value: string) => void;
  addNewLabel?: string;
  onSearchChange?: (value: string) => void;
  loading?: boolean;
  emptyLabel?: string;
}

export function Combobox({
  id,
  options,
  value,
  onChange,
  placeholder = "Select option",
  searchPlaceholder = "Search...",
  className,
  invalid,
  onAddNew,
  addNewLabel = "Add",
  onSearchChange,
  loading = false,
  emptyLabel = "No results found.",
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const safeOptions = Array.isArray(options) ? options : [];

  const normalizedSearch = search.trim();

  const filtered = safeOptions.filter((opt) =>
    String(opt.label ?? "").toLowerCase().includes(search.toLowerCase())
  );
  const hasExactMatch = safeOptions.some(
    (opt) => String(opt.value ?? "").toLowerCase() === normalizedSearch.toLowerCase()
  );

  const selectedLabel = safeOptions.find((opt) => opt.value === value)?.label;

  const handleAddNew = () => {
    onAddNew?.(normalizedSearch);
    setOpen(false);
    setSearch("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "h-12 w-full min-w-0 justify-between rounded-xl border-gray-200 bg-gray-50 px-4 text-[15px] font-normal hover:bg-gray-50 hover:text-foreground focus-visible:border-emerald-400 focus-visible:ring-emerald-100",
            invalid && "border-red-500",
            !value && "text-muted-foreground",
            className
          )}
        >
          <span className="min-w-0 flex-1 truncate text-left" title={selectedLabel || placeholder}>
            {selectedLabel || placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <div className="p-2">
          <Input
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              onSearchChange?.(e.target.value);
            }}
            className="h-8"
            autoFocus
          />
        </div>
        {onAddNew && normalizedSearch && !hasExactMatch && (
          <div className="border-b p-1">
            <button
              type="button"
              className="flex w-full items-center rounded-sm px-2 py-1.5 text-sm font-medium cursor-pointer hover:bg-accent hover:text-accent-foreground outline-none"
              onClick={handleAddNew}
            >
              <Plus className="mr-2 h-4 w-4" />
              {addNewLabel}
              {normalizedSearch ? ` "${normalizedSearch}"` : ""}
            </button>
          </div>
        )}
        <div className="max-h-[200px] overflow-auto p-1">
          {loading ? (
            <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
              <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
              <span>Searching...</span>
            </div>
          ) : filtered.length === 0 ? (
            <p className="py-2 px-3 text-sm text-muted-foreground">{emptyLabel}</p>
          ) : (
            filtered.map((opt, index) => (
              <button
                key={index}
                type="button"
                className={cn(
                  "flex w-full items-center rounded-sm px-2 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground outline-none",
                  value === opt.value && "bg-accent text-accent-foreground"
                )}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                  setSearch("");
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === opt.value ? "opacity-100" : "opacity-0"
                  )}
                />
                <span className="min-w-0 truncate text-left" title={opt.label}>
                  {opt.label}
                </span>
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
