"use client";

import { useMemo, useState } from "react";
import { FileText, Search } from "lucide-react";
import { useClientReady } from "@/hooks/useClientReady";
import { Avatar, formatDate, memberName, pageShell, PageHeader } from "@/helpers/teams-meet/team-ui";
import { useTeamMeetStore } from "@/stores/teamMeetStore";

const TYPE_TONES: Record<string, string> = {
  PDF: "bg-rose-50 text-rose-600",
  PPTX: "bg-amber-50 text-amber-600",
  DOCX: "bg-sky-50 text-sky-600",
  XLSX: "bg-emerald-50 text-emerald-600",
};

export function DocumentTable({
  title,
  description,
  category,
}: {
  title: string;
  description: string;
  category: "Team" | "Policy" | "Employee";
}) {
  const [query, setQuery] = useState("");
  const documents = useTeamMeetStore((s) => s.documents);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    const typed = documents.filter((d) => d.category === category);
    if (!q) return typed;
    return typed.filter((d) => `${d.name} ${d.type}`.toLowerCase().includes(q));
  }, [documents, query, category]);

  const ready = useClientReady();
  if (!ready) return null;

  return (
    <div className={pageShell}>
      <PageHeader title={title} description={description} />
      <div className="p-1.5">
        <div className="overflow-hidden rounded-[20px] border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-4 py-3">
            <div className="relative w-full max-w-sm">
              <Search className="pointer-events-none absolute inset-y-0 start-3 size-4 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search documents…"
                className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 ps-9 pe-3 text-sm outline-none transition-[color,box-shadow] focus-visible:border-emerald-400 focus-visible:ring-emerald-100 focus-visible:ring-[3px]"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left">
                  {["Document", "Type", "Size", "Owner", "Uploaded", "Version"].map((h) => (
                    <th key={h} className="px-6 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50/60">
                    <td className="px-6 py-3">
                      <span className="inline-flex items-center gap-3">
                        <span
                          className={`grid size-9 place-items-center rounded-lg ${
                            TYPE_TONES[d.type] ?? "bg-gray-50 text-gray-500"
                          }`}
                        >
                          <FileText className="size-4" />
                        </span>
                        <span className="font-medium text-gray-800">{d.name}</span>
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <span className="rounded-md bg-gray-100 px-2 py-0.5 font-mono text-xs text-gray-600">
                        {d.type}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-600">{d.size}</td>
                    <td className="px-6 py-3">
                      <span className="inline-flex items-center gap-2">
                        <Avatar id={d.ownerId} size="size-6" />
                        {memberName(d.ownerId)}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-600">{formatDate(d.uploadedAt)}</td>
                    <td className="px-6 py-3">
                      <span className="rounded-md bg-violet-50 px-2 py-0.5 font-mono text-xs text-violet-700">
                        {d.version}
                      </span>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-sm text-gray-400">
                      No {category.toLowerCase()} documents.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
