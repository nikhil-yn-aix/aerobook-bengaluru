import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

export interface TaxiTier {
  id: string;
  name: string;
  pricePerKm: number;
  waitTime: number;
  description: string;
  icon: string;
  maxPassengers: number;
}

export const taxiTiers: TaxiTier[] = [
  {
    id: "solo",
    name: "Solo Pod",
    pricePerKm: 30,
    waitTime: 2,
    description: "Quick personal commute",
    icon: "🛸",
    maxPassengers: 1,
  },
  {
    id: "standard",
    name: "Standard Pod",
    pricePerKm: 50,
    waitTime: 8,
    description: "Efficient and affordable sky travel",
    icon: "🚁",
    maxPassengers: 4,
  },
  {
    id: "premium",
    name: "Premium Pod",
    pricePerKm: 85,
    waitTime: 5,
    description: "Comfort with faster response time",
    icon: "✈️",
    maxPassengers: 6,
  },
  {
    id: "executive",
    name: "Executive Pod",
    pricePerKm: 150,
    waitTime: 2,
    description: "Luxury experience with priority service",
    icon: "🚀",
    maxPassengers: 4,
  },
];

interface TierSelectorProps {
  selectedTier: string;
  onTierSelect: (tierId: string) => void;
  distance: number | null;
}

export default function TierSelector({ selectedTier, onTierSelect, distance }: TierSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
        <span className="text-2xl">🛸</span>
        Choose Your Pod
      </h3>
      <div className="grid gap-3">
        {taxiTiers.map((tier) => {
          const fare = distance ? (distance * tier.pricePerKm).toFixed(0) : null;
          const isSelected = selectedTier === tier.id;
          
          return (
            <Card
              key={tier.id}
              className={`p-4 cursor-pointer transition-all duration-300 ${
                isSelected
                  ? "bg-primary/10 border-primary shadow-lg shadow-primary/20 scale-[1.02]"
                  : "bg-card hover:bg-card/80 border-border hover:border-primary/50"
              }`}
              onClick={() => onTierSelect(tier.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-3 flex-1">
                  <span className="text-3xl">{tier.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-foreground">{tier.name}</h4>
                      {isSelected && (
                        <Check className="w-5 h-5 text-primary animate-pulse-glow" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {tier.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="text-xs">
                        ₹{tier.pricePerKm}/km
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        ~{tier.waitTime} min wait
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {tier.maxPassengers} Passenger{tier.maxPassengers > 1 ? 's' : ''}
                      </Badge>
                    </div>
                  </div>
                </div>
                {fare && (
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">
                      ₹{fare}
                    </p>
                    <p className="text-xs text-muted-foreground">estimated</p>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
