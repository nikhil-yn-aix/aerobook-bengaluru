import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OpenStreetMapProvider } from 'leaflet-geosearch';

interface LocationSearchProps {
  onLocationSelect: (lat: number, lng: number, type: 'pickup' | 'destination') => void;
}

const LocationSearch = ({ onLocationSelect }: LocationSearchProps) => {
  const [pickupQuery, setPickupQuery] = useState('');
  const [destinationQuery, setDestinationQuery] = useState('');
  const provider = new OpenStreetMapProvider();

  const handleSearch = async (query: string, type: 'pickup' | 'destination') => {
    if (!query) return;
    const results = await provider.search({ query });
    if (results && results.length > 0) {
      const { y: lat, x: lng } = results[0];
      onLocationSelect(lat, lng, type);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Pickup Location"
          value={pickupQuery}
          onChange={(e) => setPickupQuery(e.target.value)}
        />
        <Button onClick={() => handleSearch(pickupQuery, 'pickup')}>Search</Button>
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="Destination Location"
          value={destinationQuery}
          onChange={(e) => setDestinationQuery(e.target.value)}
        />
        <Button onClick={() => handleSearch(destinationQuery, 'destination')}>Search</Button>
      </div>
    </div>
  );
};

export default LocationSearch;
