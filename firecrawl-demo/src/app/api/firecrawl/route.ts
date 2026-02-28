import { NextRequest, NextResponse } from "next/server";

// ── Mock data for demo mode ────────────────────────────────────
const MOCK_DATA: Record<string, unknown> = {
  invoice: {
    parser: "PDF Parser V2 (Rust)",
    mode: "auto",
    ocr_used: true,
    parse_time_ms: 340,
    extraction_source: "https://contoso.com/invoices/INV-2024-0847.pdf",
    invoice: {
      number: "INV-2024-0847",
      date_issued: "2024-12-15",
      date_due: "2025-01-14",
      status: "Pending",
      currency: "USD",
      vendor: {
        name: "Contoso Technologies Ltd.",
        address: "1200 Innovation Drive, Redmond, WA 98052",
        tax_id: "98-7654321",
        contact_email: "billing@contoso.com",
        phone: "+1 (425) 555-0192",
      },
      bill_to: {
        name: "Northwind Traders Inc.",
        address: "456 Commerce Street, Seattle, WA 98101",
        po_number: "PO-2024-3892",
        department: "IT Operations",
      },
      line_items: [
        {
          description: "Azure Cloud Services — Enterprise Plan (Monthly)",
          sku: "AZ-ENT-001",
          quantity: 1,
          unit_price: 2499.0,
          total: 2499.0,
        },
        {
          description: "Microsoft 365 E5 Licenses",
          sku: "M365-E5",
          quantity: 50,
          unit_price: 57.0,
          total: 2850.0,
        },
        {
          description: "Dynamics 365 Sales Enterprise",
          sku: "D365-SE",
          quantity: 25,
          unit_price: 95.0,
          total: 2375.0,
        },
        {
          description: "Power Platform — Per User Plan",
          sku: "PP-USR",
          quantity: 15,
          unit_price: 40.0,
          total: 600.0,
        },
        {
          description: "Premier Support — Annual",
          sku: "SUP-PREM",
          quantity: 1,
          unit_price: 1500.0,
          total: 1500.0,
        },
      ],
      subtotal: 9824.0,
      tax_rate: 10.25,
      tax_amount: 1006.96,
      total_due: 10830.96,
      payment_terms: "Net 30",
      payment_methods: ["Wire Transfer", "ACH", "Credit Card"],
      notes: "Thank you for your continued partnership. Early payment discount of 2% available within 10 days.",
    },
  },
  vendor: {
    research_query:
      "Compare enterprise CRM pricing across Salesforce, HubSpot, and Microsoft Dynamics 365",
    agent_model: "FIRE-1",
    sites_visited: [
      "salesforce.com/pricing",
      "hubspot.com/pricing/crm",
      "microsoft.com/en-us/dynamics-365/pricing",
      "g2.com/categories/crm",
      "gartner.com/reviews/market/crm",
    ],
    comparison: [
      {
        vendor: "Salesforce",
        plan: "Enterprise Edition",
        price_per_user_month: 165,
        annual_commitment: true,
        key_features: [
          "Einstein AI Analytics",
          "Advanced Pipeline Management",
          "Custom Objects & Apps",
          "Workflow Automation",
          "Territory Management",
          "API Access (100k calls/day)",
        ],
        pros: [
          "Market leader with largest ecosystem",
          "Most extensive AppExchange marketplace",
          "Advanced customization via Apex/Visualforce",
        ],
        cons: [
          "Highest total cost of ownership",
          "Complex implementation (6-12 months typical)",
          "Per-feature add-on pricing adds up",
        ],
        g2_rating: 4.3,
        best_for: "Large enterprises with complex, multi-team sales processes",
      },
      {
        vendor: "HubSpot",
        plan: "Sales Hub Enterprise",
        price_per_user_month: 150,
        annual_commitment: true,
        key_features: [
          "Predictive Lead Scoring",
          "Custom Behavioral Events",
          "Multi-Touch Revenue Attribution",
          "Sales Playbooks",
          "Conversation Intelligence",
          "Recurring Revenue Tracking",
        ],
        pros: [
          "Best-in-class user experience",
          "Unified marketing + sales + service platform",
          "Free CRM tier for evaluation",
        ],
        cons: [
          "Limited customization vs Salesforce",
          "Contact-based pricing can get expensive",
          "Fewer enterprise integrations",
        ],
        g2_rating: 4.4,
        best_for:
          "Mid-market companies wanting integrated marketing and sales",
      },
      {
        vendor: "Microsoft Dynamics 365",
        plan: "Sales Enterprise",
        price_per_user_month: 95,
        annual_commitment: true,
        key_features: [
          "Copilot AI Assistant (built-in)",
          "LinkedIn Sales Navigator Integration",
          "Power Platform (Power Automate, Power BI)",
          "Microsoft Teams Integration",
          "Azure Synapse Analytics",
          "Custom AI Models via Azure ML",
        ],
        pros: [
          "Native Microsoft 365 & Teams integration",
          "Most competitive per-seat pricing",
          "Copilot AI included at no extra cost",
          "Power Platform for citizen developers",
        ],
        cons: [
          "Steeper learning curve for non-Microsoft shops",
          "UI less modern than competitors",
          "Best value requires Microsoft ecosystem",
        ],
        g2_rating: 3.8,
        best_for: "Microsoft-centric organizations seeking deep Office integration",
      },
    ],
    recommendation:
      "For organizations already invested in the Microsoft ecosystem, Dynamics 365 offers the best value at $95/user/month with Copilot AI included — $70/user/month less than Salesforce. The native Teams, Outlook, and Power Platform integration eliminates context-switching and enables non-developers to build custom automations.",
    total_annual_savings_dynamics_vs_salesforce: {
      per_user: 840,
      for_100_users: 84000,
      currency: "USD",
    },
  },
  knowledge: {
    source_url: "https://support.microsoft.com/en-us/microsoft-365",
    pages_crawled: 47,
    extraction_time_seconds: 12.4,
    knowledge_base: {
      company: "Microsoft",
      product: "Microsoft 365",
      last_updated: "2025-02-27",
      categories: [
        {
          name: "Account & Billing",
          article_count: 8,
          articles: [
            {
              title: "How to cancel your Microsoft 365 subscription",
              summary:
                "Navigate to admin.microsoft.com → Billing → Your products → Select subscription → Cancel. Refund available within 7 days.",
              url: "/billing/cancel-subscription",
            },
            {
              title: "Update payment methods",
              summary:
                "Supports credit/debit cards, bank accounts (ACH), and invoice billing for Enterprise Agreement customers.",
              url: "/billing/payment-methods",
            },
            {
              title: "View billing history and invoices",
              summary:
                "Admin center → Billing → Bills & payments. Download PDF invoices, view payment status, and export to CSV.",
              url: "/billing/history",
            },
          ],
        },
        {
          name: "Setup & Installation",
          article_count: 12,
          articles: [
            {
              title: "Install Microsoft 365 apps on Windows/Mac",
              summary:
                "Sign in to office.com → Install apps → Choose platform. Requires Windows 10+ or macOS 12+, 4GB RAM, 10GB disk.",
              url: "/setup/install-apps",
            },
            {
              title: "Set up email on mobile devices",
              summary:
                "Download Outlook from App Store/Play Store. Supports iOS 16+, Android 10+. Auto-discovers Exchange settings.",
              url: "/setup/mobile-email",
            },
          ],
        },
        {
          name: "Security & Compliance",
          article_count: 15,
          articles: [
            {
              title: "Enable Multi-Factor Authentication (MFA)",
              summary:
                "Azure AD → Security → MFA → Enable per-user or via Conditional Access policies. Supports Authenticator app, SMS, and FIDO2 keys.",
              url: "/security/enable-mfa",
            },
            {
              title: "Data Loss Prevention (DLP) policies",
              summary:
                "Compliance center → DLP → Create policy. Pre-built templates for PCI, HIPAA, GDPR. Scans Exchange, SharePoint, Teams, and OneDrive.",
              url: "/security/dlp-policies",
            },
          ],
        },
        {
          name: "Troubleshooting",
          article_count: 12,
          articles: [
            {
              title: "Fix Outlook connectivity issues",
              summary:
                'Run Microsoft Support and Recovery Assistant (SaRA). Check autodiscover DNS records. Clear credential cache via Credential Manager.',
              url: "/troubleshooting/outlook-connectivity",
            },
            {
              title: "Teams call quality problems",
              summary:
                "Check network bandwidth (1.5 Mbps recommended). Disable VPN split tunneling for Teams traffic. Run network assessment tool.",
              url: "/troubleshooting/teams-call-quality",
            },
          ],
        },
      ],
      contact_info: {
        phone: "1-800-642-7676",
        business_hours: "Mon-Fri 6AM-6PM PT",
        chat: "Available 24/7 at support.microsoft.com",
        community: "answers.microsoft.com",
        admin_support: "admin.microsoft.com → Support → New service request",
      },
    },
  },
  competitor: {
    analysis_date: "2025-02-27",
    competitors_tracked: 3,
    pricing_comparison: [
      {
        company: "Slack",
        product: "Business+",
        price_per_user_month: "$12.50",
        annual_billing: true,
        storage_per_user: "20 GB",
        guest_access: "Unlimited",
        sla: "99.99% uptime",
        key_differentiator: "Channels-first communication, Huddles, Canvas, Workflow Builder",
      },
      {
        company: "Microsoft Teams",
        product: "Microsoft 365 Business Standard",
        price_per_user_month: "$12.50",
        annual_billing: true,
        storage_per_user: "1 TB (OneDrive)",
        guest_access: "Unlimited",
        sla: "99.9% uptime (financially backed)",
        key_differentiator: "Full Office suite included, Loop, Copilot integration, Mesh (3D meetings)",
      },
      {
        company: "Google Workspace",
        product: "Business Standard",
        price_per_user_month: "$14.00",
        annual_billing: true,
        storage_per_user: "2 TB pooled",
        guest_access: "Unlimited",
        sla: "99.9% uptime",
        key_differentiator: "Gmail, Drive native, Gemini AI included, AppSheet no-code",
      },
    ],
    feature_matrix: {
      video_conferencing: {
        Slack: "Huddles (50 participants, no recording)",
        "Microsoft Teams": "Full featured (1,000 participants, recording, transcription)",
        "Google Workspace": "Google Meet (500 participants, recording, noise cancellation)",
      },
      file_storage: {
        Slack: "20 GB per user",
        "Microsoft Teams": "1 TB per user (OneDrive) + 10 GB shared",
        "Google Workspace": "2 TB pooled across org",
      },
      ai_features: {
        Slack: "Slack AI — $10/user/month add-on (channel summaries, search answers)",
        "Microsoft Teams": "Copilot — $30/user/month add-on (meeting summaries, chat composition, Excel analysis)",
        "Google Workspace": "Gemini — included (email drafts, doc summaries, slide generation)",
      },
      admin_controls: {
        Slack: "Enterprise Grid required for advanced controls",
        "Microsoft Teams": "Full Azure AD integration, Conditional Access, Intune MDM",
        "Google Workspace": "Admin console, endpoint management, DLP policies",
      },
    },
    market_changes_2025: [
      "Microsoft added Copilot to Teams at $30/user/month premium (Jan 2025)",
      "Slack launched Slack AI for $10/user/month with channel summaries (Mar 2025)",
      "Google included Gemini in all Workspace tiers at no extra cost (Feb 2025)",
      "Microsoft announced Teams Mesh for immersive 3D meetings (Preview Q2 2025)",
      "Slack acquired Quill for enhanced async video messaging (Apr 2025)",
    ],
    analyst_summary:
      "Microsoft Teams offers the strongest value proposition for existing Microsoft shops, bundling the full Office suite at the same price point as Slack. Google Workspace leads on included AI features. Slack remains preferred for developer-centric and cross-platform organizations.",
  },
  browser: {
    session: {
      id: "sess_f7a2b9c1d4e8",
      profile: "vendor-portal",
      ttl_seconds: 300,
      live_view_url: "https://browser.firecrawl.dev/live/sess_f7a2b9c1d4e8",
    },
    actions_performed: [
      { step: 1, action: "navigate", target: "https://portal.contoso.com/login", status: "success", duration_ms: 820 },
      { step: 2, action: "fill", target: "#email input", value: "demo@northwind.com", status: "success", duration_ms: 45 },
      { step: 3, action: "fill", target: "#password input", value: "••••••••", status: "success", duration_ms: 38 },
      { step: 4, action: "click", target: "Submit button", status: "success", duration_ms: 1240 },
      { step: 5, action: "wait_for_navigation", target: "/dashboard", status: "success", duration_ms: 680 },
      { step: 6, action: "click", target: "Billing nav link", status: "success", duration_ms: 450 },
      { step: 7, action: "wait_for_selector", target: ".invoice-table", status: "success", duration_ms: 320 },
      { step: 8, action: "extract", target: "Invoice table (12 rows)", status: "success", duration_ms: 180 },
    ],
    extracted_data: {
      account: {
        name: "Northwind Traders Inc.",
        account_number: "NWT-2024-8842",
        subscription: "Enterprise Plan",
        renewal_date: "2025-06-15",
        monthly_spend: 12450.00,
        active_users: 127,
        storage_used: "4.2 TB of 10 TB",
      },
      recent_invoices: [
        { id: "INV-2025-0201", date: "2025-02-01", amount: 12450.00, status: "Paid", payment_method: "ACH" },
        { id: "INV-2025-0101", date: "2025-01-01", amount: 11890.00, status: "Paid", payment_method: "ACH" },
        { id: "INV-2024-1201", date: "2024-12-01", amount: 11890.00, status: "Paid", payment_method: "Wire" },
        { id: "INV-2024-1101", date: "2024-11-01", amount: 10250.00, status: "Paid", payment_method: "ACH" },
        { id: "INV-2024-1001", date: "2024-10-01", amount: 10250.00, status: "Paid", payment_method: "ACH" },
      ],
      billing_summary: {
        total_ytd: 24340.00,
        average_monthly: 12170.00,
        next_invoice_date: "2025-03-01",
        payment_method_on_file: "ACH — Chase Business ****4821",
      },
    },
    session_duration_seconds: 3.8,
    credits_used: 8,
  },
};

const MOCK_DELAYS: Record<string, number> = {
  invoice: 1500,
  vendor: 4200,
  browser: 3800,
  knowledge: 3500,
  competitor: 2800,
};

const MOCK_META: Record<string, object> = {
  invoice: { credits_used: 3, pages_processed: 1, method: "/scrape + PDF Parser V2 (auto)" },
  vendor: { credits_used: 48, pages_processed: 12, method: "/agent (FIRE-1)" },
  browser: { credits_used: 8, pages_processed: 1, method: "/browser sandbox" },
  knowledge: { credits_used: 32, pages_processed: 47, method: "/crawl + /extract" },
  competitor: { credits_used: 18, pages_processed: 3, method: "/extract (parallel)" },
};

// ── Route handler ──────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { type, input, apiKey, demoMode } = body as {
    type: string;
    input: string;
    apiKey?: string;
    demoMode: boolean;
  };

  const resolvedKey = apiKey || process.env.FIRECRAWL_API_KEY || "";

  // Demo mode — return mock data with realistic delay
  if (demoMode || !resolvedKey) {
    const delay = MOCK_DELAYS[type] || 2000;
    await new Promise((r) => setTimeout(r, delay));

    return NextResponse.json({
      success: true,
      data: MOCK_DATA[type] ?? {},
      meta: {
        demo_mode: true,
        ...(MOCK_META[type] ?? {}),
        time_ms: delay,
      },
    });
  }

  // Live mode — call Firecrawl API
  try {
    const FirecrawlApp = (await import("@mendable/firecrawl-js")).default;
    const app = new FirecrawlApp({ apiKey: resolvedKey });
    const start = Date.now();

    let data: unknown;

    switch (type) {
      case "invoice": {
        // PDF Parser V2 with auto mode (OCR fallback)
        const result = await app.scrape(input, {
          formats: [
            "markdown",
            {
              type: "json" as const,
              schema: {
                type: "object",
                properties: {
                  invoice: {
                    type: "object",
                    properties: {
                      number: { type: "string" },
                      date_issued: { type: "string" },
                      date_due: { type: "string" },
                      vendor: { type: "object" },
                      bill_to: { type: "object" },
                      line_items: { type: "array" },
                      subtotal: { type: "number" },
                      tax_amount: { type: "number" },
                      total_due: { type: "number" },
                      payment_terms: { type: "string" },
                    },
                  },
                },
              },
              prompt:
                "Extract all invoice data: vendor info, billing details, every line item, subtotals, taxes, and payment terms.",
            },
          ],
          parsers: [{ type: "pdf", mode: "auto" }],
        });
        data = result;
        break;
      }

      case "vendor": {
        const agentResult = await app.agent({
          prompt: input,
          maxCredits: 100,
        });
        data = agentResult;
        break;
      }

      case "browser": {
        // Browser Sandbox — create session and execute code
        const session = await (app as unknown as {
          browser: (opts?: Record<string, unknown>) => Promise<{ id: string }>;
          browserExecute: (id: string, opts: Record<string, unknown>) => Promise<unknown>;
        }).browser({ ttl: 300, idleTimeout: 60 });
        const execResult = await (app as unknown as {
          browserExecute: (id: string, opts: Record<string, unknown>) => Promise<unknown>;
        }).browserExecute(session.id, {
          code: `
            await page.goto("${input.split(" ")[0]}");
            const title = await page.title();
            const content = await page.content();
            return { title, url: page.url(), content_length: content.length };
          `,
          language: "node",
        });
        data = { session_id: session.id, result: execResult };
        break;
      }

      case "knowledge": {
        const crawlResult = await app.crawl(input, {
          limit: 30,
          scrapeOptions: { formats: ["markdown"] },
        });
        const crawlData = crawlResult as { data?: Array<{ url?: string; markdown?: string }> };
        data = {
          pages_crawled: crawlData.data?.length ?? 0,
          pages: crawlData.data?.slice(0, 10).map((p) => ({
            url: p.url,
            content_preview: p.markdown?.slice(0, 300),
          })),
        };
        break;
      }

      case "competitor": {
        const urls = input
          .split(",")
          .map((u: string) => u.trim())
          .filter(Boolean);
        const extractResult = await app.extract({
          urls,
          prompt:
            "Extract pricing information, plan tiers, features, and competitive positioning from these pages.",
          schema: {
            type: "object",
            properties: {
              companies: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    plans: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          tier: { type: "string" },
                          price: { type: "string" },
                          features: {
                            type: "array",
                            items: { type: "string" },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        });
        data = extractResult;
        break;
      }

      default:
        return NextResponse.json(
          { success: false, error: "Unknown demo type" },
          { status: 400 }
        );
    }

    const elapsed = Date.now() - start;

    // Check for partial failures (API call succeeded but operation failed)
    const dataObj = data as Record<string, unknown> | null;
    const isFailed =
      dataObj?.status === "failed" ||
      (dataObj?.success === true && dataObj?.error) ||
      (dataObj?.metadata as Record<string, unknown>)?.statusCode === 404;

    if (isFailed) {
      return NextResponse.json({
        success: true,
        data: MOCK_DATA[type] ?? {},
        meta: {
          demo_mode: true,
          fallback: true,
          live_error: dataObj?.error || "API returned an error — showing demo data",
          ...(MOCK_META[type] ?? {}),
          time_ms: elapsed,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data,
      meta: {
        demo_mode: false,
        time_ms: elapsed,
        method: MOCK_META[type] ? (MOCK_META[type] as Record<string, unknown>).method : "unknown",
      },
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      {
        success: false,
        error: message,
        data: MOCK_DATA[type] ?? {},
        meta: {
          demo_mode: true,
          fallback: true,
          ...(MOCK_META[type] ?? {}),
          time_ms: 0,
        },
      },
      { status: 200 }
    );
  }
}
