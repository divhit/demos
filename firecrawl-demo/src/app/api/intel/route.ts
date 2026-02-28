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
    agent_model: "AI Research Agent",
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
    extracted: {
      page_title: "Trending repositories on GitHub today",
      main_heading: "Trending",
      items: [
        { title: "microsoft/TypeScript", description: "TypeScript is a superset of JavaScript that compiles to clean JavaScript output.", link: "https://github.com/microsoft/TypeScript", metadata: "12,450 stars today · TypeScript" },
        { title: "vercel/next.js", description: "The React Framework for the Web — used by some of the world's largest companies.", link: "https://github.com/vercel/next.js", metadata: "8,320 stars today · JavaScript" },
        { title: "tailwindlabs/tailwindcss", description: "A utility-first CSS framework for rapid UI development.", link: "https://github.com/tailwindlabs/tailwindcss", metadata: "5,180 stars today · CSS" },
        { title: "anthropics/claude-code", description: "An agentic coding tool that lives in your terminal.", link: "https://github.com/anthropics/claude-code", metadata: "4,900 stars today · TypeScript" },
        { title: "openai/whisper", description: "Robust Speech Recognition via Large-Scale Weak Supervision.", link: "https://github.com/openai/whisper", metadata: "3,210 stars today · Python" },
      ],
      summary: "GitHub Trending page showing the most popular repositories today, ranked by daily star count. Dominated by developer tools and AI/ML projects.",
    },
    screenshot: "[screenshot captured]",
    markdown_preview: "# Trending\n\nSee what the GitHub community is most excited about today.\n\n## microsoft/TypeScript\nTypeScript is a superset of JavaScript...",
    url: "https://github.com/trending",
    actions_executed: ["wait 3s for JS render", "full-page screenshot", "scrape content"],
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
  invoice: { credits_used: 3, pages_processed: 1, method: "PDF Parser V2 (auto)" },
  vendor: { credits_used: 48, pages_processed: 12, method: "AI Research Agent" },
  browser: { credits_used: 8, pages_processed: 1, method: "Browser Sandbox" },
  knowledge: { credits_used: 32, pages_processed: 47, method: "Crawl + Extract" },
  competitor: { credits_used: 18, pages_processed: 3, method: "Parallel Extract" },
};

// ── Route handler ──────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { type, input, apiKey, demoMode, step, sessionId, extractionPrompt } = body as {
    type: string;
    input: string;
    apiKey?: string;
    demoMode: boolean;
    step?: string;
    sessionId?: string;
    extractionPrompt?: string;
  };

  const resolvedKey = (apiKey || process.env.FIRECRAWL_API_KEY || "").trim();

  // ── Browser sandbox multi-step flow ──────────────────────────
  if (type === "browser" && step) {
    // Demo mode browser steps
    if (demoMode || !resolvedKey) {
      if (step === "start") {
        await new Promise((r) => setTimeout(r, 800));
        return NextResponse.json({
          sessionId: "demo_sess_" + Date.now(),
          liveViewUrl: null, // no live view in demo mode
        });
      }
      if (step === "execute") {
        await new Promise((r) => setTimeout(r, MOCK_DELAYS.browser || 3800));
        return NextResponse.json({
          success: true,
          data: MOCK_DATA.browser ?? {},
          meta: { demo_mode: true, ...(MOCK_META.browser ?? {}), time_ms: MOCK_DELAYS.browser },
        });
      }
      if (step === "close") {
        return NextResponse.json({ success: true });
      }
    }

    // Live mode browser steps
    try {
      const FirecrawlApp = (await import("@mendable/firecrawl-js")).default;
      const app = new FirecrawlApp({ apiKey: resolvedKey });

      if (step === "start") {
        const session = await app.browser({ ttl: 120, activityTtl: 60 });
        return NextResponse.json({
          sessionId: session.id,
          liveViewUrl: session.liveViewUrl || null,
        });
      }

      if (step === "execute" && sessionId) {
        const start = Date.now();
        // Navigate to URL and extract content
        const prompt = extractionPrompt || "Extract the main content from the page.";
        const execResult = await app.browserExecute(sessionId, {
          code: `
const page = (await browser.contexts())[0].pages()[0];
await page.goto("${input}", { waitUntil: "networkidle", timeout: 30000 });
await page.waitForTimeout(2000);
const title = await page.title();
const url = page.url();
const text = await page.evaluate(() => document.body.innerText.slice(0, 5000));
return JSON.stringify({ title, url, content: text });
          `.trim(),
          language: "node",
        });
        const elapsed = Date.now() - start;

        // Parse the execution result
        let pageData: Record<string, unknown> = {};
        try {
          const resultStr = (execResult as unknown as Record<string, unknown>).result as string;
          if (resultStr) pageData = JSON.parse(resultStr);
        } catch { /* ignore parse errors */ }

        // Now do a structured extraction using scrape with the user's prompt
        let extracted: unknown = null;
        try {
          const scrapeResult = await app.scrape(input, {
            formats: [
              {
                type: "json" as const,
                schema: {
                  type: "object",
                  properties: {
                    page_title: { type: "string" },
                    items: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          title: { type: "string" },
                          description: { type: "string" },
                          link: { type: "string" },
                          metadata: { type: "string" },
                        },
                      },
                    },
                    summary: { type: "string" },
                  },
                },
                prompt,
              },
            ],
            actions: [
              { type: "wait", milliseconds: 2000 },
              { type: "scrape" },
            ],
          });
          const sr = scrapeResult as Record<string, unknown>;
          extracted = sr.json ?? sr.extract;
        } catch { /* extraction is optional, we still have raw content */ }

        const extractedObj = (extracted ?? pageData) as Record<string, unknown>;
        return NextResponse.json({
          success: true,
          data: {
            extracted: extractedObj,
            page_title: pageData.title || (extractedObj as Record<string, unknown>).page_title || input,
            url: pageData.url || input,
          },
          meta: { demo_mode: false, time_ms: elapsed, method: "Browser Sandbox" },
        });
      }

      if (step === "close" && sessionId) {
        await app.deleteBrowser(sessionId);
        return NextResponse.json({ success: true });
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Browser error";
      // Fall back to demo data on error
      if (step === "execute") {
        return NextResponse.json({
          success: true,
          data: MOCK_DATA.browser ?? {},
          meta: { demo_mode: true, fallback: true, live_error: message, ...(MOCK_META.browser ?? {}), time_ms: 0 },
        });
      }
      return NextResponse.json({ success: false, error: message }, { status: 200 });
    }
  }

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

  // Live mode — call extraction API
  try {
    const FirecrawlApp = (await import("@mendable/firecrawl-js")).default;
    const app = new FirecrawlApp({ apiKey: resolvedKey });
    const start = Date.now();

    let data: unknown;

    switch (type) {
      case "invoice": {
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
                      number: { type: "string", description: "Invoice number" },
                      date_issued: { type: "string", description: "Invoice date in YYYY-MM-DD format" },
                      date_due: { type: "string", description: "Payment due date in YYYY-MM-DD format" },
                      currency: { type: "string", description: "Currency code e.g. CAD, USD" },
                      vendor: {
                        type: "object",
                        properties: {
                          name: { type: "string" },
                          address: { type: "string" },
                          phone: { type: "string" },
                          email: { type: "string" },
                          website: { type: "string" },
                        },
                      },
                      bill_to: {
                        type: "object",
                        properties: {
                          name: { type: "string" },
                          customer_number: { type: "string" },
                          address: { type: "string" },
                          customer_ref_1: { type: "string" },
                          customer_ref_2: { type: "string" },
                        },
                      },
                      line_items: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            description: { type: "string" },
                            subtotal: { type: "number" },
                            gst: { type: "number" },
                            hst: { type: "number" },
                            pst_qst: { type: "number" },
                            total: { type: "number" },
                          },
                        },
                      },
                      subtotal: { type: "number" },
                      total_tax: { type: "number" },
                      total_due: { type: "number" },
                      payment_terms: { type: "string", description: "Payment terms e.g. Net 15, due date info" },
                      late_payment_fee: { type: "string", description: "Late payment penalty rate" },
                      payment_methods: {
                        type: "array",
                        items: { type: "string" },
                      },
                    },
                  },
                },
              },
              prompt:
                "Extract ALL invoice data from this PDF: invoice number, dates (issued and due), vendor/sender info, bill-to/customer info including customer number, every line item with its category and amounts (subtotal, taxes, total), overall totals, payment terms, late fees, and accepted payment methods. Be thorough — extract every field visible on the invoice.",
            },
          ],
          parsers: [{ type: "pdf", mode: "auto" }],
        });
        // Return the structured JSON extraction, fall back to markdown
        const scrapeResult = result as Record<string, unknown>;
        data = scrapeResult.json ?? scrapeResult.extract ?? {
          extracted_markdown: scrapeResult.markdown,
          note: "Structured extraction unavailable — raw content returned",
        };
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
        // Browser is handled above via step-based flow
        // This fallback handles legacy single-call mode
        return NextResponse.json(
          { success: false, error: "Browser demo requires step parameter (start/execute/close)" },
          { status: 400 }
        );
      }

      case "knowledge": {
        const crawlResult = await app.crawl(input, {
          limit: 30,
          scrapeOptions: { formats: ["markdown"] },
        });
        const crawlData = crawlResult as {
          data?: Array<{
            markdown?: string;
            metadata?: { url?: string; title?: string; description?: string };
          }>;
        };
        data = {
          source_url: input,
          pages_crawled: crawlData.data?.length ?? 0,
          pages: crawlData.data?.slice(0, 10).map((p) => ({
            url: p.metadata?.url ?? "unknown",
            title: p.metadata?.title ?? "",
            description: p.metadata?.description ?? "",
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

    // Check for partial failures
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
