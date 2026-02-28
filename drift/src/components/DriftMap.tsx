"use client";

import { Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import { VibePin } from "./VibePin";
import type { DriftPlace } from "@/lib/types";

interface DriftMapProps {
  places: DriftPlace[];
  selectedPlace: DriftPlace | null;
  onSelectPlace: (place: DriftPlace) => void;
  userLocation: { lat: number; lng: number } | null;
  moodColor?: string;
}

export function DriftMap({
  places,
  selectedPlace,
  onSelectPlace,
  userLocation,
  moodColor,
}: DriftMapProps) {
  const center = userLocation ?? { lat: 49.2827, lng: -123.1207 };

  return (
    <Map
      defaultCenter={center}
      defaultZoom={14}
      gestureHandling="greedy"
      disableDefaultUI
      className="h-full w-full"
      colorScheme="DARK"
      mapId="drift-dark-map"
    >
      {userLocation && (
        <AdvancedMarker position={userLocation}>
          <div className="h-3 w-3 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]" />
        </AdvancedMarker>
      )}

      {places.map((place) => (
        <AdvancedMarker
          key={place.id}
          position={{
            lat: place.location.latitude,
            lng: place.location.longitude,
          }}
          onClick={() => onSelectPlace(place)}
        >
          <VibePin
            score={place.vibeAnalysis?.vibe_score}
            isSelected={selectedPlace?.id === place.id}
            moodColor={moodColor}
          />
        </AdvancedMarker>
      ))}
    </Map>
  );
}
