"use client";

import { useMemo, useState } from "react";
import {
  BookOpen,
  CirclePlusIcon,
  EllipsisVertical,
  Pencil,
  Plus,
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
import {
  JOURNAL_STATUSES,
  JournalEntry,
  JournalLine,
  JournalStatus,
  useJournalStore,
} from "@/stores/journalStore";
import { useChartOfAccountsStore } from "@/stores/chartOfAccountsStore";
import { toNumber } from "@/modules/accounting/reporting";
import { statusBadge } from "../accounting-config";
import { useClientReady } from "@/hooks/useClientReady";

const newLine = (): JournalLine => ({
  id: `line_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
  accountName: "",
  debit: "",
  credit: "",
});

type JournalForm = {
  journalNo: string;
  date: string;
  description: string;
  status: string;
  lines: JournalLine[];
};

const EMPTY_FORM: JournalForm = {
  journalNo: "",
  date: "",
  description: "",
  status: "Draft",
  lines: [newLine()],
};

export default function JournalEntriesPage() {
  const entries = useJournalStore((s) => s.entries);
  const addEntry = useJournalStore((s) => s.addEntry);
  const updateEntry = useJournalStore((s) => s.updateEntry);
  const deleteEntry = useJournalStore((s) => s.deleteEntry);
  const accounts = useChartOfAccountsStore((s) => s.accounts);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<JournalEntry | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);

  const filtered = useMemo(() => {
    const query = searchTerm.toLowerCase();
    if (!query) return entries;
    return entries.filter((e) =>
      `${e.journalNo} ${e.description} ${e.status}`
        .toLowerCase()
        .includes(query)
    );
  }, [entries, searchTerm]);

  const totalDebits = form.lines.reduce(
    (sum, line) => sum + toNumber(line.debit),
    0
  );
  const totalCredits = form.lines.reduce(
    (sum, line) => sum + toNumber(line.credit),
    0
  );
  const balanced = Math.abs(totalDebits - totalCredits) < 0.001;

  const ready = useClientReady();
  if (!ready) return null;

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setOpen(true);
  };

  const openEdit = (entry: JournalEntry) => {
    setEditing(entry);
    setForm({
      journalNo: entry.journalNo,
      date: entry.date,
      description: entry.description,
      status: entry.status,
      lines: entry.lines.map((line) => ({ ...line })),
    });
    setOpen(true);
  };

  const updateLine = (id: string, patch: Partial<JournalLine>) => {
    setForm((prev) => ({
      ...prev,
      lines: prev.lines.map((line) =>
        line.id === id ? { ...line, ...patch } : line
      ),
    }));
  };

  const removeLine = (id: string) => {
    setForm((prev) => ({
      ...prev,
      lines: prev.lines.filter((line) => line.id !== id),
    }));
  };

  const handleSave = () => {
    if (!form.journalNo.trim()) {
      toast.error("Journal number is required.");
      return;
    }
    if (!form.date) {
      toast.error("Date is required.");
      return;
    }
    if (form.lines.length === 0) {
      toast.error("Add at least one journal line.");
      return;
    }
    for (const line of form.lines) {
      if (!line.accountName) {
        toast.error("Every line needs an account.");
        return;
      }
    }
    if (!balanced) {
      toast.error(
        `Debits (${totalDebits.toFixed(2)}) must equal credits (${totalCredits.toFixed(2)}).`
      );
      return;
    }

    const data = {
      ...form,
      status: form.status as JournalStatus,
      description: form.description.trim(),
      lines: form.lines
        .filter((line) => line.accountName)
        .map((line) => ({
          ...line,
          debit: line.debit.trim(),
          credit: line.credit.trim(),
        })),
    };

    if (editing) {
      updateEntry(editing.id, data);
      toast.success("Journal entry updated.");
    } else {
      addEntry(data);
      toast.success("Journal entry created.");
    }
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between p-1.5">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            Journal Entries
          </h1>
          <p className="text-sm text-gray-500">
            Record adjusting and manual entries that post to the ledger.
          </p>
        </div>
        <Button onClick={openAdd}>
          <CirclePlusIcon /> Add Entry
        </Button>
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
                    placeholder="Search journal entries..."
                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 ps-9 pe-3 block text-sm shadow-2xs outline-none transition-[color,box-shadow] focus-visible:border-emerald-400 focus-visible:ring-emerald-100 focus-visible:ring-[3px]"
                  />
                  <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-3">
                    <BookOpen className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
              <div className="overflow-hidden min-h-[300px]">
                {entries.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-4 h-[300px] text-center">
                    <BookOpen className="size-10 text-gray-300" />
                    <p className="text-lg font-medium text-gray-800">
                      No journal entries yet
                    </p>
                    <p className="text-sm text-gray-500">
                      Create the first adjusting or manual entry.
                    </p>
                    <Button onClick={openAdd}>
                      <CirclePlusIcon /> Add Entry
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
                        {[
                          "no",
                          "date",
                          "description",
                          "lines",
                          "debits",
                          "credits",
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
                      {filtered.map((entry) => {
                        const debits = entry.lines.reduce(
                          (sum, line) => sum + toNumber(line.debit),
                          0
                        );
                        const credits = entry.lines.reduce(
                          (sum, line) => sum + toNumber(line.credit),
                          0
                        );
                        return (
                          <tr key={entry.id}>
                            <td className="px-6 py-2.5 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                              {entry.journalNo}
                            </td>
                            <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-600 dark:text-neutral-300">
                              {entry.date}
                            </td>
                            <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-600 dark:text-neutral-300">
                              {entry.description || "—"}
                            </td>
                            <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-600 dark:text-neutral-300">
                              {entry.lines.length}
                            </td>
                            <td className="px-6 py-2.5 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                              {debits.toFixed(2)}
                            </td>
                            <td className="px-6 py-2.5 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                              {credits.toFixed(2)}
                            </td>
                            <td className="px-6 py-2.5 whitespace-nowrap text-sm">
                              {statusBadge(entry.status)}
                            </td>
                            <td className="px-6 py-2.5 whitespace-nowrap text-end text-sm font-medium">
                              <DropdownMenu>
                                <DropdownMenuTrigger>
                                  <EllipsisVertical />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  side="left"
                                  align="start"
                                >
                                  <DropdownMenuItem
                                    onClick={() => openEdit(entry)}
                                  >
                                    <Pencil /> Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      if (
                                        window.confirm(
                                          `Delete journal entry "${entry.journalNo}"?`
                                        )
                                      ) {
                                        deleteEntry(entry.id);
                                        toast.success("Journal entry deleted.");
                                      }
                                    }}
                                  >
                                    <Trash2 /> Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        );
                      })}
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
              {editing ? "Edit Journal Entry" : "Add Journal Entry"}
            </SheetTitle>
            <SheetDescription>
              Debit and credit totals must be equal.
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 overflow-y-auto px-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label>
                  Journal No. <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={form.journalNo}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      journalNo: e.target.value,
                    }))
                  }
                  placeholder="e.g. JE-1001"
                />
              </div>
              <div className="grid gap-1.5">
                <Label>
                  Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="date"
                  value={form.date}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, date: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={2}
                placeholder="What is this entry for?"
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
                  {JOURNAL_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label>Lines</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    lines: [...prev.lines, newLine()],
                  }))
                }
              >
                <Plus /> Add Line
              </Button>
            </div>

            {form.lines.map((line, index) => (
              <div
                key={line.id}
                className="rounded-xl border border-gray-100 bg-gray-50/60 p-3"
              >
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-semibold text-gray-600">
                    Line {index + 1}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeLine(line.id)}
                    className="text-gray-400 hover:text-red-500"
                    aria-label="Remove line"
                  >
                    <X className="size-4" />
                  </button>
                </div>
                <div className="grid gap-2">
                  <div className="grid gap-1">
                    <Label>
                      Account <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={line.accountName}
                      onValueChange={(v) =>
                        updateLine(line.id, { accountName: v })
                      }
                    >
                      <SelectTrigger className="w-full bg-white">
                        <SelectValue placeholder="Select account" />
                      </SelectTrigger>
                      <SelectContent>
                        {accounts.map((account) => (
                          <SelectItem key={account.id} value={account.name}>
                            {account.code} · {account.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="grid gap-1">
                      <Label>Debit</Label>
                      <Input
                        type="number"
                        min={0}
                        value={line.debit}
                        onChange={(e) =>
                          updateLine(line.id, { debit: e.target.value })
                        }
                        placeholder="0.00"
                      />
                    </div>
                    <div className="grid gap-1">
                      <Label>Credit</Label>
                      <Input
                        type="number"
                        min={0}
                        value={line.credit}
                        onChange={(e) =>
                          updateLine(line.id, { credit: e.target.value })
                        }
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm">
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Total debits</span>
                <span className="font-semibold text-gray-900">
                  {totalDebits.toFixed(2)}
                </span>
              </div>
              <div className="mt-1 flex justify-between">
                <span className="font-medium text-gray-600">
                  Total credits
                </span>
                <span className="font-semibold text-gray-900">
                  {totalCredits.toFixed(2)}
                </span>
              </div>
              <p
                className={
                  balanced
                    ? "mt-2 text-xs font-medium text-emerald-600"
                    : "mt-2 text-xs font-medium text-red-600"
                }
              >
                {balanced ? "Balanced entry" : "Entry is out of balance"}
              </p>
            </div>
          </div>
          <SheetFooter>
            <Button onClick={handleSave}>
              {editing ? "Save Changes" : "Create Entry"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
