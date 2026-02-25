import {
  streamText,
  UIMessage,
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  stepCountIs,
} from "ai";
import { google } from "@ai-sdk/google";
import { pipeJsonRender } from "@json-render/core";
import { careCatalog } from "@omnicare/care-ui";
import { buildCarePrompt, buildCareTools } from "@omnicare/care-engine";
import type { Tenant, BotConfig } from "@omnicare/shared";

export const maxDuration = 30;

// ---------------------------------------------------------------------------
// Demo tenant context — in production, load from database by slug
// ---------------------------------------------------------------------------

const DEMO_TENANT: Tenant = {
  id: "demo",
  slug: "demo",
  name: "TechHaven",
  industry: "E-commerce & Technology",
  primaryColor: "#2563eb",
  secondaryColor: "#f8fafc",
  contactEmail: "support@techhaven.com",
  contactPhone: "1-800-555-TECH",
  website: "https://techhaven.com",
  timezone: "America/New_York",
  businessHours: {
    monday: { open: "9:00 AM", close: "6:00 PM" },
    tuesday: { open: "9:00 AM", close: "6:00 PM" },
    wednesday: { open: "9:00 AM", close: "6:00 PM" },
    thursday: { open: "9:00 AM", close: "6:00 PM" },
    friday: { open: "9:00 AM", close: "6:00 PM" },
    saturday: { open: "10:00 AM", close: "4:00 PM" },
    sunday: null,
  },
  isActive: true,
};

const DEMO_CONFIG: BotConfig = {
  id: "demo-config",
  tenantId: "demo",
  personalityTemplate: "friendly",
  firstMessage: "Hey there! I'm TechHaven's AI assistant. I can help with orders, products, returns, and more. What can I do for you?",
  quickQuestions: [
    "Where's my order?",
    "I need to return something",
    "Show me your pricing plans",
    "What headphones do you have?",
  ],
  llmModel: "gemini-2.5-flash",
  temperature: 0.3,
  maxSteps: 5,
  enabledTools: {
    lookupOrder: true,
    searchKnowledgeBase: true,
    getProductInfo: true,
    createTicket: true,
    checkAvailability: true,
    getAccountInfo: true,
    getPricingPlans: true,
    requestHumanHandoff: true,
  },
};

// Cache for tenant contexts
const tenantCache = new Map<string, { data: { tenant: Tenant; config: BotConfig }; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000;

function loadTenantContext(slug: string) {
  const cached = tenantCache.get(slug);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) return cached.data;

  // For now, all slugs return demo context
  const data = { tenant: { ...DEMO_TENANT, slug }, config: DEMO_CONFIG };
  tenantCache.set(slug, { data, timestamp: Date.now() });
  return data;
}

// ---------------------------------------------------------------------------
// POST handler
// ---------------------------------------------------------------------------

export async function POST(
  req: Request,
  { params }: { params: Promise<{ tenantSlug: string }> }
) {
  const { tenantSlug } = await params;
  const { messages }: { messages: UIMessage[] } = await req.json();

  const ctx = loadTenantContext(tenantSlug);
  if (!ctx) return new Response("Tenant not found", { status: 404 });

  const systemPrompt = buildCarePrompt({
    tenant: ctx.tenant,
    config: ctx.config,
    catalogPrompt: careCatalog.prompt({
      mode: "chat",
      customRules: [
        "Keep layouts SMALL — max 3-4 components per spec.",
        "VARY component choices based on data type:",
        "  - Order status → OrderTracker",
        "  - Product info → ProductCard",
        "  - Pricing → PricingTable",
        "  - FAQs → Accordion",
        "  - Booking → AppointmentPicker",
        "  - Ticket created → TicketCard",
        "  - Account info → Card with Metrics",
        "  - Invoice → InvoiceSummary",
        "  - System status → StatusBanner",
        "  - Feedback request → FeedbackForm",
        "CRITICAL: Max 1 spec per response. Never repeat for same data.",
        "NEVER use viewport height classes.",
        "All monetary values should include $ sign.",
      ],
    }),
  });

  const tools = buildCareTools();
  const model = google(ctx.config.llmModel || "gemini-2.5-flash");

  const result = streamText({
    model,
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
    stopWhen: stepCountIs(ctx.config.maxSteps),
    tools,
    temperature: ctx.config.temperature ?? 0.3,
  });

  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      writer.merge(pipeJsonRender(result.toUIMessageStream()));
    },
  });

  return createUIMessageStreamResponse({ stream });
}
