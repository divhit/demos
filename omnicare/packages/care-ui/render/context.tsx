"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Tenant, LeadCaptureData } from "@omnicare/shared";

type OmniCareContextValue = {
  tenant: Tenant;
  onAction?: (action: string, data?: Record<string, unknown>) => void;
  onLeadCapture?: (data: LeadCaptureData) => void;
  sendMessage?: (text: string) => void;
};

const OmniCareContext = createContext<OmniCareContextValue | null>(null);

export function OmniCareProvider({
  children,
  ...value
}: OmniCareContextValue & { children: ReactNode }) {
  return (
    <OmniCareContext.Provider value={value}>
      {children}
    </OmniCareContext.Provider>
  );
}

export function useOmniCare() {
  const ctx = useContext(OmniCareContext);
  if (!ctx) throw new Error("useOmniCare must be used within OmniCareProvider");
  return ctx;
}
