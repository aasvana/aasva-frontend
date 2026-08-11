"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  NUMBERING_DOCS,
  NUMBERING_LABELS,
  useAccountSettingsStore,
} from "@/stores/accountSettingsStore";
import { useClientReady } from "@/hooks/useClientReady";

export default function NumberingPage() {
  const numbering = useAccountSettingsStore((s) => s.numbering);
  const updateNumbering = useAccountSettingsStore((s) => s.updateNumbering);

  const ready = useClientReady();
  if (!ready) return null;

  const save = () => {
    toast.success("Numbering preferences saved.");
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between p-1.5">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Numbering</h1>
          <p className="text-sm text-gray-500">
            Prefixes and starting numbers for each document type.
          </p>
        </div>
        <Button onClick={save}>Save Changes</Button>
      </div>

      <div className="grid grid-cols-1 gap-3 p-1.5 md:grid-cols-2 lg:grid-cols-3">
        {NUMBERING_DOCS.map((doc) => (
          <div
            key={doc}
            className="rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm"
          >
            <p className="mb-3 text-sm font-semibold text-gray-800">
              {NUMBERING_LABELS[doc]}
            </p>
            <div className="grid grid-cols-2 gap-2">
              <div className="grid gap-1">
                <Label>Prefix</Label>
                <Input
                  value={numbering[doc].prefix}
                  onChange={(e) =>
                    updateNumbering(doc, { prefix: e.target.value })
                  }
                  placeholder="e.g. INV-"
                />
              </div>
              <div className="grid gap-1">
                <Label>Next number</Label>
                <Input
                  value={numbering[doc].next}
                  onChange={(e) =>
                    updateNumbering(doc, { next: e.target.value })
                  }
                  placeholder="e.g. 1001"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
