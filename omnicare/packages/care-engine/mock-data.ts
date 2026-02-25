import type {
  Order,
  Product,
  Ticket,
  FAQItem,
  AppointmentSlot,
  PricingPlan,
  AccountInfo,
} from "@omnicare/shared";

// =============================================================================
// Realistic mock data for demo — covers multiple business verticals
// =============================================================================

export const MOCK_ORDERS: Order[] = [
  {
    id: "ORD-7291",
    customerEmail: "sarah@example.com",
    customerName: "Sarah Chen",
    items: [
      { name: "Wireless Noise-Cancelling Headphones", quantity: 1, price: 299.99, sku: "WH-1000" },
      { name: "USB-C Charging Cable (6ft)", quantity: 2, price: 14.99, sku: "CB-USB6" },
    ],
    status: "shipped",
    total: 329.97,
    currency: "USD",
    createdAt: "2026-02-20T14:30:00Z",
    updatedAt: "2026-02-22T09:15:00Z",
    estimatedDelivery: "2026-02-26",
    trackingNumber: "1Z999AA10123456784",
    trackingUrl: "https://tracking.example.com/1Z999AA10123456784",
    shippingAddress: "123 Main St, San Francisco, CA 94102",
    steps: [
      { title: "Order Placed", description: "Feb 20, 2:30 PM", status: "completed", timestamp: "2026-02-20T14:30:00Z" },
      { title: "Payment Confirmed", description: "Feb 20, 2:31 PM", status: "completed", timestamp: "2026-02-20T14:31:00Z" },
      { title: "Processing", description: "Picking & packing", status: "completed", timestamp: "2026-02-21T08:00:00Z" },
      { title: "Shipped", description: "Via FedEx Express", status: "current", timestamp: "2026-02-22T09:15:00Z" },
      { title: "Out for Delivery", status: "upcoming" },
      { title: "Delivered", status: "upcoming" },
    ],
  },
  {
    id: "ORD-7145",
    customerEmail: "mike@example.com",
    customerName: "Mike Johnson",
    items: [
      { name: "Ergonomic Standing Desk", quantity: 1, price: 599.00, sku: "DSK-ERG1" },
      { name: "Monitor Arm (Dual)", quantity: 1, price: 89.99, sku: "ARM-DL2" },
    ],
    status: "delivered",
    total: 688.99,
    currency: "USD",
    createdAt: "2026-02-15T10:00:00Z",
    updatedAt: "2026-02-19T16:45:00Z",
    estimatedDelivery: "2026-02-19",
    trackingNumber: "1Z999AA10123456799",
    shippingAddress: "456 Oak Ave, Austin, TX 78701",
    steps: [
      { title: "Order Placed", description: "Feb 15", status: "completed" },
      { title: "Payment Confirmed", status: "completed" },
      { title: "Processing", status: "completed" },
      { title: "Shipped", description: "Via UPS Ground", status: "completed" },
      { title: "Out for Delivery", status: "completed" },
      { title: "Delivered", description: "Feb 19, 4:45 PM — Signed by M. Johnson", status: "completed" },
    ],
  },
  {
    id: "ORD-7302",
    customerEmail: "sarah@example.com",
    customerName: "Sarah Chen",
    items: [
      { name: "Premium Laptop Backpack", quantity: 1, price: 79.99, sku: "BAG-LPT1" },
    ],
    status: "processing",
    total: 79.99,
    currency: "USD",
    createdAt: "2026-02-23T18:20:00Z",
    updatedAt: "2026-02-24T08:00:00Z",
    shippingAddress: "123 Main St, San Francisco, CA 94102",
    steps: [
      { title: "Order Placed", description: "Feb 23, 6:20 PM", status: "completed" },
      { title: "Payment Confirmed", status: "completed" },
      { title: "Processing", description: "Being prepared for shipment", status: "current" },
      { title: "Shipped", status: "upcoming" },
      { title: "Delivered", status: "upcoming" },
    ],
  },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "PRD-001",
    name: "Wireless Noise-Cancelling Headphones",
    description: "Premium over-ear headphones with 30-hour battery life, adaptive noise cancellation, and spatial audio. Perfect for music, calls, and focus work.",
    price: 299.99,
    currency: "USD",
    category: "Audio",
    inStock: true,
    features: ["Active Noise Cancellation", "30-hour battery", "Spatial Audio", "Multipoint connection", "USB-C fast charge"],
    rating: 4.8,
    reviewCount: 2341,
  },
  {
    id: "PRD-002",
    name: "Ergonomic Standing Desk",
    description: "Electric sit-stand desk with memory presets, cable management, and bamboo top. Adjusts from 25\" to 50\" height.",
    price: 599.00,
    currency: "USD",
    category: "Furniture",
    inStock: true,
    features: ["Electric height adjustment", "4 memory presets", "Bamboo desktop", "Built-in cable tray", "Anti-collision sensor"],
    rating: 4.6,
    reviewCount: 892,
  },
  {
    id: "PRD-003",
    name: "Ultra-Wide Curved Monitor (34\")",
    description: "34-inch WQHD ultrawide curved display with 165Hz refresh rate, HDR400, and built-in KVM switch.",
    price: 449.99,
    currency: "USD",
    category: "Displays",
    inStock: true,
    features: ["34\" WQHD 3440x1440", "165Hz refresh rate", "1ms response time", "HDR400", "USB-C 90W delivery"],
    rating: 4.7,
    reviewCount: 1567,
  },
  {
    id: "PRD-004",
    name: "Mechanical Keyboard (Compact)",
    description: "75% wireless mechanical keyboard with hot-swappable switches, RGB backlighting, and aluminum frame.",
    price: 149.99,
    currency: "USD",
    category: "Peripherals",
    inStock: false,
    features: ["Hot-swappable switches", "Wireless + Bluetooth + USB-C", "PBT keycaps", "RGB per-key", "Aluminum case"],
    rating: 4.5,
    reviewCount: 723,
  },
  {
    id: "PRD-005",
    name: "Premium Laptop Backpack",
    description: "Water-resistant laptop backpack with 17\" compartment, anti-theft pocket, and USB charging port.",
    price: 79.99,
    currency: "USD",
    category: "Accessories",
    inStock: true,
    features: ["Fits up to 17\" laptop", "Water-resistant fabric", "Anti-theft pocket", "USB charging port", "Luggage strap"],
    rating: 4.4,
    reviewCount: 3210,
  },
];

export const MOCK_TICKETS: Ticket[] = [
  {
    id: "TKT-4401",
    subject: "Headphones left ear not working",
    description: "Customer reports intermittent audio loss in left ear cup after 2 weeks of use.",
    status: "in_progress",
    priority: "high",
    category: "Product Issue",
    createdAt: "2026-02-22T11:00:00Z",
    updatedAt: "2026-02-23T14:30:00Z",
    assignee: "Tech Support Team",
  },
  {
    id: "TKT-4388",
    subject: "Request for invoice copy",
    description: "Customer needs a copy of invoice for order ORD-7145 for tax purposes.",
    status: "resolved",
    priority: "low",
    category: "Billing",
    createdAt: "2026-02-20T09:15:00Z",
    updatedAt: "2026-02-20T10:45:00Z",
    assignee: "Billing Team",
  },
];

export const MOCK_FAQS: FAQItem[] = [
  { question: "What is your return policy?", answer: "We offer a 30-day no-questions-asked return policy for all products in original condition. Refunds are processed within 5-7 business days after we receive the return. Free return shipping is included for all orders.", category: "Returns" },
  { question: "How long does shipping take?", answer: "Standard shipping takes 5-7 business days. Express shipping (2-3 business days) is available for $12.99. Free shipping on orders over $50. All orders include tracking.", category: "Shipping" },
  { question: "Do you offer international shipping?", answer: "Yes! We ship to 40+ countries. International shipping takes 7-14 business days. Customs duties and taxes are the responsibility of the recipient.", category: "Shipping" },
  { question: "How do I track my order?", answer: "Once your order ships, you'll receive an email with a tracking number and link. You can also ask me to look up your order status anytime — just share your order number or email.", category: "Shipping" },
  { question: "What payment methods do you accept?", answer: "We accept Visa, Mastercard, American Express, PayPal, Apple Pay, Google Pay, and Shop Pay. All payments are securely processed with 256-bit encryption.", category: "Payment" },
  { question: "Can I change or cancel my order?", answer: "You can modify or cancel your order within 1 hour of placing it. After that, it enters processing and changes may not be possible. Contact us immediately if you need to make changes.", category: "Orders" },
  { question: "Do you offer warranty?", answer: "All products come with a 1-year manufacturer warranty covering defects in materials and workmanship. Extended 3-year warranty is available for purchase at checkout.", category: "Warranty" },
  { question: "How do I contact customer support?", answer: "You're already talking to us! For urgent matters, call 1-800-555-CARE (Mon-Fri 9AM-6PM EST) or email support@omnicare-demo.com. We typically respond within 2 hours.", category: "Support" },
  { question: "Do you price match?", answer: "Yes! If you find a lower price from an authorized retailer within 14 days of purchase, we'll match it and give you an additional 5% off the difference.", category: "Pricing" },
  { question: "How do I reset my account password?", answer: "Click 'Forgot Password' on the login page, enter your email, and you'll receive a reset link within minutes. If you don't see it, check your spam folder or contact us.", category: "Account" },
];

export const MOCK_APPOINTMENT_SLOTS: AppointmentSlot[] = [
  { date: "2026-02-25", time: "09:00 AM", available: true, service: "Product Demo" },
  { date: "2026-02-25", time: "10:30 AM", available: true, service: "Product Demo" },
  { date: "2026-02-25", time: "02:00 PM", available: false, service: "Technical Support" },
  { date: "2026-02-25", time: "03:30 PM", available: true, service: "Technical Support" },
  { date: "2026-02-26", time: "09:00 AM", available: true, service: "Product Demo" },
  { date: "2026-02-26", time: "11:00 AM", available: true, service: "Consultation" },
  { date: "2026-02-26", time: "01:00 PM", available: true, service: "Technical Support" },
  { date: "2026-02-26", time: "04:00 PM", available: false, service: "Consultation" },
  { date: "2026-02-27", time: "10:00 AM", available: true, service: "Product Demo" },
  { date: "2026-02-27", time: "02:30 PM", available: true, service: "Consultation" },
];

export const MOCK_PRICING_PLANS: PricingPlan[] = [
  {
    name: "Starter",
    price: 0,
    currency: "USD",
    interval: "month",
    features: ["Up to 100 orders/month", "Email support", "Basic analytics", "1 team member"],
    cta: "Get Started Free",
  },
  {
    name: "Professional",
    price: 49,
    currency: "USD",
    interval: "month",
    features: ["Unlimited orders", "Priority support", "Advanced analytics", "5 team members", "API access", "Custom branding"],
    highlighted: true,
    cta: "Start Free Trial",
  },
  {
    name: "Enterprise",
    price: 199,
    currency: "USD",
    interval: "month",
    features: ["Everything in Pro", "Unlimited team members", "Dedicated account manager", "SLA guarantee", "SSO & SAML", "Custom integrations"],
    cta: "Contact Sales",
  },
];

export const MOCK_ACCOUNTS: AccountInfo[] = [
  {
    id: "ACC-001",
    name: "Sarah Chen",
    email: "sarah@example.com",
    plan: "Professional",
    status: "active",
    billingDate: "2026-03-01",
    balance: 0,
    currency: "USD",
    memberSince: "2025-06-15",
  },
  {
    id: "ACC-002",
    name: "Mike Johnson",
    email: "mike@example.com",
    plan: "Starter",
    status: "active",
    billingDate: "2026-03-15",
    balance: 0,
    currency: "USD",
    memberSince: "2026-01-10",
  },
];

// =============================================================================
// Lookup helpers
// =============================================================================

export function findOrderById(id: string): Order | undefined {
  return MOCK_ORDERS.find((o) => o.id.toLowerCase() === id.toLowerCase());
}

export function findOrdersByEmail(email: string): Order[] {
  return MOCK_ORDERS.filter((o) => o.customerEmail.toLowerCase() === email.toLowerCase());
}

export function findProductById(id: string): Product | undefined {
  return MOCK_PRODUCTS.find((p) => p.id.toLowerCase() === id.toLowerCase());
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase();
  return MOCK_PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
  );
}

export function searchFAQs(query: string): FAQItem[] {
  const q = query.toLowerCase();
  return MOCK_FAQS.filter(
    (f) =>
      f.question.toLowerCase().includes(q) ||
      f.answer.toLowerCase().includes(q) ||
      f.category.toLowerCase().includes(q)
  );
}

export function getAvailableSlots(service?: string): AppointmentSlot[] {
  return MOCK_APPOINTMENT_SLOTS.filter(
    (s) => s.available && (!service || s.service?.toLowerCase() === service.toLowerCase())
  );
}

export function findAccountByEmail(email: string): AccountInfo | undefined {
  return MOCK_ACCOUNTS.find((a) => a.email.toLowerCase() === email.toLowerCase());
}
