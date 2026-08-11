"use client";

import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Plus } from "lucide-react";

export interface ComboboxOption {
  value: string;
  label: string;
}

interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  className?: string;
  invalid?: boolean;
  onAddNew?: (value: string) => void;
  addNewLabel?: string;
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Select option",
  searchPlaceholder = "Search...",
  className,
  invalid,
  onAddNew,
  addNewLabel = "Add",
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const normalizedSearch = search.trim();

  const filtered = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const selectedLabel = options.find((opt) => opt.value === value)?.label;

  const handleAddNew = () => {
    onAddNew?.(normalizedSearch);
    setOpen(false);
    setSearch("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between font-normal",
            invalid && "border-red-500",
            !value && "text-muted-foreground",
            className
          )}
        >
          {selectedLabel || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <div className="p-2">
          <Input
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8"
            autoFocus
          />
        </div>
        {onAddNew && (
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
          {filtered.length === 0 ? (
            <p className="py-2 px-3 text-sm text-muted-foreground">No results found.</p>
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
                {opt.label}
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
