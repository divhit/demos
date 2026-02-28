// ── Gemini Vibe Interpretation Output ──
export interface VibeInterpretation {
  search_queries: string[];
  place_types: string[];
  vibe_attributes: string[];
  vibe_summary: string;
  mood_color: string;
}

// ── Gemini Photo Analysis Output ──
export interface PhotoAnalysis {
  vibe_score: number;
  matching_elements: string[];
  vibe_description: string;
  standout_detail: string;
}

// ── Place result ──
export interface DriftPlace {
  id: string;
  name: string;
  address: string;
  location: { latitude: number; longitude: number };
  types: string[];
  rating?: number;
  userRatingCount?: number;
  priceLevel?: string;
  photoUri?: string;
  photoName?: string;
  websiteUri?: string;
  vibeAnalysis?: PhotoAnalysis;
}

// ── Live Events (Google Search Grounded) ──
export interface DriftEvent {
  name: string;
  venue: string;
  date: string;
  description: string;
  url?: string;
  source?: string;
}

// ── SSE Events ──
export type DriftEventType =
  | "interpreting"
  | "searching"
  | "analyzing"
  | "events"
  | "complete"
  | "error";

export interface DriftPlaceUpdate {
  placeId: string;
  vibeAnalysis: PhotoAnalysis;
}

export interface DriftComplete {
  totalPlaces: number;
}

export interface DriftError {
  message: string;
  phase: string;
}

export interface DriftRequest {
  query: string;
  latitude: number;
  longitude: number;
  radius?: number;
}

// ── UI State Machine ──
export type DriftUIState =
  | "idle"
  | "interpreting"
  | "searching"
  | "analyzing"
  | "results";
