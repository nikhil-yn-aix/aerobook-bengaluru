import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
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

interface Stop {
  id: string;
  query: string;
  lat?: number;
  lng?: number;
}

interface BookingMapProps {
  stops: Stop[];
}

function MapUpdater({ locatedStops }: { locatedStops: Stop[] }) {
  const map = useMap();

  useEffect(() => {
    if (locatedStops.length > 0) {
      const bounds = L.latLngBounds(locatedStops.map(s => [s.lat!, s.lng!]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [locatedStops, map]);

  return null;
}

export default function BookingMap({ stops }: BookingMapProps) {
  const bengaluruCenter: [number, number] = [12.9716, 77.5946];
  const locatedStops = stops.filter(s => s.lat && s.lng);

  const pickupIcon = createGlowingIcon("#00f2ff");
  const destinationIcon = createGlowingIcon("#a855f7");
  const stopIcon = createGlowingIcon("#ffffff");

  const getStatus = () => {
    const locatedCount = locatedStops.length;
    if (locatedCount === 0) {
      return (
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
          Add a pickup location to start
        </span>
      );
    } else if (locatedCount === 1) {
      return (
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
          Add a destination
        </span>
      );
    } else {
      return (
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          Route ready for booking!
        </span>
      );
    }
  };

  return (
    <div className="relative h-full w-full rounded-xl overflow-hidden border-2 border-primary/30 shadow-lg shadow-primary/20">
      <MapContainer
        center={bengaluruCenter}
        zoom={12}
        className="h-full w-full"
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapUpdater locatedStops={locatedStops} />

        {locatedStops.map((stop, index) => {
          let icon = stopIcon;
          if (index === 0) icon = pickupIcon;
          if (index === locatedStops.length - 1 && locatedStops.length > 1) icon = destinationIcon;

          return (
            <Marker key={stop.id} position={[stop.lat!, stop.lng!]} icon={icon} />
          );
        })}
        
        {locatedStops.length > 1 && (
          <Polyline
            positions={locatedStops.map(s => [s.lat!, s.lng!])}
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
          {getStatus()}
        </p>
      </div>
    </div>
  );
}
