// =============================================================================
// OmniCare Shared Types — Multi-business customer care platform
// =============================================================================

/** Tenant (business) configuration */
export type Tenant = {
  id: string;
  slug: string;
  name: string;
  industry?: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl?: string;
  contactEmail: string;
  contactPhone?: string;
  website?: string;
  timezone: string;
  businessHours?: BusinessHours;
  isActive: boolean;
};

export type BusinessHours = {
  monday?: DayHours;
  tuesday?: DayHours;
  wednesday?: DayHours;
  thursday?: DayHours;
  friday?: DayHours;
  saturday?: DayHours;
  sunday?: DayHours;
};

export type DayHours = { open: string; close: string } | null;

/** Bot configuration per tenant */
export type BotConfig = {
  id: string;
  tenantId: string;
  personalityTemplate: "professional" | "friendly" | "casual" | "custom";
  customInstructions?: string;
  firstMessage: string;
  quickQuestions: string[];
  llmModel: string;
  temperature: number;
  maxSteps: number;
  enabledTools: Record<string, boolean>;
};

/** Visitor (customer) profile */
export type Visitor = {
  id: string;
  tenantId: string;
  name?: string;
  email?: string;
  phone?: string;
  firstSeen: string;
  lastSeen: string;
  totalConversations: number;
  metadata: Record<string, unknown>;
};

/** Visitor memory — persisted context across sessions */
export type VisitorMemory = {
  visitorId: string;
  preferences: Record<string, string>;
  pastIssues: string[];
  productInterests: string[];
  sentimentHistory: Array<{ date: string; score: number }>;
  notes: string[];
  lastTopic?: string;
};

/** Conversation */
export type Conversation = {
  id: string;
  tenantId: string;
  visitorId?: string;
  startedAt: string;
  endedAt?: string;
  summary?: string;
  sentiment: "positive" | "neutral" | "negative";
  resolved: boolean;
  escalated: boolean;
};

// =============================================================================
// Mock Data Types — Used for demo
// =============================================================================

/** Order */
export type Order = {
  id: string;
  customerEmail: string;
  customerName: string;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  shippingAddress: string;
  steps: OrderStep[];
};

export type OrderItem = {
  name: string;
  quantity: number;
  price: number;
  sku: string;
};

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "returned";

export type OrderStep = {
  title: string;
  description?: string;
  status: "completed" | "current" | "upcoming";
  timestamp?: string;
};

/** Product */
export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  imageUrl?: string;
  inStock: boolean;
  features: string[];
  rating: number;
  reviewCount: number;
};

/** Support Ticket */
export type Ticket = {
  id: string;
  subject: string;
  description: string;
  status: "open" | "in_progress" | "waiting_customer" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  category: string;
  createdAt: string;
  updatedAt: string;
  assignee?: string;
};

/** FAQ Item */
export type FAQItem = {
  question: string;
  answer: string;
  category: string;
};

/** Appointment Slot */
export type AppointmentSlot = {
  date: string;
  time: string;
  available: boolean;
  service?: string;
};

/** Pricing Plan */
export type PricingPlan = {
  name: string;
  price: number;
  currency: string;
  interval: "month" | "year";
  features: string[];
  highlighted?: boolean;
  cta: string;
};

/** Account Info */
export type AccountInfo = {
  id: string;
  name: string;
  email: string;
  plan: string;
  status: "active" | "suspended" | "cancelled";
  billingDate: string;
  balance: number;
  currency: string;
  memberSince: string;
};

/** Lead capture from chat */
export type LeadCaptureData = {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  source: string;
  intent?: string;
};
