"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  apiCreateTerm,
  apiDeleteTerm,
  apiGetTerms,
  apiReorderTerms,
  apiUpdateTerm,
  Term,
} from "@/lib/terms-api";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowDown,
  ArrowUp,
  CirclePlusIcon,
  Pencil,
  Search,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

export default function TermsPage() {
  const [terms, setTerms] = useState<Term[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<Term | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [orderIds, setOrderIds] = useState<string[]>([]);
  const [savingOrder, setSavingOrder] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setTerms(await apiGetTerms());
    } catch {
      toast.error("Unable to load Terms & Conditions.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filteredTerms = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return terms.filter((term) => {
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" ? term.isActive : !term.isActive);
      const matchesQuery =
        !query ||
        `${term.title ?? ""} ${term.content}`.toLowerCase().includes(query);
      return matchesStatus && matchesQuery;
    });
  }, [terms, searchTerm, statusFilter]);

  const orderedTerms = useMemo(() => {
    const termsById = new Map(terms.map((term) => [term.id, term]));
    return orderIds
      .map((id) => termsById.get(id))
      .filter((term): term is Term => Boolean(term));
  }, [terms, orderIds]);

  const visibleTerms = reordering ? orderedTerms : filteredTerms;

  const openEditor = (term?: Term) => {
    setEditing(term ?? null);
    setTitle(term?.title ?? "");
    setContent(term?.content ?? "");
    setIsActive(term?.isActive ?? true);
    setEditorOpen(true);
  };

  const save = async () => {
    const nextContent = content.trim();
    if (!nextContent) {
      toast.error("Term content is required.");
      return;
    }
    const payload = {
      title: title.trim() || undefined,
      content: nextContent,
      isActive,
    };
    setSaving(true);
    try {
      if (editing) {
        await apiUpdateTerm(editing.id, payload);
        toast.success("Term updated.");
      } else {
        await apiCreateTerm(payload);
        toast.success("Term added.");
      }
      setEditorOpen(false);
      await load();
    } catch {
      toast.error("Unable to save the term.");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (term: Term) => {
    try {
      await apiUpdateTerm(term.id, { isActive: !term.isActive });
      toast.success(term.isActive ? "Term deactivated." : "Term activated.");
      await load();
    } catch {
      toast.error("Unable to update the term.");
    }
  };

  const remove = async (term: Term) => {
    if (!window.confirm(`Delete “${term.title || "this term"}”?`)) return;
    try {
      await apiDeleteTerm(term.id);
      toast.success("Term deleted.");
      await load();
    } catch {
      toast.error("Unable to delete the term.");
    }
  };

  const startReordering = () => {
    setOrderIds(terms.map((term) => term.id));
    setReordering(true);
  };

  const move = (id: string, delta: -1 | 1) => {
    setOrderIds((current) => {
      const index = current.indexOf(id);
      const nextIndex = index + delta;
      if (index < 0 || nextIndex < 0 || nextIndex >= current.length) return current;
      const next = [...current];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });
  };

  const saveOrder = async () => {
    setSavingOrder(true);
    try {
      setTerms(await apiReorderTerms(orderIds));
      setReordering(false);
      toast.success("Term order updated.");
    } catch {
      toast.error("Unable to update the term order.");
    } finally {
      setSavingOrder(false);
    }
  };

  return (
    <main className="space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Terms & Conditions</h1>
          <p className="text-sm text-gray-500">
            Manage tenant terms for new confirmation vouchers. Saved vouchers keep the terms captured when they were created.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {reordering ? (
            <>
              <Button variant="outline" disabled={savingOrder} onClick={() => setReordering(false)}>
                Cancel
              </Button>
              <Button disabled={savingOrder} onClick={() => void saveOrder()}>
                {savingOrder ? "Saving..." : "Save order"}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" disabled={terms.length < 2} onClick={startReordering}>
                <ArrowUpDownIcon />
                Reorder
              </Button>
              <Button onClick={() => openEditor()}>
                <CirclePlusIcon /> Add Term
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="divide-y divide-gray-100 rounded-[20px] border border-gray-100 bg-white">
        <div className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center">
          <div className="relative w-full max-w-sm">
            <label className="sr-only" htmlFor="terms-search">Search terms</label>
            <Input
              id="terms-search"
              value={searchTerm}
              disabled={reordering}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search terms..."
              className="h-11 rounded-xl border-gray-200 bg-gray-50 pl-9"
            />
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
          </div>
          <div className="flex items-center gap-2">
            {(["all", "active", "inactive"] as const).map((status) => (
              <Button
                key={status}
                type="button"
                size="sm"
                variant={statusFilter === status ? "default" : "outline"}
                disabled={reordering}
                onClick={() => setStatusFilter(status)}
                className="capitalize"
              >
                {status}
              </Button>
            ))}
          </div>
        </div>

        <div className="min-h-[350px] overflow-hidden">
          {loading ? (
            <p className="flex h-[350px] items-center justify-center text-sm text-gray-500">Loading terms...</p>
          ) : visibleTerms.length === 0 ? (
            <div className="flex h-[350px] flex-col items-center justify-center gap-2 text-center">
              <p className="text-lg font-medium text-gray-800">No terms found</p>
              <p className="text-sm text-gray-500">Add the first tenant term or adjust the filters.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 text-left">
                <tr>
                  {["Order", "Term", "Status", "Action"].map((header) => (
                    <th key={header} className="px-6 py-3 text-xs font-medium uppercase text-gray-500">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {visibleTerms.map((term, index) => (
                  <tr key={term.id}>
                    <td className="whitespace-nowrap px-6 py-3 text-sm text-gray-700">{index + 1}</td>
                    <td className="max-w-xl px-6 py-3">
                      {term.title && <p className="text-sm font-medium text-gray-800">{term.title}</p>}
                      <p className="line-clamp-2 text-sm text-gray-600">{term.content}</p>
                    </td>
                    <td className="whitespace-nowrap px-6 py-3 text-sm">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${term.isActive ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>
                        {term.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-3 text-sm">
                      <div className="flex items-center gap-1">
                        {reordering ? (
                          <>
                            <Button size="icon" variant="ghost" aria-label="Move term up" disabled={index === 0} onClick={() => move(term.id, -1)}>
                              <ArrowUp className="size-4" />
                            </Button>
                            <Button size="icon" variant="ghost" aria-label="Move term down" disabled={index === orderedTerms.length - 1} onClick={() => move(term.id, 1)}>
                              <ArrowDown className="size-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button size="sm" variant="outline" onClick={() => void toggleActive(term)}>
                              {term.isActive ? "Deactivate" : "Activate"}
                            </Button>
                            <Button size="icon" variant="ghost" aria-label="Edit term" onClick={() => openEditor(term)}>
                              <Pencil className="size-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="text-red-600" aria-label="Delete term" onClick={() => void remove(term)}>
                              <Trash2 className="size-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Drawer open={editorOpen} onOpenChange={setEditorOpen} direction="right">
        <DrawerContent className="top-0 right-0 h-full w-full overflow-y-auto sm:max-w-xl">
          <DrawerHeader>
            <DrawerTitle>{editing ? "Edit Term" : "Add Term"}</DrawerTitle>
            <DrawerDescription>
              Active terms are copied into each newly created voucher. Existing vouchers retain their saved copy.
            </DrawerDescription>
          </DrawerHeader>
          <div className="grid gap-4 px-4">
            <div className="grid gap-1.5">
              <Label htmlFor="term-title">Title</Label>
              <Input
                id="term-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Cancellation policy"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="term-content">Content</Label>
              <Textarea
                id="term-content"
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="Enter the term exactly as it should appear on the voucher."
                className="min-h-[160px]"
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="term-active" checked={isActive} onCheckedChange={(checked) => setIsActive(checked === true)} />
              <Label htmlFor="term-active" className="cursor-pointer">Active for new vouchers</Label>
            </div>
          </div>
          <DrawerFooter className="flex-row justify-end">
            <Button variant="outline" disabled={saving} onClick={() => setEditorOpen(false)}>
              Cancel
            </Button>
            <Button disabled={saving || !content.trim()} onClick={() => void save()}>
              {saving ? "Saving..." : editing ? "Update term" : "Add term"}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </main>
  );
}

function ArrowUpDownIcon() {
  return (
    <span className="flex items-center">
      <ArrowUp className="size-4" />
      <ArrowDown className="size-4" />
    </span>
  );
}
