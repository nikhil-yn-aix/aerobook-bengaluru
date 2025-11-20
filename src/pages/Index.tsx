import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import BookingMap from "@/components/BookingMap";
import TierSelector, { taxiTiers } from "@/components/TierSelector";
import BookingConfirmation from "@/components/BookingConfirmation";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MapPin, Navigation, Zap } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

interface Location {
  lat: number;
  lng: number;
}

export default function Index() {
  const [pickupLocation, setPickupLocation] = useState<Location | null>(null);
  const [destinationLocation, setDestinationLocation] = useState<Location | null>(null);
  const [selectedTier, setSelectedTier] = useState("standard");
  const [userName, setUserName] = useState("");
  const [userContact, setUserContact] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState<any>(null);

  const calculateDistance = (loc1: Location, loc2: Location): number => {
    const R = 6371; // Earth's radius in km
    const dLat = ((loc2.lat - loc1.lat) * Math.PI) / 180;
    const dLon = ((loc2.lng - loc1.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((loc1.lat * Math.PI) / 180) *
        Math.cos((loc2.lat * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleLocationSelect = (lat: number, lng: number, type: "pickup" | "destination") => {
    if (type === "pickup") {
      setPickupLocation({ lat, lng });
      toast.success("Pickup location set!", {
        description: "Now select your destination",
      });
    } else {
      setDestinationLocation({ lat, lng });
      toast.success("Destination set!", {
        description: "Ready to calculate fare",
      });
    }
  };

  const distance =
    pickupLocation && destinationLocation
      ? calculateDistance(pickupLocation, destinationLocation)
      : null;

  const selectedTierData = taxiTiers.find((t) => t.id === selectedTier)!;
  const fare = distance ? distance * selectedTierData.pricePerKm : null;
  
  // Flight time: Assuming average speed of 120 km/h for flying taxis
  const flightTime = distance ? Math.ceil((distance / 120) * 60) : null;

  const handleBooking = async () => {
    if (!pickupLocation || !destinationLocation || !distance || !fare || !flightTime) {
      toast.error("Please set both pickup and destination locations");
      return;
    }

    setIsBooking(true);

    try {
      const podId = `POD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      const arrivalTime = selectedTierData.waitTime;

      const { data, error } = await supabase.from("bookings").insert({
        pickup_lat: pickupLocation.lat,
        pickup_lng: pickupLocation.lng,
        destination_lat: destinationLocation.lat,
        destination_lng: destinationLocation.lng,
        distance_km: distance,
        fare: fare,
        tier: selectedTier,
        pod_id: podId,
        estimated_arrival_minutes: arrivalTime,
        estimated_flight_minutes: flightTime,
        user_name: userName || null,
        user_contact: userContact || null,
        status: "confirmed",
      }).select().single();

      if (error) throw error;

      setBookingConfirmed({
        podId,
        tier: selectedTierData.name,
        distance,
        fare,
        flightTime,
        arrivalTime,
      });

      toast.success("Booking confirmed!", {
        description: `Your ${selectedTierData.name} is on the way!`,
      });
    } catch (error: any) {
      console.error("Booking error:", error);
      toast.error("Booking failed", {
        description: error.message || "Please try again",
      });
    } finally {
      setIsBooking(false);
    }
  };

  const handleNewBooking = () => {
    setBookingConfirmed(null);
    setPickupLocation(null);
    setDestinationLocation(null);
    setSelectedTier("standard");
    setUserName("");
    setUserContact("");
  };

  if (bookingConfirmed) {
    return <BookingConfirmation {...bookingConfirmed} onNewBooking={handleNewBooking} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80 relative overflow-hidden">
      <div className="absolute top-4 right-4 z-20">
        <ModeToggle />
      </div>
      {/* Animated background effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary))_0%,transparent_50%)] opacity-10 animate-pulse-glow"></div>
      
      <div className="container mx-auto px-4 py-6 relative z-10">
        {/* Header */}
        <header className="text-center mb-8 animate-slide-up">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Zap className="w-10 h-10 text-primary animate-float" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              SkyTaxi
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            The Future of Urban Mobility in Bengaluru
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
          {/* Left Panel - Map */}
          <Card className="p-4 bg-card/80 backdrop-blur-md border-primary/20 shadow-xl animate-slide-up">
            <div className="h-[600px] relative">
              <BookingMap
                onLocationSelect={handleLocationSelect}
                pickupLocation={pickupLocation}
                destinationLocation={destinationLocation}
              />
            </div>
            
            {distance && (
              <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <MapPin className="w-5 h-5 mx-auto mb-1 text-primary" />
                    <p className="text-2xl font-bold text-foreground">
                      {distance.toFixed(1)}
                    </p>
                    <p className="text-xs text-muted-foreground">km</p>
                  </div>
                  <div>
                    <Navigation className="w-5 h-5 mx-auto mb-1 text-accent" />
                    <p className="text-2xl font-bold text-foreground">
                      {flightTime}
                    </p>
                    <p className="text-xs text-muted-foreground">min flight</p>
                  </div>
                  <div>
                    <Zap className="w-5 h-5 mx-auto mb-1 text-primary" />
                    <p className="text-2xl font-bold text-primary">
                      ₹{fare?.toFixed(0)}
                    </p>
                    <p className="text-xs text-muted-foreground">estimated</p>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Right Panel - Booking Details */}
          <div className="space-y-4 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <Card className="p-6 bg-card/80 backdrop-blur-md border-primary/20 shadow-xl">
              <TierSelector
                selectedTier={selectedTier}
                onTierSelect={setSelectedTier}
                distance={distance}
              />
            </Card>

            <Card className="p-6 bg-card/80 backdrop-blur-md border-primary/20 shadow-xl">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Contact Details <span className="text-muted-foreground text-sm">(Optional)</span>
              </h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="bg-background/50 border-border"
                  />
                </div>
                <div>
                  <Label htmlFor="contact">Phone/Email</Label>
                  <Input
                    id="contact"
                    placeholder="Contact information"
                    value={userContact}
                    onChange={(e) => setUserContact(e.target.value)}
                    className="bg-background/50 border-border"
                  />
                </div>
              </div>
            </Card>

            <Button
              onClick={handleBooking}
              disabled={!pickupLocation || !destinationLocation || isBooking}
              className="w-full h-14 text-lg font-bold bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg shadow-primary/40 transition-all hover:scale-[1.02] disabled:opacity-50"
              size="lg"
            >
              {isBooking ? (
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></span>
                  Booking...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Book Flying Taxi
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
