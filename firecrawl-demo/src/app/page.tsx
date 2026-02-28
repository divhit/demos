"use client";

import { useState, useCallback } from "react";

// ════════════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════════════
type DemoId = "invoice" | "vendor" | "browser" | "knowledge" | "competitor";

interface DemoPreset {
  label: string;
  value: string;
}

interface DemoConfig {
  id: DemoId;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  gradient: string;
  borderColor: string;
  inputLabel: string;
  inputPlaceholder: string;
  presets: DemoPreset[];
  method: string;
}

interface RunMeta {
  demo_mode: boolean;
  credits_used?: number;
  pages_processed?: number;
  time_ms: number;
  method?: string;
  fallback?: boolean;
  live_error?: string;
}

interface RunResult {
  success: boolean;
  data: unknown;
  meta: RunMeta;
  error?: string;
}

// ════════════════════════════════════════════════════════════════
// DEMO CONFIGURATIONS
// ════════════════════════════════════════════════════════════════
const DEMOS: DemoConfig[] = [
  {
    id: "invoice",
    title: "PDF Invoice Processor",
    subtitle: "Parse any PDF with AI + OCR — 3x faster",
    description:
      "AI-powered PDF parser built in Rust for 3x faster parsing. Supports three modes: fast (text-only), auto (smart OCR fallback), and ocr (forced OCR for scanned documents). Extract structured invoice data from any PDF — vendor info, line items, totals — even from scanned paper invoices.",
    icon: "📄",
    gradient: "from-orange-500/20 to-orange-600/5",
    borderColor: "border-orange-500/20 hover:border-orange-500/40",
    inputLabel: "PDF Invoice URL",
    inputPlaceholder: "https://vendor.example.com/invoices/INV-2024-0847.pdf",
    presets: [
      { label: "Contoso Invoice PDF", value: "https://contoso.com/invoices/INV-2024-0847.pdf" },
      { label: "Scanned Invoice (OCR)", value: "https://northwindtraders.com/scanned/receipt-dec2024.pdf" },
    ],
    method: "PDF Parser V2",
  },
  {
    id: "vendor",
    title: "Vendor Research Agent",
    subtitle: "AI agent that researches the web for you",
    description:
      "Describe what you need — our AI agent autonomously searches the web, navigates vendor sites, and returns structured comparison data. No URLs required.",
    icon: "🔍",
    gradient: "from-blue-500/20 to-blue-600/5",
    borderColor: "border-blue-500/20 hover:border-blue-500/40",
    inputLabel: "Research Prompt",
    inputPlaceholder:
      "Compare enterprise CRM pricing across Salesforce, HubSpot, and Dynamics 365",
    presets: [
      {
        label: "CRM Comparison",
        value:
          "Compare enterprise CRM pricing and features across Salesforce, HubSpot, and Microsoft Dynamics 365",
      },
      {
        label: "Cloud Providers",
        value:
          "Compare AWS, Azure, and Google Cloud pricing for a startup with 10 developers needing compute, storage, and CI/CD",
      },
    ],
    method: "AI Research Agent",
  },
  {
    id: "browser",
    title: "Browser Automation",
    subtitle: "AI-controlled browser for complex workflows",
    description:
      "Managed browser sandbox in a secure cloud environment. Navigate portals behind logins, click through multi-step forms, interact with JS-heavy apps, and extract data that static scraping can't reach. Includes live view for real-time monitoring.",
    icon: "🌐",
    gradient: "from-cyan-500/20 to-cyan-600/5",
    borderColor: "border-cyan-500/20 hover:border-cyan-500/40",
    inputLabel: "Task Description",
    inputPlaceholder: "Log into portal.example.com, navigate to billing page, extract all recent invoices",
    presets: [
      { label: "Portal Login + Extract", value: "Navigate to https://portal.contoso.com, log in with demo credentials, go to the Billing section, and extract all invoice data from the account dashboard" },
      { label: "Multi-Step Form Fill", value: "Go to https://procurement.northwind.com/rfq, fill out the vendor registration form with company details, submit it, and capture the confirmation number" },
    ],
    method: "Browser Sandbox",
  },
  {
    id: "knowledge",
    title: "Knowledge Base Miner",
    subtitle: "Crawl a site, build structured knowledge",
    description:
      "Provide a website URL — the system crawls the entire site, extracts key information, and builds a structured knowledge base with categories, articles, FAQs, and contact info.",
    icon: "📚",
    gradient: "from-emerald-500/20 to-emerald-600/5",
    borderColor: "border-emerald-500/20 hover:border-emerald-500/40",
    inputLabel: "Website URL to Crawl",
    inputPlaceholder: "https://support.example.com",
    presets: [
      { label: "Microsoft Support", value: "https://support.microsoft.com/en-us/microsoft-365" },
      { label: "Stripe Docs", value: "https://docs.stripe.com" },
    ],
    method: "Crawl + Extract",
  },
  {
    id: "competitor",
    title: "Competitive Intelligence",
    subtitle: "Track and compare competitor data",
    description:
      "Monitor competitor pricing, features, and positioning. Extracts structured data from multiple URLs simultaneously using parallel processing with wildcard support.",
    icon: "📊",
    gradient: "from-purple-500/20 to-purple-600/5",
    borderColor: "border-purple-500/20 hover:border-purple-500/40",
    inputLabel: "Competitor URLs (comma-separated)",
    inputPlaceholder:
      "https://competitor1.com/pricing, https://competitor2.com/pricing",
    presets: [
      {
        label: "Collaboration Tools",
        value:
          "https://slack.com/pricing, https://teams.microsoft.com/pricing, https://workspace.google.com/pricing",
      },
      {
        label: "Project Management",
        value:
          "https://asana.com/pricing, https://monday.com/pricing, https://clickup.com/pricing",
      },
    ],
    method: "Parallel Extract",
  },
];

// ════════════════════════════════════════════════════════════════
// SYNTAX HIGHLIGHTING
// ════════════════════════════════════════════════════════════════
function syntaxHighlight(json: string): string {
  return json.replace(
    /("(\\u[\dA-Fa-f]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
    (match) => {
      let cls = "json-number";
      if (/^"/.test(match)) {
        cls = /:$/.test(match) ? "json-key" : "json-string";
      } else if (/true|false/.test(match)) {
        cls = "json-boolean";
      } else if (/null/.test(match)) {
        cls = "json-null";
      }
      return `<span class="${cls}">${match}</span>`;
    }
  );
}

// ════════════════════════════════════════════════════════════════
// COMPONENTS
// ════════════════════════════════════════════════════════════════

function IntelIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LoadingDots() {
  return (
    <span className="dot-pulse inline-flex gap-1">
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
    </span>
  );
}

function JsonViewer({ data }: { data: unknown }) {
  const [copied, setCopied] = useState(false);
  const json = JSON.stringify(data, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <button
        onClick={handleCopy}
        className="absolute right-3 top-3 px-2.5 py-1 text-xs rounded-md bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
      <pre
        className="bg-code-bg border border-border rounded-xl p-5 overflow-auto text-[13px] leading-relaxed font-mono max-h-[600px]"
        dangerouslySetInnerHTML={{ __html: syntaxHighlight(json) }}
      />
    </div>
  );
}

function StatsBadge({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <span>{icon}</span>
      <span className="text-muted">{label}</span>
      <span className="text-foreground font-medium">{value}</span>
    </div>
  );
}

// ── DASHBOARD ──────────────────────────────────────────────────

function Dashboard({
  onSelect,
}: {
  onSelect: (id: DemoId) => void;
}) {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      {/* Hero */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-6">
          <IntelIcon className="w-3.5 h-3.5" />
          AI-Powered Intelligence
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          WebIntel
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Turn any website into structured business intelligence. Extract invoices, research vendors, build knowledge bases, and monitor competitors — all with AI.
        </p>
      </div>

      {/* Demo Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {DEMOS.map((demo, i) => (
          <button
            key={demo.id}
            onClick={() => onSelect(demo.id)}
            className={`group relative text-left p-6 rounded-2xl border ${demo.borderColor} bg-gradient-to-br ${demo.gradient} transition-all duration-300 hover:scale-[1.01] animate-fade-in-up`}
            style={{ animationDelay: `${i * 100}ms`, opacity: 0 }}
          >
            <div className="text-3xl mb-4">{demo.icon}</div>
            <h3 className="text-lg font-semibold mb-1">{demo.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {demo.subtitle}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted font-mono">
                {demo.method}
              </span>
              <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors flex items-center gap-1">
                Try it
                <svg
                  className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Capabilities */}
      <div className="mt-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 text-center">
        {[
          { label: "Scrape", desc: "PDFs & webpages to JSON" },
          { label: "Research", desc: "Autonomous web research" },
          { label: "Automate", desc: "Managed browser automation" },
          { label: "Crawl", desc: "Entire sites at scale" },
          { label: "Extract", desc: "Structured data from URLs" },
        ].map((cap) => (
          <div key={cap.label}>
            <div className="text-sm font-semibold text-primary mb-1">
              {cap.label}
            </div>
            <div className="text-xs text-muted-foreground">{cap.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── DEMO RUNNER ────────────────────────────────────────────────

function DemoRunner({
  demo,
  apiKey,
  demoMode,
  onBack,
}: {
  demo: DemoConfig;
  apiKey: string;
  demoMode: boolean;
  onBack: () => void;
}) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<RunResult | null>(null);
  const [loading, setLoading] = useState(false);

  const run = useCallback(async () => {
    const value = input.trim();
    if (!value) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/intel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: demo.id,
          input: value,
          apiKey,
          demoMode,
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err: unknown) {
      setResult({
        success: false,
        data: null,
        meta: { demo_mode: true, time_ms: 0 },
        error: err instanceof Error ? err.message : "Request failed",
      });
    } finally {
      setLoading(false);
    }
  }, [input, apiKey, demoMode, demo.id]);

  const selectPreset = (value: string) => {
    setInput(value);
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 animate-fade-in-up">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Dashboard
      </button>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{demo.icon}</span>
          <h2 className="text-2xl font-bold">{demo.title}</h2>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          {demo.description}
        </p>
      </div>

      {/* Presets */}
      <div className="mb-4">
        <div className="text-xs text-muted mb-2 uppercase tracking-wider font-medium">
          Quick Scenarios
        </div>
        <div className="flex flex-wrap gap-2">
          {demo.presets.map((p) => (
            <button
              key={p.label}
              onClick={() => selectPreset(p.value)}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-all ${
                input === p.value
                  ? "border-primary/50 bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-border-hover hover:text-foreground"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          {demo.inputLabel}
        </label>
        {demo.id === "vendor" || demo.id === "browser" ? (
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={demo.inputPlaceholder}
            rows={3}
            className="w-full px-4 py-3 bg-card border border-border rounded-xl text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 placeholder:text-muted transition-all resize-none"
          />
        ) : (
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={demo.inputPlaceholder}
            onKeyDown={(e) => e.key === "Enter" && run()}
            className="w-full px-4 py-3 bg-card border border-border rounded-xl text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 placeholder:text-muted transition-all"
          />
        )}
      </div>

      {/* Run button */}
      <button
        onClick={run}
        disabled={loading || !input.trim()}
        className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium text-sm rounded-xl transition-all"
      >
        {loading ? (
          <>
            <span className="spin-slow inline-block">
              <IntelIcon className="w-4 h-4" />
            </span>
            Processing
            <LoadingDots />
          </>
        ) : (
          <>
            <IntelIcon className="w-4 h-4" />
            Run Extraction
          </>
        )}
      </button>

      {/* Loading state */}
      {loading && (
        <div className="mt-8 space-y-3">
          <div className="h-4 w-3/4 rounded animate-shimmer" />
          <div className="h-4 w-1/2 rounded animate-shimmer" />
          <div className="h-4 w-2/3 rounded animate-shimmer" />
          <div className="h-4 w-1/3 rounded animate-shimmer" />
          <p className="text-xs text-muted mt-4">
            {demo.id === "vendor"
              ? "Agent is searching the web, navigating vendor sites, and extracting data..."
              : demo.id === "browser"
              ? "Browser session active — navigating, interacting, and extracting data..."
              : demo.id === "knowledge"
              ? "Crawling pages, extracting structured knowledge..."
              : demo.id === "competitor"
              ? "Extracting pricing data from multiple sites in parallel..."
              : "Parsing PDF document with AI + OCR..."}
          </p>
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div className="mt-8 space-y-4 animate-fade-in-up" style={{ opacity: 0 }}>
          {/* Status bar */}
          <div className="flex flex-wrap items-center gap-4 py-3 px-4 bg-card border border-border rounded-xl">
            <div className="flex items-center gap-1.5">
              <span
                className={`inline-block w-2 h-2 rounded-full ${
                  result.success ? "bg-emerald-400" : "bg-red-400"
                }`}
              />
              <span className="text-xs font-medium">
                {result.success ? "Success" : "Error"}
              </span>
            </div>
            {result.meta?.demo_mode && (
              <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary font-medium">
                {result.meta.fallback ? "Fallback to Demo" : "Demo Mode"}
              </span>
            )}
            <div className="flex-1" />
            {result.meta?.time_ms !== undefined && (
              <StatsBadge
                icon="⚡"
                label="Time"
                value={`${(result.meta.time_ms / 1000).toFixed(1)}s`}
              />
            )}
            {result.meta?.credits_used !== undefined && (
              <StatsBadge
                icon="🪙"
                label="Credits"
                value={String(result.meta.credits_used)}
              />
            )}
            {result.meta?.pages_processed !== undefined && (
              <StatsBadge
                icon="📄"
                label="Pages"
                value={String(result.meta.pages_processed)}
              />
            )}
          </div>

          {/* Error / fallback message */}
          {result.error ? (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
              {String(result.error)}
              {result.meta?.fallback && (
                <span className="block mt-1 text-xs text-red-400/60">
                  Showing demo data as fallback.
                </span>
              )}
            </div>
          ) : result.meta?.live_error ? (
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-sm text-amber-400">
              Live API: {String(result.meta.live_error)}
              <span className="block mt-1 text-xs text-amber-400/60">
                Showing demo data as fallback. The live connection is working — this is a plan/credit limitation.
              </span>
            </div>
          ) : null}

          {/* JSON Result */}
          {result.data != null ? <JsonViewer data={result.data} /> : null}
        </div>
      )}
    </div>
  );
}

// ── HEADER ─────────────────────────────────────────────────────

function Header({
  apiKey,
  setApiKey,
  demoMode,
  setDemoMode,
  showSettings,
  setShowSettings,
}: {
  apiKey: string;
  setApiKey: (v: string) => void;
  demoMode: boolean;
  setDemoMode: (v: boolean) => void;
  showSettings: boolean;
  setShowSettings: (v: boolean) => void;
}) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <IntelIcon className="w-5 h-5 text-primary" />
          <span className="font-semibold text-sm tracking-tight">
            WebIntel
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Demo Mode Toggle */}
          <button
            onClick={() => setDemoMode(!demoMode)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              demoMode
                ? "bg-primary/10 text-primary border border-primary/20"
                : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
            }`}
          >
            <span
              className={`inline-block w-1.5 h-1.5 rounded-full ${
                demoMode ? "bg-primary" : "bg-emerald-400"
              }`}
            />
            {demoMode ? "Demo Mode" : "Live Mode"}
          </button>

          {/* Settings Toggle */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="border-t border-border bg-surface">
          <div className="max-w-5xl mx-auto px-6 py-4">
            <div className="flex items-center gap-4">
              <label className="text-xs text-muted-foreground whitespace-nowrap">
                API Key
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your API key"
                className="flex-1 max-w-sm px-3 py-1.5 bg-card border border-border rounded-lg text-sm font-mono placeholder:text-muted focus:outline-none focus:border-primary/50 transition-colors"
              />
              <span className="text-xs text-muted">
                {apiKey
                  ? "Key set — switch to Live Mode to use it"
                  : "Leave empty for Demo Mode"}
              </span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

// ════════════════════════════════════════════════════════════════
// MAIN
// ════════════════════════════════════════════════════════════════

export default function Home() {
  const [view, setView] = useState<"dashboard" | DemoId>("dashboard");
  const [apiKey, setApiKey] = useState("");
  const [demoMode, setDemoMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const currentDemo = DEMOS.find((d) => d.id === view);

  return (
    <div className="min-h-screen bg-background font-sans">
      <Header
        apiKey={apiKey}
        setApiKey={setApiKey}
        demoMode={demoMode}
        setDemoMode={setDemoMode}
        showSettings={showSettings}
        setShowSettings={setShowSettings}
      />

      {view === "dashboard" ? (
        <Dashboard onSelect={(id) => setView(id)} />
      ) : (
        <DemoRunner
          key={view}
          demo={currentDemo!}
          apiKey={apiKey}
          demoMode={demoMode}
          onBack={() => setView("dashboard")}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-16">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between text-xs text-muted">
          <span>WebIntel — Analog Intelligence</span>
          <span>AI-powered web data extraction</span>
        </div>
      </footer>
    </div>
  );
}
