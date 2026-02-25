"use client";

import { useState, use } from "react";
import { ChatPanel } from "@omnicare/care-ui";
import type { Tenant } from "@omnicare/shared";

const DEMO_TENANT: Tenant = {
  id: "demo",
  slug: "demo",
  name: "TechHaven",
  industry: "E-commerce & Technology",
  primaryColor: "#6366f1",
  secondaryColor: "#0a0a0f",
  contactEmail: "support@techhaven.com",
  contactPhone: "1-800-555-TECH",
  website: "https://techhaven.com",
  timezone: "America/New_York",
  isActive: true,
};

export default function ChatPage({
  params,
}: {
  params: Promise<{ tenantSlug: string }>;
}) {
  const { tenantSlug } = use(params);
  const [tenant] = useState<Tenant>({ ...DEMO_TENANT, slug: tenantSlug });

  return (
    <div className="h-screen w-screen flex items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: "var(--widget-bg)" }}
    >
      {/* Ambient glow orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-[0.07]"
        style={{ background: "radial-gradient(circle, #6366f1 0%, transparent 70%)" }}
      />
      <div className="absolute bottom-[-30%] right-[-15%] w-[600px] h-[600px] rounded-full opacity-[0.05]"
        style={{ background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)" }}
      />
      <div className="absolute top-[40%] right-[10%] w-[300px] h-[300px] rounded-full opacity-[0.04]"
        style={{ background: "radial-gradient(circle, #6366f1 0%, transparent 70%)" }}
      />

      {/* Noise texture overlay */}
      <div className="absolute inset-0 noise pointer-events-none" />

      {/* Widget container */}
      <div className="relative w-full max-w-[420px] h-[calc(100vh-48px)] max-h-[780px] mx-4">
        <ChatPanel
          tenant={tenant}
          apiEndpoint={`/api/chat/${tenantSlug}`}
          firstMessage="Hey there — I'm your AI assistant. I can track orders, answer questions, compare plans, and more. What can I help with?"
          quickQuestions={[
            "Where's my order?",
            "I need to return something",
            "Show me your pricing plans",
            "What headphones do you have?",
          ]}
        />
      </div>
    </div>
  );
}
