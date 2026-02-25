import { defineCatalog } from "@json-render/core";
import { schema } from "@json-render/react/schema";
import { z } from "zod";

/**
 * OmniCare Customer Care Catalog
 *
 * Universal components for any business vertical.
 * The AI generates JSON specs using these to render rich, interactive UI.
 */
export const careCatalog = defineCatalog(schema, {
  components: {
    // =====================================================================
    // Layout Primitives
    // =====================================================================
    Stack: {
      props: z.object({
        direction: z.enum(["horizontal", "vertical"]).nullable(),
        gap: z.enum(["sm", "md", "lg"]).nullable(),
      }),
      slots: ["default"],
      description: "Flex layout container",
      example: { direction: "vertical", gap: "md" },
    },
    Card: {
      props: z.object({
        title: z.string().nullable(),
        subtitle: z.string().nullable(),
        icon: z.string().nullable(),
      }),
      slots: ["default"],
      description: "Card container with optional title header and icon emoji",
      example: { title: "Order Status", subtitle: "ORD-7291", icon: "📦" },
    },
    Grid: {
      props: z.object({
        columns: z.enum(["2", "3", "4"]).nullable(),
        gap: z.enum(["sm", "md", "lg"]).nullable(),
      }),
      slots: ["default"],
      description: "Responsive grid layout",
      example: { columns: "3", gap: "md" },
    },
    Heading: {
      props: z.object({
        text: z.string(),
        level: z.enum(["h2", "h3", "h4"]).nullable(),
      }),
      description: "Section heading",
    },
    Text: {
      props: z.object({
        content: z.string(),
        muted: z.boolean().nullable(),
      }),
      description: "Body text content",
    },
    Separator: {
      props: z.object({}),
      description: "Visual divider line",
    },

    // =====================================================================
    // Data Display
    // =====================================================================
    Metric: {
      props: z.object({
        label: z.string(),
        value: z.string(),
        detail: z.string().nullable(),
        trend: z.enum(["up", "down", "neutral"]).nullable(),
        icon: z.string().nullable(),
      }),
      description: "KPI metric with label, value, optional trend and icon emoji",
      example: { label: "Total", value: "$329.97", detail: "2 items", icon: "💰" },
    },
    Badge: {
      props: z.object({
        text: z.string(),
        variant: z.enum(["default", "success", "warning", "danger", "info"]).nullable(),
      }),
      description: "Status badge label",
      example: { text: "Shipped", variant: "success" },
    },
    Table: {
      props: z.object({
        data: z.array(z.record(z.string(), z.unknown())),
        columns: z.array(z.object({ key: z.string(), label: z.string() })),
      }),
      description: "Data table for comparisons and listings",
    },
    Timeline: {
      props: z.object({
        items: z.array(
          z.object({
            title: z.string(),
            description: z.string().nullable(),
            status: z.enum(["completed", "current", "upcoming"]).nullable(),
          })
        ),
      }),
      description: "Vertical timeline for order tracking or multi-step processes",
    },
    Progress: {
      props: z.object({
        label: z.string(),
        value: z.number(),
        max: z.number().nullable(),
      }),
      description: "Progress or score bar",
    },
    Callout: {
      props: z.object({
        type: z.enum(["info", "tip", "warning", "important"]).nullable(),
        title: z.string().nullable(),
        content: z.string(),
      }),
      description: "Highlighted callout box for important information",
    },
    Accordion: {
      props: z.object({
        items: z.array(z.object({ title: z.string(), content: z.string() })),
      }),
      description: "Collapsible FAQ or detail sections",
    },
    Link: {
      props: z.object({
        text: z.string(),
        href: z.string(),
      }),
      description: "Clickable link",
    },

    // =====================================================================
    // Customer Care Interactive Components
    // =====================================================================
    OrderTracker: {
      props: z.object({
        orderId: z.string(),
        status: z.string(),
        total: z.string(),
        estimatedDelivery: z.string().nullable(),
        trackingNumber: z.string().nullable(),
        items: z.array(z.object({ name: z.string(), quantity: z.number(), price: z.string() })),
        steps: z.array(
          z.object({
            title: z.string(),
            description: z.string().nullable(),
            status: z.enum(["completed", "current", "upcoming"]),
          })
        ),
      }),
      description:
        "Rich order tracking card with item list, status timeline, and delivery estimate. Use for 'where is my order' queries.",
      example: {
        orderId: "ORD-7291",
        status: "Shipped",
        total: "$329.97",
        estimatedDelivery: "Feb 26",
        trackingNumber: "1Z999AA1",
        items: [{ name: "Headphones", quantity: 1, price: "$299.99" }],
        steps: [
          { title: "Ordered", description: "Feb 20", status: "completed" },
          { title: "Shipped", description: "Feb 22", status: "current" },
          { title: "Delivered", description: null, status: "upcoming" },
        ],
      },
    },

    TicketCard: {
      props: z.object({
        ticketId: z.string(),
        subject: z.string(),
        status: z.string(),
        priority: z.string(),
        estimatedResponse: z.string().nullable(),
        createdAt: z.string().nullable(),
      }),
      description:
        "Support ticket confirmation card. Use after creating a ticket via createTicket tool.",
      example: {
        ticketId: "TKT-4401",
        subject: "Return request",
        status: "Open",
        priority: "Medium",
        estimatedResponse: "24 hours",
      },
    },

    ProductCard: {
      props: z.object({
        name: z.string(),
        description: z.string(),
        price: z.string(),
        rating: z.string().nullable(),
        reviewCount: z.string().nullable(),
        inStock: z.boolean(),
        features: z.array(z.string()).nullable(),
      }),
      description: "Product display card with price, rating, and features. Use for product inquiries.",
    },

    PricingTable: {
      props: z.object({
        plans: z.array(
          z.object({
            name: z.string(),
            price: z.string(),
            interval: z.string(),
            features: z.array(z.string()),
            highlighted: z.boolean().nullable(),
            cta: z.string(),
          })
        ),
      }),
      description: "Pricing plan comparison table. Use when customer asks about pricing or plans.",
    },

    AppointmentPicker: {
      props: z.object({
        slots: z.array(
          z.object({
            date: z.string(),
            time: z.string(),
            service: z.string().nullable(),
          })
        ),
        title: z.string().nullable(),
      }),
      description: "Available appointment slots display. Use after checkAvailability tool.",
    },

    ContactCard: {
      props: z.object({
        name: z.string(),
        role: z.string().nullable(),
        email: z.string(),
        phone: z.string().nullable(),
        hours: z.string().nullable(),
      }),
      description: "Business contact information card with action buttons.",
    },

    FeedbackForm: {
      props: z.object({
        question: z.string(),
      }),
      description: "Customer satisfaction rating form. Use at end of resolved conversations.",
    },

    StatusBanner: {
      props: z.object({
        service: z.string(),
        status: z.enum(["operational", "degraded", "outage"]),
        message: z.string(),
        updatedAt: z.string().nullable(),
      }),
      description: "System or service status banner. Use when customer reports system issues.",
    },

    InvoiceSummary: {
      props: z.object({
        items: z.array(z.object({ name: z.string(), quantity: z.number(), price: z.string() })),
        subtotal: z.string(),
        tax: z.string().nullable(),
        total: z.string(),
        currency: z.string().nullable(),
      }),
      description: "Invoice or billing summary with line items and totals.",
    },

    ActionButtons: {
      props: z.object({
        actions: z.array(
          z.object({
            label: z.string(),
            action: z.string().nullable(),
            url: z.string().nullable(),
            variant: z.enum(["primary", "secondary", "danger"]).nullable(),
          })
        ),
      }),
      description: "Row of clickable action buttons. Use 'action' for chat message text, 'url' for external links. Buttons send messages to the chat or open URLs.",
      example: {
        actions: [
          { label: "Start Return", action: "I want to start a return", variant: "primary" },
          { label: "Track Package", url: "https://track.example.com/123", variant: "secondary" },
        ],
      },
    },

    CheckoutCard: {
      props: z.object({
        productName: z.string(),
        price: z.string(),
        quantity: z.number(),
        checkoutUrl: z.string(),
        expiresIn: z.string().nullable(),
      }),
      description: "Stripe payment checkout card with product summary and a pay button that opens the checkout URL. Use after createCheckout tool returns a checkout session.",
      example: {
        productName: "Wireless Headphones",
        price: "$299.99",
        quantity: 1,
        checkoutUrl: "https://checkout.stripe.com/c/pay/cs_live_xxx",
        expiresIn: "30 minutes",
      },
    },

    QuickContactForm: {
      props: z.object({
        title: z.string().nullable(),
        placeholder: z.string().nullable(),
      }),
      description: "Interactive contact form that captures name, email, and message. Use when customer wants to leave contact info, schedule a callback, or send a detailed request. The form submits data and confirms.",
      example: { title: "Request a Callback", placeholder: "Describe your issue..." },
    },
  },
  actions: {},
});
