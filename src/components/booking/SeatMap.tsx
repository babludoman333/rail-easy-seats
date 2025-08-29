import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface Seat {
  id: string;
  seat_number: string;
  coach: string;
  class: string;
  is_available: boolean;
}

interface SeatMapProps {
  trainId: string;
  selectedCoach: string;
  onSeatSelect: (seats: string[]) => void;
  selectedSeats: string[];
}

const SeatMap = ({ trainId, selectedCoach, onSeatSelect, selectedSeats }: SeatMapProps) => {
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
        return 'bg-available text-available-foreground hover:bg-available/80 cursor-pointer';
      case 'booked':
        return 'bg-booked text-booked-foreground cursor-not-allowed';
      case 'selected':
        return 'bg-selected text-selected-foreground hover:bg-selected/80 cursor-pointer';
      default:
        return 'bg-muted';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-pulse">Loading seats...</div>
        </CardContent>
      </Card>
    );
  }

  // Group seats into bays (assuming 8 seats per bay for sleeper)
  const groupedSeats = [];
  for (let i = 0; i < seats.length; i += 8) {
    groupedSeats.push(seats.slice(i, i + 8));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Coach {selectedCoach} - Sleeper
          <Badge variant="outline">{seats.length} seats</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-6 p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-available rounded"></div>
            <span className="text-sm">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-booked rounded"></div>
            <span className="text-sm">Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-selected rounded"></div>
            <span className="text-sm">Selected</span>
          </div>
        </div>

        {/* Seat Map */}
        <div className="space-y-4">
          {groupedSeats.map((baySeats, bayIndex) => (
            <div key={bayIndex} className="border rounded-lg p-4 bg-card">
              <h4 className="text-sm font-medium mb-3">Bay {bayIndex + 1}</h4>
              <div className="grid grid-cols-4 gap-2">
                {/* Main berths (6 seats) */}
                <div className="col-span-3 grid grid-cols-3 gap-2">
                  {baySeats.slice(0, 6).map((seat) => (
                    <Button
                      key={seat.id}
                      variant="outline"
                      size="sm"
                      className={`h-8 w-full text-xs transition-all ${getSeatColor(getSeatStatus(seat))}`}
                      onClick={() => handleSeatClick(seat.seat_number)}
                      disabled={!seat.is_available}
                    >
                      {seat.seat_number}
                    </Button>
                  ))}
                </div>
                
                {/* Side berths (2 seats) */}
                <div className="grid grid-cols-1 gap-2">
                  {baySeats.slice(6, 8).map((seat) => (
                    <Button
                      key={seat.id}
                      variant="outline"
                      size="sm"
                      className={`h-8 w-full text-xs transition-all ${getSeatColor(getSeatStatus(seat))}`}
                      onClick={() => handleSeatClick(seat.seat_number)}
                      disabled={!seat.is_available}
                    >
                      {seat.seat_number}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Selected seats summary */}
        {selectedSeats.length > 0 && (
          <div className="mt-6 p-4 bg-selected/10 rounded-lg border border-selected/20">
            <h4 className="font-medium mb-2">Selected Seats ({selectedSeats.length})</h4>
            <div className="flex flex-wrap gap-2">
              {selectedSeats.map(seatNumber => (
                <Badge key={seatNumber} variant="secondary">
                  Seat {seatNumber}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SeatMap;