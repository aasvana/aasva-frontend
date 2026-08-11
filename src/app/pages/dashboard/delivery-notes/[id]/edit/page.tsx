"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  getDeliveryNote,
  SavedDeliveryNote,
  mergeDeliveryNoteDefaults,
} from "@/modules/delivery-note";
import { DeliveryNoteForm } from "@/modules/delivery-note";
import { usePosStore } from "@/modules/pos";
import { useHydrate } from "@/hooks/useHydrate";

export default function EditDeliveryNote() {
  useHydrate(usePosStore((s) => s.hydrate));

  const params = useParams<{ id: string }>();
  const [deliveryNote, setDeliveryNote] = useState<
    SavedDeliveryNote | undefined
  >(undefined);

  useEffect(() => {
    if (params?.id) {
      setDeliveryNote(getDeliveryNote(params.id));
    }
  }, [params?.id]);

  if (!deliveryNote) {
    return (
      <div className="flex items-center justify-center py-24 text-sm text-gray-500">
        Loading delivery note...
      </div>
    );
  }

  return (
    <DeliveryNoteForm
      mode="edit"
      existingId={deliveryNote.id}
      defaultValues={mergeDeliveryNoteDefaults(deliveryNote.data)}
    />
  );
}
