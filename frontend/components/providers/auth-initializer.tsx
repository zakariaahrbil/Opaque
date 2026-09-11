"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/store/useAuthStore";

export function AuthInitializer() {
  useEffect(() => {
    useAuthStore.getState().initialize();
  }, []);

  return null;
}
