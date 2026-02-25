# OmniCare AI

AI-native customer care chatbot with generative UI. Everything happens inside the chat — payments, contact forms, order tracking, appointment booking, pricing plans.

## Stack

- **Next.js 16** + React 19
- **Vercel AI SDK 6** (ToolLoopAgent)
- **Google Gemini 2.5 Flash**
- **json-render** (generative UI)
- **Tailwind v4** + dark glass theme
- **Turborepo** + pnpm monorepo

## Setup

```bash
pnpm install
```

Create `apps/widget/.env.local`:

```
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_key
```

```bash
pnpm dev --filter widget
```

Open [http://localhost:3001/chat/demo](http://localhost:3001/chat/demo)

## Demo Scenarios

| Try asking | What happens |
|-----------|-------------|
| "What headphones do you have?" | ProductCard with Buy Now button |
| Click **Buy Now** | Stripe checkout link generated in chat |
| "Where's my order ORD-7291?" | OrderTracker with timeline + tracking link |
| "Show me your pricing plans" | 3-column PricingTable with interactive CTAs |
| "I want to talk to someone" | QuickContactForm embedded in chat |
| "I need to return something" | Knowledge base search + Accordion UI |

Test emails: `sarah@example.com`, `mike@example.com`
Test orders: `ORD-7291`, `ORD-7145`, `ORD-7302`

## Architecture

```
omnicare/
├── apps/widget/          # Chat widget (Next.js 16)
├── packages/care-engine/  # AI agent (prompt, tools, mock data)
├── packages/care-ui/      # json-render catalog + registry + ChatPanel
└── packages/shared/       # Types
```
