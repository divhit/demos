import type { DriftPlace } from "./types";

const API_KEY = process.env.GOOGLE_MAPS_API_KEY!;
const BASE = "https://places.googleapis.com/v1";

const FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.location",
  "places.types",
  "places.rating",
  "places.userRatingCount",
  "places.priceLevel",
  "places.photos",
  "places.websiteUri",
].join(",");

interface PlacesResponse {
  places?: Array<{
    id: string;
    displayName: { text: string };
    formattedAddress: string;
    location: { latitude: number; longitude: number };
    types: string[];
    rating?: number;
    userRatingCount?: number;
    priceLevel?: string;
    photos?: Array<{ name: string }>;
    websiteUri?: string;
  }>;
}

export async function searchPlaces(
  query: string,
  latitude: number,
  longitude: number,
  radius: number = 15000
): Promise<DriftPlace[]> {
  const response = await fetch(`${BASE}/places:searchText`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": API_KEY,
      "X-Goog-FieldMask": FIELD_MASK,
    },
    body: JSON.stringify({
      textQuery: query,
      locationBias: {
        circle: { center: { latitude, longitude }, radius },
      },
      pageSize: 8,
      languageCode: "en",
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Places API ${response.status}: ${err}`);
  }

  const data: PlacesResponse = await response.json();

  return (data.places ?? []).map((p) => ({
    id: p.id,
    name: p.displayName.text,
    address: p.formattedAddress,
    location: p.location,
    types: p.types,
    rating: p.rating,
    userRatingCount: p.userRatingCount,
    priceLevel: p.priceLevel,
    photoName: p.photos?.[0]?.name,
    websiteUri: p.websiteUri,
  }));
}

export async function fetchPhotoAsBase64(
  photoName: string,
  maxWidthPx: number = 400
): Promise<{ base64: string; mimeType: string }> {
  const metaRes = await fetch(
    `${BASE}/${photoName}/media?maxWidthPx=${maxWidthPx}&skipHttpRedirect=true&key=${API_KEY}`
  );
  if (!metaRes.ok) throw new Error(`Photo meta failed: ${metaRes.status}`);

  const { photoUri } = (await metaRes.json()) as { photoUri: string };

  const imgRes = await fetch(photoUri);
  if (!imgRes.ok) throw new Error(`Photo fetch failed: ${imgRes.status}`);

  const mimeType = imgRes.headers.get("content-type") ?? "image/jpeg";
  const buf = await imgRes.arrayBuffer();
  return { base64: Buffer.from(buf).toString("base64"), mimeType };
}

export function getPhotoDisplayUrl(
  photoName: string,
  maxWidthPx: number = 800
): string {
  return `${BASE}/${photoName}/media?maxWidthPx=${maxWidthPx}&key=${API_KEY}`;
}
