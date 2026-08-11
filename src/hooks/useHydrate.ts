"use client";

import { useEffect } from "react";

export function useHydrate(hydrate: () => void): void {
  useEffect(() => {
    hydrate();
  }, [hydrate]);
}
