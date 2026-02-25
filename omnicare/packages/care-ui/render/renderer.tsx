"use client";

import { type ReactNode } from "react";
import {
  Renderer,
  type ComponentRenderer,
  type Spec,
  StateProvider,
  VisibilityProvider,
  ActionProvider,
} from "@json-render/react";
import { registry, Fallback } from "./registry";
import { OmniCareProvider } from "./context";
import type { Tenant, LeadCaptureData } from "@omnicare/shared";

interface ChatRendererProps {
  spec: Spec | null;
  loading?: boolean;
  tenant?: Tenant;
  onAction?: (action: string, data?: Record<string, unknown>) => void;
  onLeadCapture?: (data: LeadCaptureData) => void;
  sendMessage?: (text: string) => void;
}

const fallback: ComponentRenderer = ({ element }) => (
  <Fallback type={element.type} />
);

export function ChatRenderer({
  spec,
  loading,
  tenant,
  onAction,
  onLeadCapture,
  sendMessage,
}: ChatRendererProps): ReactNode {
  if (!spec) return null;

  const tree = (
    <StateProvider initialState={spec.state ?? {}}>
      <VisibilityProvider>
        <ActionProvider>
          <Renderer
            spec={spec}
            registry={registry}
            fallback={fallback}
            loading={loading}
          />
        </ActionProvider>
      </VisibilityProvider>
    </StateProvider>
  );

  if (tenant) {
    return (
      <OmniCareProvider
        tenant={tenant}
        onAction={onAction}
        onLeadCapture={onLeadCapture}
        sendMessage={sendMessage}
      >
        {tree}
      </OmniCareProvider>
    );
  }

  return tree;
}
