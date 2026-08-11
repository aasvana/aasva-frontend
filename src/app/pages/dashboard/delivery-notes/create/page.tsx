"use client";

import { DeliveryNoteForm } from "@/modules/delivery-note";
import { usePosStore } from "@/modules/pos";
import { useHydrate } from "@/hooks/useHydrate";

export default function CreateDeliveryNote() {
  useHydrate(usePosStore((s) => s.hydrate));

  return <DeliveryNoteForm mode="create" />;
}
