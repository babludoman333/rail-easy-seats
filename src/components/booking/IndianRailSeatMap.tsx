import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import ClassSpecificSeatLayouts from "./ClassSpecificSeatLayouts";

interface Seat {
  id: string;
  seat_number: string;
  coach: string;
  class: string;
  is_available: boolean;
}

interface IndianRailSeatMapProps {
  trainId: string;
  selectedCoach: string;
  onSeatSelect: (seats: string[]) => void;
  selectedSeats: string[];
  selectedClass: string;
  onClassSelect: (classType: string) => void;
}

const IndianRailSeatMap = ({ trainId, selectedCoach, onSeatSelect, selectedSeats, selectedClass, onClassSelect }: IndianRailSeatMapProps) => {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSeats();
  }, [trainId, selectedCoach]);

  const fetchSeats = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('seats')
      .select('*')
      .eq('train_id', trainId)
      .eq('coach', selectedCoach)
      .order('seat_number');
    
    if (error) {
      console.error('Error fetching seats:', error);
      return;
    }
    
    setSeats(data || []);
    setLoading(false);
  };

  const handleSeatClick = (seatNumber: string) => {
    const seat = seats.find(s => s.seat_number === seatNumber);
    if (!seat || !seat.is_available) return;

    let newSelectedSeats;
    if (selectedSeats.includes(seatNumber)) {
      newSelectedSeats = selectedSeats.filter(s => s !== seatNumber);
    } else {
      newSelectedSeats = [...selectedSeats, seatNumber];
    }
    
    onSeatSelect(newSelectedSeats);
  };

  const getSeatStatus = (seat: Seat) => {
    if (selectedSeats.includes(seat.seat_number)) {
      return 'selected';
    }
    return seat.is_available ? 'available' : 'booked';
  };

  const getSeatColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-available text-available-foreground hover:bg-available/80 cursor-pointer border-available';
      case 'booked':
        return 'bg-booked text-booked-foreground cursor-not-allowed border-booked';
      case 'selected':
        return 'bg-selected text-selected-foreground hover:bg-selected/80 cursor-pointer border-selected';
      default:
        return 'bg-muted border-muted';
    }
  };

  const getBerthIcon = (seatNumber: string) => {
    if (seatNumber.includes('LB')) return '🛏️'; // Lower Berth
    if (seatNumber.includes('MB')) return '🛏️'; // Middle Berth  
    if (seatNumber.includes('UB')) return '🛏️'; // Upper Berth
    if (seatNumber.includes('SL')) return '💺'; // Side Lower
    if (seatNumber.includes('SU')) return '💺'; // Side Upper
    return '💺';
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-pulse">Loading seat map...</div>
        </CardContent>
      </Card>
    );
  }

  // Group seats into compartments (8 seats per compartment for sleeper)
  const groupedSeats = [];
  for (let i = 0; i < seats.length; i += 8) {
    groupedSeats.push(seats.slice(i, i + 8));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Coach {selectedCoach} - {selectedClass || 'Sleeper'}
          <Badge variant="outline">{seats.length} seats</Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Select your preferred berth. Click on available seats to book.
        </p>
        
        {/* Class Selection */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Class</Label>
          <Select value={selectedClass} onValueChange={onClassSelect}>
            <SelectTrigger className="max-w-xs">
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Sleeper">Sleeper (SL)</SelectItem>
              <SelectItem value="AC 3 Tier">AC 3 Tier (3A)</SelectItem>
              <SelectItem value="AC 3 Tier Economy">AC 3 Tier Economy (3E)</SelectItem>
              <SelectItem value="AC 2 Tier">AC 2 Tier (2A)</SelectItem>
              <SelectItem value="AC 1 Tier">AC 1 Tier (1A)</SelectItem>
              <SelectItem value="Chair Car">Chair Car (CC)</SelectItem>
              <SelectItem value="Executive Chair Car">Executive Chair Car (EC)</SelectItem>
              <SelectItem value="Second Sitting">Second Sitting (2S)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-6 p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-available rounded border"></div>
            <span className="text-sm">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-booked rounded border"></div>
            <span className="text-sm">Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-selected rounded border"></div>
            <span className="text-sm">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">🛏️ Berth</span>
            <span className="text-sm">💺 Side Seat</span>
          </div>
        </div>

        {/* Class-specific seat layouts */}
        <ClassSpecificSeatLayouts
          seats={seats}
          selectedSeats={selectedSeats}
          onSeatClick={handleSeatClick}
          getSeatStatus={getSeatStatus}
          getSeatColor={getSeatColor}
          selectedClass={selectedClass}
        />

        {/* Berth Type Legend - only for sleeper and AC classes */}
        {(selectedClass === 'Sleeper' || selectedClass.includes('AC')) && selectedClass !== 'Second Sitting' && (
          <div className="mt-6 p-4 bg-muted/20 rounded-lg">
            <h4 className="font-medium mb-2">Berth Types</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
              <div><strong>LB:</strong> Lower Berth</div>
              <div><strong>MB:</strong> Middle Berth</div>
              <div><strong>UB:</strong> Upper Berth</div>
              <div><strong>SL:</strong> Side Lower</div>
              <div><strong>SU:</strong> Side Upper</div>
            </div>
          </div>
        )}

        {/* Selected seats summary */}
        {selectedSeats.length > 0 && (
          <div className="mt-6 p-4 bg-selected/10 rounded-lg border border-selected/20">
            <h4 className="font-medium mb-2">Selected Seats ({selectedSeats.length})</h4>
            <div className="flex flex-wrap gap-2">
              {selectedSeats.map(seatNumber => (
                <Badge key={seatNumber} variant="secondary" className="bg-selected/20 text-selected-foreground">
                  {getBerthIcon(seatNumber)} {seatNumber}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IndianRailSeatMap;