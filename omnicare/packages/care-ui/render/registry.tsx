"use client";

import { useState, type ReactNode } from "react";
import { defineRegistry } from "@json-render/react";
import { careCatalog } from "./catalog";
import { useOmniCare } from "./context";

// =============================================================================
// OmniCare Registry — Dark glass aesthetic
//
// All components use CSS custom properties from globals.css:
//   --widget-surface-raised, --widget-border, --widget-text-primary, etc.
//   --omnicare-primary (tenant accent color, set by ChatPanel)
// =============================================================================

export const { registry } = defineRegistry(careCatalog, {
  components: {
    // =====================================================================
    // Layout Primitives
    // =====================================================================
    Stack: ({ props, children }) => {
      const gap = { sm: "gap-2", md: "gap-3", lg: "gap-4" }[props.gap ?? "md"] ?? "gap-3";
      return (
        <div className={`flex ${props.direction === "horizontal" ? "flex-row flex-wrap items-start" : "flex-col"} ${gap}`}>
          {children}
        </div>
      );
    },

    Card: ({ props, children }) => (
      <div
        className="rounded-xl overflow-hidden w-full"
        style={{
          background: "var(--widget-surface-raised)",
          border: "1px solid var(--widget-border)",
        }}
      >
        {props.title && (
          <div className="px-4 py-3 flex items-center gap-2.5"
            style={{ borderBottom: "1px solid var(--widget-border)" }}
          >
            {props.icon && <span className="text-base">{props.icon}</span>}
            <div className="flex-1 flex items-center justify-between">
              <h4 className="text-[13px] font-semibold" style={{ color: "var(--widget-text-primary)" }}>
                {props.title}
              </h4>
              {props.subtitle && (
                <span className="text-[11px] font-medium" style={{ color: "var(--widget-text-muted)" }}>
                  {props.subtitle}
                </span>
              )}
            </div>
          </div>
        )}
        <div className="p-3.5 flex flex-col gap-3">{children}</div>
      </div>
    ),

    Grid: ({ props, children }) => {
      const cols = { "2": "grid-cols-2", "3": "grid-cols-3", "4": "grid-cols-4" }[props.columns ?? "2"] ?? "grid-cols-2";
      const gap = { sm: "gap-2", md: "gap-2.5", lg: "gap-3" }[props.gap ?? "md"] ?? "gap-2.5";
      return <div className={`grid ${cols} ${gap}`}>{children}</div>;
    },

    Heading: ({ props }) => {
      const Tag = (props.level ?? "h3") as "h2" | "h3" | "h4";
      const cls = {
        h2: "text-[14px] font-bold",
        h3: "text-[13px] font-bold",
        h4: "text-[12px] font-semibold",
      }[props.level ?? "h3"];
      return (
        <Tag className={cls} style={{
          color: (props.level ?? "h3") === "h4" ? "var(--widget-text-secondary)" : "var(--widget-text-primary)",
          letterSpacing: "-0.02em",
        }}>
          {props.text}
        </Tag>
      );
    },

    Text: ({ props }) => (
      <p className="text-[12px] leading-relaxed"
        style={{ color: props.muted ? "var(--widget-text-muted)" : "var(--widget-text-secondary)" }}>
        {props.content}
      </p>
    ),

    Separator: () => (
      <div className="my-1" style={{ borderTop: "1px solid var(--widget-border)" }} />
    ),

    // =====================================================================
    // Data Display
    // =====================================================================
    Metric: ({ props }) => {
      const trendIcon = props.trend === "up" ? "\u2191" : props.trend === "down" ? "\u2193" : null;
      const trendColor = props.trend === "up" ? "var(--widget-success)" : props.trend === "down" ? "var(--widget-danger)" : "var(--widget-text-muted)";
      return (
        <div className="rounded-lg p-3 text-center"
          style={{
            background: "var(--widget-bg)",
            border: "1px solid var(--widget-border)",
          }}
        >
          {props.icon && <div className="text-lg mb-1">{props.icon}</div>}
          <div className="flex items-center justify-center gap-1">
            <span className="text-[16px] font-bold leading-none" style={{ color: "var(--omnicare-primary, #6366f1)" }}>
              {props.value}
            </span>
            {trendIcon && <span className="text-[11px] font-bold" style={{ color: trendColor }}>{trendIcon}</span>}
          </div>
          <div className="text-[10px] font-medium uppercase tracking-wider mt-1" style={{ color: "var(--widget-text-muted)" }}>
            {props.label}
          </div>
          {props.detail && <div className="text-[10px] mt-0.5" style={{ color: trendColor }}>{props.detail}</div>}
        </div>
      );
    },

    Badge: ({ props }) => {
      const colors: Record<string, { bg: string; text: string; border: string }> = {
        default: { bg: "rgba(255,255,255,0.05)", text: "var(--widget-text-secondary)", border: "var(--widget-border-bright)" },
        success: { bg: "rgba(52,211,153,0.1)", text: "#34d399", border: "rgba(52,211,153,0.2)" },
        warning: { bg: "rgba(251,191,36,0.1)", text: "#fbbf24", border: "rgba(251,191,36,0.2)" },
        danger: { bg: "rgba(248,113,113,0.1)", text: "#f87171", border: "rgba(248,113,113,0.2)" },
        info: { bg: "rgba(99,102,241,0.1)", text: "#818cf8", border: "rgba(99,102,241,0.2)" },
      };
      const c = colors[props.variant ?? "default"] ?? colors.default;
      return (
        <span
          className="inline-block text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full"
          style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}
        >
          {props.text}
        </span>
      );
    },

    Table: ({ props }) => {
      const items: Array<Record<string, unknown>> = Array.isArray(props.data) ? props.data : [];
      if (items.length === 0) return null;
      return (
        <div className="overflow-x-auto rounded-lg" style={{ border: "1px solid var(--widget-border)" }}>
          <table className="w-full text-[12px]">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--widget-border)", background: "var(--widget-bg)" }}>
                {props.columns.map((col) => (
                  <th key={col.key} className="text-left py-2 px-3 text-[10px] uppercase tracking-wider font-semibold"
                    style={{ color: "var(--widget-text-muted)" }}>
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i} style={{ borderBottom: i < items.length - 1 ? "1px solid var(--widget-border)" : undefined }}>
                  {props.columns.map((col) => (
                    <td key={col.key} className="py-2 px-3" style={{ color: "var(--widget-text-secondary)" }}>
                      {String(item[col.key] ?? "")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    },

    Timeline: ({ props }) => (
      <div className="relative pl-6">
        <div className="absolute left-[5px] top-2 bottom-2 w-px"
          style={{ background: "var(--widget-border-bright)" }} />
        <div className="flex flex-col gap-3.5">
          {(props.items ?? []).map((item, i) => {
            const dotStyle = item.status === "completed"
              ? { background: "var(--widget-success)", boxShadow: "0 0 8px rgba(52,211,153,0.3)" }
              : item.status === "current"
                ? { background: "var(--omnicare-primary, #6366f1)", boxShadow: "0 0 8px var(--widget-accent-glow)" }
                : { background: "var(--widget-text-muted)" };
            return (
              <div key={i} className="relative">
                <div className="absolute -left-6 top-[3px] h-2.5 w-2.5 rounded-full" style={dotStyle} />
                <p className="text-[12px] font-semibold" style={{
                  color: item.status === "upcoming" ? "var(--widget-text-muted)" : "var(--widget-text-primary)",
                }}>
                  {item.title}
                </p>
                {item.description && (
                  <p className="text-[11px] mt-0.5" style={{ color: "var(--widget-text-muted)" }}>
                    {item.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    ),

    Progress: ({ props }) => {
      const max = props.max ?? 100;
      const pct = Math.min(100, Math.max(0, (props.value / max) * 100));
      return (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: "var(--widget-text-muted)" }}>
              {props.label}
            </span>
            <span className="text-[12px] font-bold" style={{ color: "var(--omnicare-primary, #6366f1)" }}>
              {props.value}/{max}
            </span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--widget-bg)" }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${pct}%`,
                background: `linear-gradient(90deg, var(--omnicare-primary, #6366f1), var(--omnicare-primary, #6366f1)cc)`,
                boxShadow: `0 0 8px var(--widget-accent-glow)`,
              }}
            />
          </div>
        </div>
      );
    },

    Callout: ({ props }) => {
      const cfg: Record<string, { color: string; icon: string }> = {
        info: { color: "#818cf8", icon: "\u2139\uFE0F" },
        tip: { color: "#34d399", icon: "\uD83D\uDCA1" },
        warning: { color: "#fbbf24", icon: "\u26A0\uFE0F" },
        important: { color: "#f87171", icon: "\u2757" },
      };
      const c = cfg[props.type ?? "info"] ?? cfg.info;
      return (
        <div className="rounded-lg p-3.5"
          style={{
            background: `${c.color}08`,
            borderLeft: `3px solid ${c.color}`,
            border: `1px solid ${c.color}20`,
            borderLeftWidth: "3px",
          }}
        >
          <div className="flex items-start gap-2.5">
            <span className="text-sm shrink-0">{c.icon}</span>
            <div className="flex-1 min-w-0">
              {props.title && (
                <p className="font-semibold text-[12px] mb-0.5" style={{ color: "var(--widget-text-primary)" }}>
                  {props.title}
                </p>
              )}
              <p className="text-[12px] leading-relaxed" style={{ color: "var(--widget-text-secondary)" }}>
                {props.content}
              </p>
            </div>
          </div>
        </div>
      );
    },

    Accordion: ({ props }) => {
      const [openIdx, setOpenIdx] = useState<number | null>(null);
      return (
        <div className="rounded-xl overflow-hidden"
          style={{ border: "1px solid var(--widget-border)" }}
        >
          {(props.items ?? []).map((item, i) => (
            <div key={i} style={i > 0 ? { borderTop: "1px solid var(--widget-border)" } : undefined}>
              <button
                type="button"
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="w-full flex items-center justify-between px-4 py-3 text-[12px] font-medium text-left transition-colors duration-150"
                style={{
                  color: "var(--widget-text-primary)",
                  background: openIdx === i ? "var(--widget-surface-hover)" : "transparent",
                }}
                onMouseEnter={(e) => { if (openIdx !== i) e.currentTarget.style.background = "var(--widget-surface-raised)"; }}
                onMouseLeave={(e) => { if (openIdx !== i) e.currentTarget.style.background = "transparent"; }}
              >
                <span>{item.title}</span>
                <svg
                  className="w-3.5 h-3.5 transition-transform duration-200"
                  style={{
                    color: "var(--widget-text-muted)",
                    transform: openIdx === i ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                className="overflow-hidden transition-all duration-200"
                style={{
                  maxHeight: openIdx === i ? "500px" : "0px",
                  opacity: openIdx === i ? 1 : 0,
                }}
              >
                <div className="px-4 pb-3 text-[12px] leading-relaxed" style={{ color: "var(--widget-text-secondary)" }}>
                  {item.content}
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    },

    Link: ({ props }) => (
      <a
        href={props.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[12px] font-semibold underline underline-offset-2 transition-opacity hover:opacity-80"
        style={{ color: "var(--omnicare-primary, #6366f1)" }}
      >
        {props.text}
      </a>
    ),

    // =====================================================================
    // Customer Care Interactive Components
    // =====================================================================

    OrderTracker: ({ props }) => (
      <div className="rounded-xl overflow-hidden w-full"
        style={{ background: "var(--widget-surface-raised)", border: "1px solid var(--widget-border)" }}
      >
        {/* Header */}
        <div className="px-4 py-3 flex items-center gap-2.5"
          style={{
            borderBottom: "1px solid var(--widget-border)",
            background: `linear-gradient(135deg, var(--omnicare-primary, #6366f1)15, transparent)`,
          }}
        >
          <span className="text-base">{"\uD83D\uDCE6"}</span>
          <div className="flex-1 flex items-center justify-between">
            <h4 className="text-[13px] font-semibold" style={{ color: "var(--widget-text-primary)" }}>
              Order {props.orderId}
            </h4>
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
              style={{
                background: "rgba(52,211,153,0.1)",
                color: "#34d399",
                border: "1px solid rgba(52,211,153,0.2)",
              }}>
              {props.status}
            </span>
          </div>
        </div>
        <div className="p-3.5 space-y-3.5">
          {/* Items */}
          <div className="space-y-1.5">
            {props.items.map((item, i) => (
              <div key={i} className="flex justify-between text-[12px]">
                <span style={{ color: "var(--widget-text-secondary)" }}>{item.name} x{item.quantity}</span>
                <span className="font-medium" style={{ color: "var(--widget-text-primary)" }}>{item.price}</span>
              </div>
            ))}
            <div className="flex justify-between text-[12px] font-bold pt-2"
              style={{ borderTop: "1px solid var(--widget-border)" }}>
              <span style={{ color: "var(--widget-text-primary)" }}>Total</span>
              <span style={{ color: "var(--omnicare-primary, #6366f1)" }}>{props.total}</span>
            </div>
          </div>
          {/* Timeline */}
          <div className="relative pl-6">
            <div className="absolute left-[5px] top-2 bottom-2 w-px" style={{ background: "var(--widget-border-bright)" }} />
            <div className="flex flex-col gap-2.5">
              {props.steps.map((step, i) => {
                const dotStyle = step.status === "completed"
                  ? { background: "var(--widget-success)", boxShadow: "0 0 6px rgba(52,211,153,0.3)" }
                  : step.status === "current"
                    ? { background: "var(--omnicare-primary, #6366f1)", boxShadow: "0 0 8px var(--widget-accent-glow)" }
                    : { background: "var(--widget-text-muted)" };
                return (
                  <div key={i} className="relative">
                    <div className="absolute -left-6 top-[3px] h-2.5 w-2.5 rounded-full" style={dotStyle} />
                    <p className="text-[12px]" style={{
                      color: step.status === "upcoming" ? "var(--widget-text-muted)" : "var(--widget-text-primary)",
                      fontWeight: step.status === "current" ? 600 : step.status === "completed" ? 500 : 400,
                    }}>
                      {step.title}
                    </p>
                    {step.description && (
                      <p className="text-[10px] mt-0.5" style={{ color: "var(--widget-text-muted)" }}>{step.description}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          {/* Delivery & Tracking */}
          <div className="grid grid-cols-2 gap-2">
            {props.estimatedDelivery && (
              <div className="rounded-lg p-2.5 text-center"
                style={{ background: "var(--widget-bg)", border: "1px solid var(--widget-border)" }}>
                <div className="text-[10px] font-medium uppercase tracking-wider" style={{ color: "var(--widget-text-muted)" }}>
                  Est. Delivery
                </div>
                <div className="text-[13px] font-bold mt-0.5" style={{ color: "var(--omnicare-primary, #6366f1)" }}>
                  {props.estimatedDelivery}
                </div>
              </div>
            )}
            {props.trackingNumber && (
              <a
                href={`https://www.google.com/search?q=track+package+${props.trackingNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg p-2.5 text-center block transition-all duration-150 cursor-pointer"
                style={{ background: "var(--widget-bg)", border: "1px solid var(--widget-border)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--omnicare-primary, #6366f1)40";
                  e.currentTarget.style.boxShadow = "0 0 12px var(--widget-accent-glow)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--widget-border)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div className="text-[10px] font-medium uppercase tracking-wider" style={{ color: "var(--widget-text-muted)" }}>
                  Track Package →
                </div>
                <div className="text-[11px] font-mono font-medium mt-0.5" style={{ color: "var(--omnicare-primary, #6366f1)" }}>
                  {props.trackingNumber}
                </div>
              </a>
            )}
          </div>
        </div>
      </div>
    ),

    TicketCard: ({ props }) => {
      const priorityColors: Record<string, { bg: string; text: string; border: string }> = {
        low: { bg: "rgba(255,255,255,0.04)", text: "var(--widget-text-secondary)", border: "var(--widget-border)" },
        medium: { bg: "rgba(99,102,241,0.08)", text: "#818cf8", border: "rgba(99,102,241,0.2)" },
        high: { bg: "rgba(251,191,36,0.08)", text: "#fbbf24", border: "rgba(251,191,36,0.2)" },
        urgent: { bg: "rgba(248,113,113,0.08)", text: "#f87171", border: "rgba(248,113,113,0.2)" },
      };
      const pc = priorityColors[props.priority.toLowerCase()] ?? priorityColors.medium;
      return (
        <div className="rounded-xl overflow-hidden w-full"
          style={{ background: "var(--widget-surface-raised)", border: "1px solid var(--widget-border)" }}
        >
          <div className="px-4 py-3 flex items-center gap-2.5"
            style={{ borderBottom: "1px solid var(--widget-border)" }}>
            <span className="text-base">{"\uD83C\uDFAB"}</span>
            <h4 className="text-[13px] font-semibold flex-1" style={{ color: "var(--widget-text-primary)" }}>
              Ticket {props.ticketId}
            </h4>
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
              style={{ background: "rgba(52,211,153,0.1)", color: "#34d399", border: "1px solid rgba(52,211,153,0.2)" }}>
              {props.status}
            </span>
          </div>
          <div className="p-3.5 space-y-3">
            <p className="text-[12px] font-medium" style={{ color: "var(--widget-text-primary)" }}>{props.subject}</p>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full"
                style={{ background: pc.bg, color: pc.text, border: `1px solid ${pc.border}` }}>
                {props.priority}
              </span>
              {props.createdAt && <span className="text-[10px]" style={{ color: "var(--widget-text-muted)" }}>{props.createdAt}</span>}
            </div>
            {props.estimatedResponse && (
              <div className="rounded-lg p-2.5 text-center"
                style={{ background: "var(--widget-bg)", border: "1px solid var(--widget-border)" }}>
                <div className="text-[10px] font-medium uppercase tracking-wider" style={{ color: "var(--widget-text-muted)" }}>
                  Estimated Response
                </div>
                <div className="text-[13px] font-bold mt-0.5" style={{ color: "var(--omnicare-primary, #6366f1)" }}>
                  {props.estimatedResponse}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    },

    ProductCard: ({ props }) => {
      const { sendMessage } = useOmniCare();
      return (
        <div className="rounded-xl overflow-hidden w-full"
          style={{ background: "var(--widget-surface-raised)", border: "1px solid var(--widget-border)" }}
        >
          <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--widget-border)" }}>
            <h4 className="text-[13px] font-semibold" style={{ color: "var(--widget-text-primary)" }}>{props.name}</h4>
          </div>
          <div className="p-3.5 space-y-3">
            <p className="text-[12px] leading-relaxed" style={{ color: "var(--widget-text-secondary)" }}>{props.description}</p>
            <div className="flex items-center gap-3">
              <span className="text-[18px] font-bold" style={{ color: "var(--omnicare-primary, #6366f1)" }}>{props.price}</span>
              {props.rating && (
                <span className="text-[11px] font-medium" style={{ color: "#fbbf24" }}>
                  {"\u2B50"} {props.rating}{props.reviewCount ? ` (${props.reviewCount})` : ""}
                </span>
              )}
              <span className="ml-auto text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full"
                style={props.inStock
                  ? { background: "rgba(52,211,153,0.1)", color: "#34d399", border: "1px solid rgba(52,211,153,0.2)" }
                  : { background: "rgba(248,113,113,0.1)", color: "#f87171", border: "1px solid rgba(248,113,113,0.2)" }
                }>
                {props.inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>
            {props.features && props.features.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {props.features.map((f, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 rounded-full"
                    style={{ background: "var(--widget-bg)", color: "var(--widget-text-secondary)", border: "1px solid var(--widget-border)" }}>
                    {f}
                  </span>
                ))}
              </div>
            )}
            {/* Interactive buttons */}
            <div className="flex gap-2 pt-1">
              {props.inStock && (
                <button
                  onClick={() => sendMessage?.(`I'd like to buy the ${props.name}`)}
                  className="flex-1 text-[11px] font-semibold py-2.5 rounded-lg transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: "var(--omnicare-primary, #6366f1)",
                    color: "#fff",
                    boxShadow: "0 0 12px var(--widget-accent-glow)",
                  }}
                >
                  Buy Now
                </button>
              )}
              <button
                onClick={() => sendMessage?.(`Tell me more about the ${props.name}`)}
                className="flex-1 text-[11px] font-semibold py-2.5 rounded-lg transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: "var(--widget-surface-hover)",
                  color: "var(--widget-text-secondary)",
                  border: "1px solid var(--widget-border)",
                }}
              >
                More Details
              </button>
            </div>
          </div>
        </div>
      );
    },

    PricingTable: ({ props }) => {
      const { sendMessage } = useOmniCare();
      return (
      <div className="rounded-xl overflow-hidden w-full"
        style={{ background: "var(--widget-surface-raised)", border: "1px solid var(--widget-border)" }}
      >
        <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--widget-border)" }}>
          <h4 className="text-[13px] font-semibold" style={{ color: "var(--widget-text-primary)" }}>Pricing Plans</h4>
        </div>
        <div className="p-3.5">
          <div className={`grid gap-2.5 ${props.plans.length === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
            {props.plans.map((plan, i) => (
              <div key={i} className="rounded-lg p-3 text-center"
                style={{
                  background: plan.highlighted ? "var(--omnicare-primary, #6366f1)10" : "var(--widget-bg)",
                  border: plan.highlighted
                    ? "1px solid var(--omnicare-primary, #6366f1)40"
                    : "1px solid var(--widget-border)",
                  boxShadow: plan.highlighted ? "0 0 20px var(--widget-accent-glow)" : "none",
                }}
              >
                <div className="text-[11px] font-bold uppercase tracking-wider mb-1.5"
                  style={{ color: plan.highlighted ? "var(--omnicare-primary, #6366f1)" : "var(--widget-text-secondary)" }}>
                  {plan.name}
                </div>
                <div className="text-[18px] font-bold mb-0.5" style={{ color: "var(--omnicare-primary, #6366f1)" }}>
                  {plan.price}
                </div>
                <div className="text-[10px] mb-2.5" style={{ color: "var(--widget-text-muted)" }}>/{plan.interval}</div>
                <div className="space-y-1.5 text-left mb-3">
                  {plan.features.slice(0, 4).map((f, j) => (
                    <div key={j} className="text-[10px] flex items-start gap-1.5"
                      style={{ color: "var(--widget-text-secondary)" }}>
                      <span style={{ color: "var(--widget-success)" }}>{"\u2713"}</span>
                      <span>{f}</span>
                    </div>
                  ))}
                  {plan.features.length > 4 && (
                    <div className="text-[10px]" style={{ color: "var(--widget-text-muted)" }}>
                      +{plan.features.length - 4} more
                    </div>
                  )}
                </div>
                <button
                  onClick={() => sendMessage?.(`I'm interested in the ${plan.name} plan at ${plan.price}/${plan.interval}`)}
                  className="w-full text-[10px] font-semibold py-2 rounded-lg transition-all duration-150 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  style={plan.highlighted
                    ? {
                        background: "var(--omnicare-primary, #6366f1)",
                        color: "#fff",
                        boxShadow: "0 0 12px var(--widget-accent-glow)",
                      }
                    : {
                        background: "var(--widget-surface-raised)",
                        color: "var(--widget-text-secondary)",
                        border: "1px solid var(--widget-border)",
                      }
                  }
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    ); },

    AppointmentPicker: ({ props }) => {
      const { sendMessage } = useOmniCare();
      return (
      <div className="rounded-xl overflow-hidden w-full"
        style={{ background: "var(--widget-surface-raised)", border: "1px solid var(--widget-border)" }}
      >
        <div className="px-4 py-3 flex items-center gap-2.5" style={{ borderBottom: "1px solid var(--widget-border)" }}>
          <span className="text-base">{"\uD83D\uDCC5"}</span>
          <h4 className="text-[13px] font-semibold" style={{ color: "var(--widget-text-primary)" }}>
            {props.title || "Available Times"}
          </h4>
        </div>
        <div className="p-3.5 grid grid-cols-2 gap-2">
          {props.slots.map((slot, i) => (
            <button key={i}
              onClick={() => sendMessage?.(`I'd like to book ${slot.date} at ${slot.time}${slot.service ? ` for ${slot.service}` : ""}`)}
              className="text-left rounded-lg p-2.5 transition-all duration-150 cursor-pointer"
              style={{ background: "var(--widget-bg)", border: "1px solid var(--widget-border)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--omnicare-primary, #6366f1)50";
                e.currentTarget.style.boxShadow = "0 0 12px var(--widget-accent-glow)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--widget-border)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div className="text-[12px] font-medium" style={{ color: "var(--widget-text-primary)" }}>{slot.date}</div>
              <div className="text-[11px]" style={{ color: "var(--widget-text-secondary)" }}>{slot.time}</div>
              {slot.service && <div className="text-[10px] mt-0.5" style={{ color: "var(--widget-text-muted)" }}>{slot.service}</div>}
            </button>
          ))}
        </div>
      </div>
    ); },

    ContactCard: ({ props }) => (
      <div className="rounded-xl overflow-hidden w-full"
        style={{ background: "var(--widget-surface-raised)", border: "1px solid var(--widget-border)" }}
      >
        <div className="px-4 py-3.5 flex items-center gap-3" style={{ borderBottom: "1px solid var(--widget-border)" }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-[13px]"
            style={{ background: "linear-gradient(135deg, var(--omnicare-primary, #6366f1), var(--omnicare-primary, #6366f1)aa)" }}>
            {props.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
          </div>
          <div>
            <h4 className="font-semibold text-[13px]" style={{ color: "var(--widget-text-primary)" }}>{props.name}</h4>
            {props.role && <p className="text-[10px]" style={{ color: "var(--widget-text-muted)" }}>{props.role}</p>}
          </div>
        </div>
        <div className="p-3.5 space-y-2">
          {props.phone && (
            <a href={`tel:${props.phone}`}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150"
              style={{ background: "var(--widget-bg)", border: "1px solid var(--widget-border)" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--omnicare-primary, #6366f1)40"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--widget-border)"; }}
            >
              <span className="text-sm">{"\uD83D\uDCDE"}</span>
              <div>
                <div className="text-[11px] font-semibold" style={{ color: "var(--widget-text-primary)" }}>Call</div>
                <div className="text-[11px]" style={{ color: "var(--widget-text-secondary)" }}>{props.phone}</div>
              </div>
            </a>
          )}
          <a href={`mailto:${props.email}`}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150"
            style={{ background: "var(--widget-bg)", border: "1px solid var(--widget-border)" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--omnicare-primary, #6366f1)40"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--widget-border)"; }}
          >
            <span className="text-sm">{"\u2709\uFE0F"}</span>
            <div>
              <div className="text-[11px] font-semibold" style={{ color: "var(--widget-text-primary)" }}>Email</div>
              <div className="text-[11px]" style={{ color: "var(--widget-text-secondary)" }}>{props.email}</div>
            </div>
          </a>
          {props.hours && <p className="text-[10px] text-center" style={{ color: "var(--widget-text-muted)" }}>{props.hours}</p>}
        </div>
      </div>
    ),

    FeedbackForm: ({ props }) => {
      const { onAction } = useOmniCare();
      const [rating, setRating] = useState<number | null>(null);
      const [submitted, setSubmitted] = useState(false);

      if (submitted) {
        return (
          <div className="rounded-xl p-5 text-center"
            style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)" }}>
            <span className="text-2xl">{"\uD83C\uDF89"}</span>
            <p className="text-[12px] font-semibold mt-1.5" style={{ color: "#34d399" }}>Thank you for your feedback!</p>
          </div>
        );
      }

      return (
        <div className="rounded-xl overflow-hidden w-full"
          style={{ background: "var(--widget-surface-raised)", border: "1px solid var(--widget-border)" }}>
          <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--widget-border)" }}>
            <h4 className="text-[13px] font-semibold" style={{ color: "var(--widget-text-primary)" }}>How did we do?</h4>
          </div>
          <div className="p-3.5 text-center space-y-3">
            <p className="text-[12px]" style={{ color: "var(--widget-text-secondary)" }}>{props.question}</p>
            <div className="flex justify-center gap-1.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n}
                  onClick={() => setRating(n)}
                  className="w-10 h-10 rounded-lg text-[13px] font-bold transition-all duration-150"
                  style={rating === n
                    ? {
                        background: "var(--omnicare-primary, #6366f1)",
                        color: "#fff",
                        boxShadow: "0 0 12px var(--widget-accent-glow)",
                      }
                    : {
                        background: "var(--widget-bg)",
                        color: "var(--widget-text-secondary)",
                        border: "1px solid var(--widget-border)",
                      }
                  }
                  onMouseEnter={(e) => {
                    if (rating !== n) e.currentTarget.style.borderColor = "var(--omnicare-primary, #6366f1)40";
                  }}
                  onMouseLeave={(e) => {
                    if (rating !== n) e.currentTarget.style.borderColor = "var(--widget-border)";
                  }}
                >
                  {n}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-[10px] px-1" style={{ color: "var(--widget-text-muted)" }}>
              <span>Not helpful</span>
              <span>Very helpful</span>
            </div>
            {rating && (
              <button onClick={() => { onAction?.("feedback", { rating, question: props.question }); setSubmitted(true); }}
                className="text-[12px] font-semibold text-white py-2.5 px-8 rounded-lg transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: "var(--omnicare-primary, #6366f1)",
                  boxShadow: "0 0 16px var(--widget-accent-glow)",
                }}>
                Submit
              </button>
            )}
          </div>
        </div>
      );
    },

    StatusBanner: ({ props }) => {
      const cfg: Record<string, { color: string; icon: string }> = {
        operational: { color: "#34d399", icon: "\u2705" },
        degraded: { color: "#fbbf24", icon: "\u26A0\uFE0F" },
        outage: { color: "#f87171", icon: "\uD83D\uDD34" },
      };
      const c = cfg[props.status] ?? cfg.operational;
      return (
        <div className="rounded-xl p-3.5 w-full"
          style={{ background: `${c.color}08`, border: `1px solid ${c.color}20` }}>
          <div className="flex items-center gap-2.5">
            <span className="text-sm">{c.icon}</span>
            <div className="flex-1">
              <div className="text-[12px] font-semibold" style={{ color: c.color }}>
                {props.service}: {props.status.charAt(0).toUpperCase() + props.status.slice(1)}
              </div>
              <p className="text-[12px] mt-0.5" style={{ color: "var(--widget-text-secondary)" }}>{props.message}</p>
              {props.updatedAt && (
                <p className="text-[10px] mt-0.5" style={{ color: "var(--widget-text-muted)" }}>Updated: {props.updatedAt}</p>
              )}
            </div>
          </div>
        </div>
      );
    },

    InvoiceSummary: ({ props }) => (
      <div className="rounded-xl overflow-hidden w-full"
        style={{ background: "var(--widget-surface-raised)", border: "1px solid var(--widget-border)" }}>
        <div className="px-4 py-3 flex items-center gap-2.5" style={{ borderBottom: "1px solid var(--widget-border)" }}>
          <span className="text-base">{"\uD83E\uDDFE"}</span>
          <h4 className="text-[13px] font-semibold" style={{ color: "var(--widget-text-primary)" }}>Invoice Summary</h4>
        </div>
        <div className="p-3.5">
          <table className="w-full text-[12px]">
            <tbody>
              {props.items.map((item, i) => (
                <tr key={i} style={{ borderBottom: "1px solid var(--widget-border)" }}>
                  <td className="py-2" style={{ color: "var(--widget-text-secondary)" }}>{item.name} x{item.quantity}</td>
                  <td className="py-2 text-right font-medium" style={{ color: "var(--widget-text-primary)" }}>{item.price}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ borderTop: "1px solid var(--widget-border)" }}>
                <td className="py-1.5" style={{ color: "var(--widget-text-muted)" }}>Subtotal</td>
                <td className="py-1.5 text-right font-medium" style={{ color: "var(--widget-text-primary)" }}>{props.subtotal}</td>
              </tr>
              {props.tax && (
                <tr>
                  <td className="py-1.5" style={{ color: "var(--widget-text-muted)" }}>Tax</td>
                  <td className="py-1.5 text-right font-medium" style={{ color: "var(--widget-text-primary)" }}>{props.tax}</td>
                </tr>
              )}
              <tr style={{ borderTop: "2px solid var(--widget-border-bright)" }}>
                <td className="py-2.5 font-bold" style={{ color: "var(--widget-text-primary)" }}>Total</td>
                <td className="py-2.5 text-right font-bold text-[14px]" style={{ color: "var(--omnicare-primary, #6366f1)" }}>
                  {props.total}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    ),

    CheckoutCard: ({ props }) => (
      <div className="rounded-xl overflow-hidden w-full"
        style={{ background: "var(--widget-surface-raised)", border: "1px solid var(--widget-border)" }}>
        <div className="px-4 py-3 flex items-center gap-2.5" style={{ borderBottom: "1px solid var(--widget-border)" }}>
          <span className="text-base">{"\uD83D\uDCB3"}</span>
          <h4 className="text-[13px] font-semibold" style={{ color: "var(--widget-text-primary)" }}>Checkout</h4>
          <span className="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: "rgba(52,211,153,0.1)", color: "#34d399", border: "1px solid rgba(52,211,153,0.2)" }}>
            Secure
          </span>
        </div>
        <div className="p-3.5 space-y-3">
          <div className="flex justify-between items-center text-[12px]">
            <span style={{ color: "var(--widget-text-secondary)" }}>
              {props.productName} {props.quantity > 1 ? `x${props.quantity}` : ""}
            </span>
            <span className="font-bold" style={{ color: "var(--widget-text-primary)" }}>{props.price}</span>
          </div>
          <div className="pt-1" style={{ borderTop: "1px solid var(--widget-border)" }}>
            <div className="flex justify-between items-center text-[13px] font-bold">
              <span style={{ color: "var(--widget-text-primary)" }}>Total</span>
              <span style={{ color: "var(--omnicare-primary, #6366f1)" }}>{props.price}</span>
            </div>
          </div>
          <a
            href={props.checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full text-[12px] font-semibold py-3 rounded-lg transition-all duration-150 hover:scale-[1.01] active:scale-[0.99] cursor-pointer no-underline"
            style={{
              background: "linear-gradient(135deg, #635bff, #7c3aed)",
              color: "#fff",
              boxShadow: "0 0 20px rgba(99,91,255,0.3)",
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
              <line x1="1" y1="10" x2="23" y2="10" />
            </svg>
            Pay {props.price} with Stripe
          </a>
          {props.expiresIn && (
            <p className="text-[10px] text-center" style={{ color: "var(--widget-text-muted)" }}>
              Link expires in {props.expiresIn}
            </p>
          )}
        </div>
      </div>
    ),

    QuickContactForm: ({ props }) => {
      const { onLeadCapture, sendMessage } = useOmniCare();
      const [form, setForm] = useState({ name: "", email: "", message: "" });
      const [submitted, setSubmitted] = useState(false);

      if (submitted) {
        return (
          <div className="rounded-xl p-5 text-center"
            style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)" }}>
            <span className="text-2xl">{"\u2705"}</span>
            <p className="text-[13px] font-semibold mt-1.5" style={{ color: "#34d399" }}>Message sent!</p>
            <p className="text-[11px] mt-1" style={{ color: "var(--widget-text-muted)" }}>We'll get back to you shortly.</p>
          </div>
        );
      }

      return (
        <div className="rounded-xl overflow-hidden w-full"
          style={{ background: "var(--widget-surface-raised)", border: "1px solid var(--widget-border)" }}>
          <div className="px-4 py-3 flex items-center gap-2.5" style={{ borderBottom: "1px solid var(--widget-border)" }}>
            <span className="text-base">{"\u2709\uFE0F"}</span>
            <h4 className="text-[13px] font-semibold" style={{ color: "var(--widget-text-primary)" }}>
              {props.title || "Send us a message"}
            </h4>
          </div>
          <form className="p-3.5 space-y-2.5" onSubmit={(e) => {
            e.preventDefault();
            if (!form.name || !form.email) return;
            onLeadCapture?.({ name: form.name, email: form.email, message: form.message, source: "contact_form" });
            sendMessage?.(`[Contact form submitted] Name: ${form.name}, Email: ${form.email}, Message: ${form.message}`);
            setSubmitted(true);
          }}>
            <input
              type="text"
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full text-[12px] px-3.5 py-2.5 rounded-lg bg-transparent outline-none transition-all duration-150"
              style={{
                color: "var(--widget-text-primary)",
                background: "var(--widget-bg)",
                border: "1px solid var(--widget-border)",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "var(--omnicare-primary, #6366f1)50"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "var(--widget-border)"; }}
            />
            <input
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="w-full text-[12px] px-3.5 py-2.5 rounded-lg bg-transparent outline-none transition-all duration-150"
              style={{
                color: "var(--widget-text-primary)",
                background: "var(--widget-bg)",
                border: "1px solid var(--widget-border)",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "var(--omnicare-primary, #6366f1)50"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "var(--widget-border)"; }}
            />
            <textarea
              placeholder={props.placeholder || "How can we help?"}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={3}
              className="w-full text-[12px] px-3.5 py-2.5 rounded-lg bg-transparent outline-none resize-none transition-all duration-150"
              style={{
                color: "var(--widget-text-primary)",
                background: "var(--widget-bg)",
                border: "1px solid var(--widget-border)",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "var(--omnicare-primary, #6366f1)50"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "var(--widget-border)"; }}
            />
            <button
              type="submit"
              className="w-full text-[12px] font-semibold py-2.5 rounded-lg transition-all duration-150 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              style={{
                background: "var(--omnicare-primary, #6366f1)",
                color: "#fff",
                boxShadow: "0 0 12px var(--widget-accent-glow)",
              }}
            >
              Send Message
            </button>
          </form>
        </div>
      );
    },

    ActionButtons: ({ props }) => {
      const { sendMessage } = useOmniCare();
      return (
        <div className="flex flex-wrap gap-2">
          {props.actions.map((action, i) => {
            const variant = action.variant ?? "secondary";
            const btnStyle = variant === "primary"
              ? {
                  background: "var(--omnicare-primary, #6366f1)",
                  color: "#fff",
                  boxShadow: "0 0 12px var(--widget-accent-glow)",
                }
              : variant === "danger"
                ? {
                    background: "rgba(248,113,113,0.1)",
                    color: "#f87171",
                    border: "1px solid rgba(248,113,113,0.2)",
                  }
                : {
                    background: "var(--widget-surface-raised)",
                    color: "var(--widget-text-secondary)",
                    border: "1px solid var(--widget-border)",
                  };
            return (
              <button key={i}
                onClick={() => {
                  if (action.url) {
                    window.open(action.url, "_blank", "noopener,noreferrer");
                  } else {
                    sendMessage?.(action.action || action.label);
                  }
                }}
                className="text-[12px] font-semibold py-2 px-4 rounded-lg transition-all duration-150 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                style={btnStyle}>
                {action.label}
              </button>
            );
          })}
        </div>
      );
    },
  },
  actions: {},
});

export function Fallback({ type }: { type: string }) {
  return (
    <div className="p-2 rounded-lg text-[11px]"
      style={{ border: "1px dashed var(--widget-border)", color: "var(--widget-text-muted)" }}>
      Component: {type}
    </div>
  );
}
