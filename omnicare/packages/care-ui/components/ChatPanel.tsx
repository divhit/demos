"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import type { UIMessage } from "ai";
import { SPEC_DATA_PART_TYPE } from "@json-render/core";
import { useJsonRenderMessage } from "@json-render/react";
import { ChatRenderer } from "../render/renderer";
import type { Tenant, LeadCaptureData } from "@omnicare/shared";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ChatPanelProps = {
  tenant: Tenant;
  apiEndpoint: string;
  firstMessage?: string;
  quickQuestions?: string[];
  onLeadCapture?: (data: LeadCaptureData) => void;
  className?: string;
};

// ---------------------------------------------------------------------------
// localStorage persistence
// ---------------------------------------------------------------------------

function storageKey(slug: string) {
  return `omnicare-chat-${slug}`;
}

function loadMessages(key: string): UIMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveMessages(key: string, messages: UIMessage[]) {
  try {
    const slim = messages.map((m) => ({
      ...m,
      parts: m.parts.filter(
        (p) => p.type === "text" || (p.type.startsWith("tool-") && "input" in p)
      ),
    }));
    localStorage.setItem(key, JSON.stringify(slim));
  } catch {
    // Storage full
  }
}

// ---------------------------------------------------------------------------
// Simple inline markdown (bold, italic, code)
// ---------------------------------------------------------------------------

function renderSimpleMarkdown(text: string) {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*(.+?)\*\*)|(\*(.+?)\*)|(`(.+?)`)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[1]) {
      parts.push(<strong key={match.index} className="font-semibold">{match[2]}</strong>);
    } else if (match[3]) {
      parts.push(<em key={match.index}>{match[4]}</em>);
    } else if (match[5]) {
      parts.push(
        <code key={match.index} className="text-[12px] px-1.5 py-0.5 rounded" style={{ background: "var(--widget-surface-raised)", color: "var(--widget-accent)" }}>
          {match[6]}
        </code>
      );
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts.length > 0 ? parts : text;
}

// ---------------------------------------------------------------------------
// Icons (inline SVGs for zero deps)
// ---------------------------------------------------------------------------

function SparkleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M12 2L13.09 8.26L18 6L14.74 10.91L21 12L14.74 13.09L18 18L13.09 15.74L12 22L10.91 15.74L6 18L9.26 13.09L3 12L9.26 10.91L6 6L10.91 8.26L12 2Z"
        fill="currentColor" opacity="0.9"/>
    </svg>
  );
}

function SendIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
    </svg>
  );
}

function PlusIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" d="M12 4v16m8-8H4" />
    </svg>
  );
}

function StopIcon({ className = "w-3 h-3" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <rect x="6" y="6" width="12" height="12" rx="2" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// AssistantMessage
// ---------------------------------------------------------------------------

function AssistantMessage({
  message,
  tenant,
  onLeadCapture,
  sendMessage,
}: {
  message: UIMessage;
  tenant: Tenant;
  onLeadCapture?: (data: LeadCaptureData) => void;
  sendMessage?: (text: string) => void;
}) {
  const { spec, hasSpec } = useJsonRenderMessage(message.parts);

  const textParts: { part: UIMessage["parts"][number]; index: number }[] = [];

  message.parts.forEach((part, i) => {
    if (part.type === "text" && part.text) {
      textParts.push({ part, index: i });
    }
  });

  return (
    <div className="flex gap-2.5 animate-msg-in">
      {/* AI avatar */}
      <div className="shrink-0 mt-0.5">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${tenant.primaryColor}, ${tenant.primaryColor}99)`,
            boxShadow: `0 0 12px ${tenant.primaryColor}30`,
          }}
        >
          <SparkleIcon className="w-3.5 h-3.5 text-white" />
        </div>
      </div>
      <div className="flex-1 min-w-0 space-y-2">
        {/* Spec visual first */}
        {hasSpec && (
          <div className="animate-spec-in">
            <ChatRenderer
              spec={spec}
              tenant={tenant}
              onLeadCapture={onLeadCapture}
              sendMessage={sendMessage}
            />
          </div>
        )}
        {/* Text after */}
        {textParts.map(({ part, index }) => (
          <div
            key={index}
            className="text-[13px] leading-[1.6] text-[var(--widget-text-primary)]"
            style={{ letterSpacing: "-0.01em" }}
          >
            {renderSimpleMarkdown((part as { text: string }).text)}
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Thinking indicator
// ---------------------------------------------------------------------------

function ThinkingIndicator({ tenant }: { tenant: Tenant }) {
  return (
    <div className="flex gap-2.5 animate-msg-in">
      <div className="shrink-0 mt-0.5">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${tenant.primaryColor}, ${tenant.primaryColor}99)`,
            boxShadow: `0 0 12px ${tenant.primaryColor}30`,
          }}
        >
          <SparkleIcon className="w-3.5 h-3.5 text-white" />
        </div>
      </div>
      <div className="flex items-center gap-1.5 py-2">
        <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ backgroundColor: tenant.primaryColor }} />
        <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ backgroundColor: tenant.primaryColor }} />
        <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ backgroundColor: tenant.primaryColor }} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ChatPanel
// ---------------------------------------------------------------------------

export function ChatPanel({
  tenant,
  apiEndpoint,
  firstMessage = "Hi! How can I help you today?",
  quickQuestions = [
    "Where's my order?",
    "I need to return something",
    "Show me your plans",
    "I'd like to speak to someone",
  ],
  onLeadCapture,
  className = "",
}: ChatPanelProps) {
  const key = storageKey(tenant.slug);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { messages, sendMessage, status, stop } = useChat({
    id: key,
    transport: new DefaultChatTransport({ api: apiEndpoint }),
    messages: loadMessages(key),
  });

  const hasMessages = messages.length > 0;
  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (messages.length > 0) saveMessages(key, messages);
  }, [messages, key]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, status]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div
      className={`relative flex flex-col overflow-hidden h-full rounded-2xl ${className}`}
      style={{
        "--omnicare-primary": tenant.primaryColor,
        "--omnicare-primary-light": `${tenant.primaryColor}15`,
        background: "var(--widget-surface)",
        border: "1px solid var(--widget-border)",
        boxShadow: `
          0 0 0 1px rgba(255,255,255,0.03),
          0 2px 8px rgba(0,0,0,0.3),
          0 12px 40px rgba(0,0,0,0.4),
          0 0 80px ${tenant.primaryColor}08
        `,
      } as React.CSSProperties}
    >
      {/* Noise overlay on widget */}
      <div className="absolute inset-0 noise pointer-events-none rounded-2xl" style={{ opacity: 0.3 }} />

      {/* ─── Header ─── */}
      <div className="relative shrink-0 px-5 py-4"
        style={{
          borderBottom: "1px solid var(--widget-border)",
        }}
      >
        {/* Accent glow behind header */}
        <div className="absolute inset-x-0 -bottom-px h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${tenant.primaryColor}40, transparent)`,
          }}
        />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="relative w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${tenant.primaryColor}, ${tenant.primaryColor}aa)`,
                boxShadow: `0 0 20px ${tenant.primaryColor}25`,
              }}
            >
              <SparkleIcon className="w-4.5 h-4.5 text-white" />
              {/* Online dot */}
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2"
                style={{
                  borderColor: "var(--widget-surface)",
                  backgroundColor: isLoading ? tenant.primaryColor : "var(--widget-success)",
                }}
              />
            </div>
            <div>
              <h1 className="text-[14px] font-semibold tracking-tight" style={{ color: "var(--widget-text-primary)" }}>
                {tenant.name}
              </h1>
              <p className="text-[11px] font-medium" style={{ color: isLoading ? tenant.primaryColor : "var(--widget-text-muted)" }}>
                {isLoading ? "Thinking..." : "AI assistant"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {isLoading && (
              <button
                onClick={stop}
                className="flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1.5 rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  color: "var(--widget-text-secondary)",
                  background: "var(--widget-surface-raised)",
                  border: "1px solid var(--widget-border-bright)",
                }}
              >
                <StopIcon />
                Stop
              </button>
            )}
            {hasMessages && !isLoading && (
              <button
                onClick={() => { localStorage.removeItem(key); window.location.reload(); }}
                className="flex items-center gap-1 text-[11px] font-medium px-2.5 py-1.5 rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  color: "var(--widget-text-secondary)",
                  background: "var(--widget-surface-raised)",
                  border: "1px solid var(--widget-border-bright)",
                }}
                title="New conversation"
              >
                <PlusIcon />
                New
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ─── Messages ─── */}
      <div ref={scrollRef} className="relative flex-1 overflow-y-auto custom-scrollbar px-5 py-4 space-y-5">
        {/* Empty state */}
        {messages.length === 0 && (
          <div className="flex flex-col h-full justify-between py-2">
            <div className="flex-1 flex flex-col items-center justify-center">
              {/* Glowing orb */}
              <div className="relative mb-6">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${tenant.primaryColor}20, ${tenant.primaryColor}08)`,
                    border: `1px solid ${tenant.primaryColor}20`,
                    boxShadow: `0 0 40px ${tenant.primaryColor}15`,
                  }}
                >
                  <SparkleIcon className="w-7 h-7" style={{ color: tenant.primaryColor }} />
                </div>
                {/* Pulse ring */}
                <div
                  className="absolute inset-0 rounded-2xl animate-ping"
                  style={{
                    background: `${tenant.primaryColor}08`,
                    animationDuration: "3s",
                  }}
                />
              </div>
              <p className="text-[13px] leading-[1.6] text-center max-w-[280px] mb-1"
                style={{ color: "var(--widget-text-secondary)" }}>
                {firstMessage}
              </p>
            </div>

            {/* Quick questions */}
            <div className="grid grid-cols-2 gap-2 mt-6">
              {quickQuestions.map((q, i) => (
                <button
                  key={q}
                  onClick={() => sendMessage({ text: q })}
                  className="group text-left text-[12px] leading-snug px-3.5 py-3 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    color: "var(--widget-text-secondary)",
                    background: "var(--widget-surface-raised)",
                    border: "1px solid var(--widget-border)",
                    animationDelay: `${i * 0.05}s`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = `${tenant.primaryColor}40`;
                    e.currentTarget.style.color = "var(--widget-text-primary)";
                    e.currentTarget.style.boxShadow = `0 0 20px ${tenant.primaryColor}10`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--widget-border)";
                    e.currentTarget.style.color = "var(--widget-text-secondary)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message thread */}
        {messages.map((message) => (
          <div key={message.id}>
            {message.role === "user" ? (
              <div className="flex justify-end animate-msg-in">
                <div
                  className="max-w-[80%] px-4 py-2.5 rounded-2xl rounded-br-md text-[13px] leading-[1.6] font-medium"
                  style={{
                    background: `linear-gradient(135deg, ${tenant.primaryColor}, ${tenant.primaryColor}dd)`,
                    color: "#fff",
                    boxShadow: `0 2px 12px ${tenant.primaryColor}30`,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {message.parts
                    .filter((p) => p.type === "text")
                    .map((p, i) => p.type === "text" ? <span key={i}>{p.text}</span> : null)}
                </div>
              </div>
            ) : (
              <AssistantMessage
                message={message}
                tenant={tenant}
                onLeadCapture={onLeadCapture}
                sendMessage={(text) => sendMessage({ text })}
              />
            )}
          </div>
        ))}

        {/* Loading */}
        {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
          <ThinkingIndicator tenant={tenant} />
        )}
      </div>

      {/* ─── Input ─── */}
      <div className="relative shrink-0 px-4 pb-4 pt-2">
        {/* Top fade */}
        <div className="absolute inset-x-0 -top-6 h-6 pointer-events-none"
          style={{ background: `linear-gradient(to top, var(--widget-surface), transparent)` }}
        />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!input.trim() || isLoading) return;
            sendMessage({ text: input });
            setInput("");
          }}
          className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200"
          style={{
            background: "var(--widget-surface-raised)",
            border: "1px solid var(--widget-border-bright)",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = `${tenant.primaryColor}50`;
            e.currentTarget.style.boxShadow = `0 0 0 3px ${tenant.primaryColor}12, 0 0 20px ${tenant.primaryColor}08`;
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "var(--widget-border-bright)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message..."
            className="flex-1 bg-transparent text-[13px] placeholder:text-[var(--widget-text-muted)] outline-none"
            style={{
              color: "var(--widget-text-primary)",
              letterSpacing: "-0.01em",
            }}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-[1.05] active:scale-[0.95]"
            style={{
              background: input.trim()
                ? `linear-gradient(135deg, ${tenant.primaryColor}, ${tenant.primaryColor}cc)`
                : "var(--widget-surface-hover)",
              color: input.trim() ? "#fff" : "var(--widget-text-muted)",
              boxShadow: input.trim() ? `0 0 16px ${tenant.primaryColor}30` : "none",
            }}
          >
            <SendIcon className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Powered by line */}
        <p className="text-center text-[10px] mt-2.5 font-medium tracking-wide"
          style={{ color: "var(--widget-text-muted)" }}>
          Powered by <span style={{ color: tenant.primaryColor }}>OmniCare AI</span>
        </p>
      </div>
    </div>
  );
}
