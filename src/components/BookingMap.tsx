import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const createGlowingIcon = (color: string) => {
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        width: 20px;
        height: 20px;
        background: ${color};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 0 20px ${color}, 0 0 40px ${color};
        animation: pulse 2s ease-in-out infinite;
      "></div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

interface BookingMapProps {
  onLocationSelect: (lat: number, lng: number, type: "pickup" | "destination") => void;
  pickupLocation: { lat: number; lng: number } | null;
  destinationLocation: { lat: number; lng: number } | null;
}

function MapClickHandler({ onLocationSelect, hasPickup }: { onLocationSelect: BookingMapProps["onLocationSelect"]; hasPickup: boolean }) {
  useMapEvents({
    click(e) {
      const type = hasPickup ? "destination" : "pickup";
      onLocationSelect(e.latlng.lat, e.latlng.lng, type);
    },
  });
  
  return null;
}

export default function BookingMap({ onLocationSelect, pickupLocation, destinationLocation }: BookingMapProps) {
  const [mapKey, setMapKey] = useState(0);
  const bengaluruCenter: [number, number] = [12.9716, 77.5946];

  useEffect(() => {
    // Force re-render when locations change to update polyline
    setMapKey(prev => prev + 1);
  }, [pickupLocation, destinationLocation]);

  const pickupIcon = createGlowingIcon("#00f2ff");
  const destinationIcon = createGlowingIcon("#a855f7");

  return (
    <div className="relative h-full w-full rounded-xl overflow-hidden border-2 border-primary/30 shadow-lg shadow-primary/20">
      <MapContainer
        key={mapKey}
        center={bengaluruCenter}
        zoom={12}
        className="h-full w-full"
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapClickHandler 
          onLocationSelect={onLocationSelect} 
          hasPickup={!!pickupLocation} 
        />
        
        {pickupLocation && (
          <Marker position={[pickupLocation.lat, pickupLocation.lng]} icon={pickupIcon} />
        )}
        
        {destinationLocation && (
          <Marker position={[destinationLocation.lat, destinationLocation.lng]} icon={destinationIcon} />
        )}
        
        {pickupLocation && destinationLocation && (
          <Polyline
            positions={[
              [pickupLocation.lat, pickupLocation.lng],
              [destinationLocation.lat, destinationLocation.lng],
            ]}
            pathOptions={{
              color: "#00f2ff",
              weight: 3,
              opacity: 0.8,
              dashArray: "10, 10",
            }}
          />
        )}
      </MapContainer>
      
      <div className="absolute top-4 right-4 z-[1000] bg-card/90 backdrop-blur-md px-4 py-2 rounded-lg border border-primary/20 shadow-lg">
        <p className="text-sm text-foreground font-medium">
          {!pickupLocation ? (
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
              Click to set pickup location
            </span>
          ) : !destinationLocation ? (
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
              Click to set destination
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Route ready!
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
