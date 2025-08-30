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

interface IndianRailSeatMapProps {
  trainId: string;
  selectedCoach: string;
  onSeatSelect: (seats: string[]) => void;
  selectedSeats: string[];
}

const IndianRailSeatMap = ({ trainId, selectedCoach, onSeatSelect, selectedSeats }: IndianRailSeatMapProps) => {
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
          Coach {selectedCoach} - {seats.length > 0 ? seats[0].class : 'Sleeper'}
          <Badge variant="outline">{seats.length} seats</Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Select your preferred berth. Click on available seats to book.
        </p>
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

        {/* Indian Railway Sleeper Coach Layout */}
        <div className="space-y-6">
          {groupedSeats.map((compartmentSeats, compartmentIndex) => (
            <div key={compartmentIndex} className="border-2 border-primary/20 rounded-lg p-4 bg-card/50">
              <h4 className="text-sm font-medium mb-3 text-center bg-primary/10 rounded px-2 py-1">
                Compartment {compartmentIndex + 1}
              </h4>
              
              <div className="grid grid-cols-8 gap-2 max-w-4xl mx-auto">
                {/* Main berth area (6 berths in 2 columns) */}
                <div className="col-span-6 grid grid-cols-2 gap-4">
                  {/* Left side berths (1, 2, 3) */}
                  <div className="space-y-1">
                    {compartmentSeats.slice(0, 3).map((seat) => (
                      <Button
                        key={seat.id}
                        variant="outline"
                        size="sm"
                        className={`h-12 w-full text-xs transition-all border-2 ${getSeatColor(getSeatStatus(seat))}`}
                        onClick={() => handleSeatClick(seat.seat_number)}
                        disabled={!seat.is_available}
                      >
                        <div className="flex flex-col items-center">
                          <span>{getBerthIcon(seat.seat_number)}</span>
                          <span className="text-xs">{seat.seat_number}</span>
                        </div>
                      </Button>
                    ))}
                  </div>
                  
                  {/* Right side berths (4, 5, 6) */}
                  <div className="space-y-1">
                    {compartmentSeats.slice(3, 6).map((seat) => (
                      <Button
                        key={seat.id}
                        variant="outline"
                        size="sm"
                        className={`h-12 w-full text-xs transition-all border-2 ${getSeatColor(getSeatStatus(seat))}`}
                        onClick={() => handleSeatClick(seat.seat_number)}
                        disabled={!seat.is_available}
                      >
                        <div className="flex flex-col items-center">
                          <span>{getBerthIcon(seat.seat_number)}</span>
                          <span className="text-xs">{seat.seat_number}</span>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
                
                {/* Side berths (7, 8) */}
                <div className="col-span-2 space-y-2">
                  {compartmentSeats.slice(6, 8).map((seat) => (
                    <Button
                      key={seat.id}
                      variant="outline"
                      size="sm"
                      className={`h-16 w-full text-xs transition-all border-2 ${getSeatColor(getSeatStatus(seat))}`}
                      onClick={() => handleSeatClick(seat.seat_number)}
                      disabled={!seat.is_available}
                    >
                      <div className="flex flex-col items-center">
                        <span>{getBerthIcon(seat.seat_number)}</span>
                        <span className="text-xs">{seat.seat_number}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
              
              {/* Compartment info */}
              <div className="mt-2 text-center">
                <div className="text-xs text-muted-foreground">
                  Window | Aisle | | Aisle | Window | Side
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Berth Type Legend */}
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