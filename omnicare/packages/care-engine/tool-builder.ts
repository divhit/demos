import { tool } from "ai";
import { z } from "zod";
import {
  findOrderById,
  findOrdersByEmail,
  searchProducts,
  searchFAQs,
  getAvailableSlots,
  findAccountByEmail,
  MOCK_PRICING_PLANS,
  MOCK_PRODUCTS,
} from "./mock-data";

/**
 * Build the care tool set.
 * All execute functions include defensive null checks since Gemini
 * sometimes sends empty params despite required schemas.
 */
export function buildCareTools() {
  return {
    lookupOrder: tool({
      description:
        "Look up order status and details by order ID or customer email. ALWAYS pass the order ID or email from the user message.",
      parameters: z.object({
        orderId: z.string().describe("Order ID (e.g. ORD-7291) or customer email. REQUIRED."),
      }),
      execute: async (params: Record<string, unknown>) => {
        const orderId = (params.orderId ?? "") as string;
        if (!orderId) return { found: false, message: "No order ID or email provided. Please ask the customer for their order ID." };
        const trimmed = orderId.trim();
        if (trimmed.includes("@")) {
          const orders = findOrdersByEmail(trimmed);
          if (orders.length === 0) return { found: false, message: `No orders found for ${trimmed}` };
          return { found: true, orders, count: orders.length };
        }
        const order = findOrderById(trimmed);
        if (!order) return { found: false, message: `No order found with ID ${trimmed}` };
        return { found: true, order };
      },
    }),

    searchKnowledgeBase: tool({
      description:
        "Search the company knowledge base for policies, FAQs, and product information. Use when customer asks about returns, shipping, warranties, payment, or any company policy.",
      parameters: z.object({
        query: z.string().describe("Search query — use natural language keywords"),
      }),
      execute: async (params: Record<string, unknown>) => {
        const query = (params.query ?? "help") as string;
        const results = searchFAQs(query);
        if (results.length === 0) {
          return { found: false, message: "No matching articles found", query };
        }
        return { found: true, results: results.slice(0, 5), totalResults: results.length };
      },
    }),

    getProductInfo: tool({
      description:
        "Search for products by name, category, or description. Returns matching product details. If user asks generally about products, pass a broad keyword like 'all'.",
      parameters: z.object({
        query: z.string().describe("Product name, category, or 'all' to list everything"),
      }),
      execute: async (params: Record<string, unknown>) => {
        const query = (params.query ?? "") as string;
        // If empty or generic, return all products
        if (!query || query === "all" || query === "products") {
          return { found: true, products: MOCK_PRODUCTS.slice(0, 4), totalResults: MOCK_PRODUCTS.length };
        }
        const products = searchProducts(query);
        if (products.length === 0) {
          return { found: false, message: `No products found matching "${query}"`, allProducts: MOCK_PRODUCTS.map(p => p.name) };
        }
        return { found: true, products: products.slice(0, 4), totalResults: products.length };
      },
    }),

    createTicket: tool({
      description:
        "Create a support ticket for issues that need human follow-up.",
      parameters: z.object({
        subject: z.string().describe("Brief ticket subject"),
        description: z.string().describe("Detailed description of the issue"),
        priority: z.enum(["low", "medium", "high", "urgent"]).describe("Ticket priority"),
        category: z.string().describe("Category: Product Issue, Billing, Shipping, Account, Other"),
      }),
      execute: async (params: Record<string, unknown>) => {
        const subject = (params.subject ?? "Support Request") as string;
        const description = (params.description ?? "") as string;
        const priority = (params.priority ?? "medium") as string;
        const category = (params.category ?? "Other") as string;
        const ticketId = `TKT-${4400 + Math.floor(Math.random() * 100)}`;
        return {
          created: true,
          ticket: {
            id: ticketId,
            subject,
            description,
            status: "open",
            priority,
            category,
            createdAt: new Date().toISOString(),
            estimatedResponse: priority === "urgent" ? "1 hour" : priority === "high" ? "4 hours" : "24 hours",
          },
        };
      },
    }),

    checkAvailability: tool({
      description:
        "Check available appointment slots for demos, consultations, or support sessions.",
      parameters: z.object({
        service: z.string().optional().describe("Service type: Product Demo, Consultation, Technical Support"),
      }),
      execute: async (params: Record<string, unknown>) => {
        const service = (params.service ?? undefined) as string | undefined;
        const slots = getAvailableSlots(service);
        return {
          available: slots.length > 0,
          slots: slots.slice(0, 6),
          totalSlots: slots.length,
          service: service || "Any",
        };
      },
    }),

    getAccountInfo: tool({
      description:
        "Look up customer account details. Requires email address.",
      parameters: z.object({
        email: z.string().describe("Customer email address"),
      }),
      execute: async (params: Record<string, unknown>) => {
        const email = (params.email ?? "") as string;
        if (!email) return { found: false, message: "Please provide a customer email address" };
        const account = findAccountByEmail(email);
        if (!account) return { found: false, message: `No account found for ${email}` };
        return { found: true, account };
      },
    }),

    getPricingPlans: tool({
      description:
        "Get all available pricing plans and features. No parameters needed.",
      parameters: z.object({}),
      execute: async () => {
        return { plans: MOCK_PRICING_PLANS };
      },
    }),

    createCheckout: tool({
      description:
        "Create a payment checkout link for a product purchase. Use when a customer wants to buy a product. Returns a Stripe checkout URL that the customer can use to complete payment directly.",
      parameters: z.object({
        productName: z.string().describe("Name of the product to purchase"),
        price: z.string().describe("Price as displayed (e.g. '$299.99')"),
        quantity: z.number().describe("Quantity to purchase").optional(),
      }),
      execute: async (params: Record<string, unknown>) => {
        const productName = (params.productName ?? "Product") as string;
        const price = (params.price ?? "$0") as string;
        const quantity = (params.quantity ?? 1) as number;
        // Mock Stripe checkout session
        const sessionId = `cs_live_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
        return {
          created: true,
          checkout: {
            sessionId,
            url: `https://checkout.stripe.com/c/pay/${sessionId}`,
            productName,
            price,
            quantity,
            expiresIn: "30 minutes",
          },
        };
      },
    }),

    requestHumanHandoff: tool({
      description:
        "Escalate to a human agent. Use when customer explicitly requests a human or is clearly frustrated.",
      parameters: z.object({
        reason: z.string().describe("Why the customer needs a human agent"),
        conversationSummary: z.string().describe("Brief summary of the conversation"),
        customerSentiment: z.enum(["positive", "neutral", "negative", "frustrated"]),
      }),
      execute: async (params: Record<string, unknown>) => {
        const reason = (params.reason ?? "Customer requested human agent") as string;
        const conversationSummary = (params.conversationSummary ?? "") as string;
        const customerSentiment = (params.customerSentiment ?? "neutral") as string;
        return {
          escalated: true,
          message: "A human agent has been notified and will join shortly.",
          estimatedWait: customerSentiment === "frustrated" ? "Under 2 minutes" : "Under 5 minutes",
          referenceId: `ESC-${Date.now().toString(36).toUpperCase()}`,
          contextTransferred: true,
          summary: conversationSummary,
        };
      },
    }),
  };
}
