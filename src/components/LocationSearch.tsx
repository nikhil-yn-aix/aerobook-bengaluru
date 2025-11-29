import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { X } from 'lucide-react';

interface Stop {
  id: string;
  query: string;
  lat?: number;
  lng?: number;
}

interface LocationSearchProps {
  onStopsChange: (stops: Stop[]) => void;
}

const LocationSearch = ({ onStopsChange }: LocationSearchProps) => {
  const [stops, setStops] = useState<Stop[]>([
    { id: 'pickup', query: '' },
    { id: 'destination', query: '' },
  ]);
  const provider = new OpenStreetMapProvider();

  useEffect(() => {
    onStopsChange(stops);
  }, [stops, onStopsChange]);

  const handleQueryChange = (id: string, query: string) => {
    setStops((prevStops) =>
      prevStops.map((stop) => (stop.id === id ? { ...stop, query } : stop))
    );
  };

  const handleSearch = async (id: string) => {
    const stop = stops.find((s) => s.id === id);
    if (!stop || !stop.query) return;

    const results = await provider.search({ query: stop.query });
    if (results && results.length > 0) {
      const { y: lat, x: lng } = results[0];
      setStops((prevStops) =>
        prevStops.map((s) => (s.id === id ? { ...s, lat, lng } : s))
      );
    }
  };

  const addStop = () => {
    const newStop: Stop = { id: `stop-${Date.now()}`, query: '' };
    const destinationIndex = stops.findIndex((stop) => stop.id === 'destination');
    const newStops = [...stops];
    newStops.splice(destinationIndex, 0, newStop);
    setStops(newStops);
  };

  const removeStop = (id: string) => {
    setStops((prevStops) => prevStops.filter((stop) => stop.id !== id));
  };

  return (
    <div className="space-y-4">
      {stops.map((stop, index) => (
        <div key={stop.id} className="flex gap-2 items-center">
          <Input
            placeholder={
              stop.id === 'pickup'
                ? 'Pickup Location'
                : stop.id === 'destination'
                ? 'Destination Location'
                : `Stop ${index}`
            }
            value={stop.query}
            onChange={(e) => handleQueryChange(stop.id, e.target.value)}
          />
          <Button onClick={() => handleSearch(stop.id)}>Search</Button>
          {stop.id !== 'pickup' && stop.id !== 'destination' && (
            <Button variant="ghost" size="icon" onClick={() => removeStop(stop.id)}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
      <Button onClick={addStop}>Add Stop</Button>
    </div>
  );
};

export default LocationSearch;
