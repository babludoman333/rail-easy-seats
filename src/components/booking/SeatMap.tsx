import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Seat {
  id: string;
  number: string;
  status: 'available' | 'booked' | 'selected';
  type: 'lower' | 'middle' | 'upper' | 'side-lower' | 'side-upper';
}

const SeatMap = () => {
  // Mock seat data for a sleeper coach
  const [seats, setSeats] = useState<Seat[]>([
    // Bay 1
    { id: '1', number: '1', status: 'available', type: 'lower' },
    { id: '2', number: '2', status: 'available', type: 'middle' },
    { id: '3', number: '3', status: 'available', type: 'upper' },
    { id: '4', number: '4', status: 'booked', type: 'lower' },
    { id: '5', number: '5', status: 'available', type: 'middle' },
    { id: '6', number: '6', status: 'available', type: 'upper' },
    { id: '7', number: '7', status: 'available', type: 'side-lower' },
    { id: '8', number: '8', status: 'booked', type: 'side-upper' },
    
    // Bay 2
    { id: '9', number: '9', status: 'available', type: 'lower' },
    { id: '10', number: '10', status: 'available', type: 'middle' },
    { id: '11', number: '11', status: 'available', type: 'upper' },
    { id: '12', number: '12', status: 'available', type: 'lower' },
    { id: '13', number: '13', status: 'booked', type: 'middle' },
    { id: '14', number: '14', status: 'available', type: 'upper' },
    { id: '15', number: '15', status: 'available', type: 'side-lower' },
    { id: '16', number: '16', status: 'available', type: 'side-upper' },
  ]);

  const handleSeatClick = (seatId: string) => {
    setSeats(prevSeats => 
      prevSeats.map(seat => {
        if (seat.id === seatId && seat.status === 'available') {
          return { ...seat, status: 'selected' };
        } else if (seat.id === seatId && seat.status === 'selected') {
          return { ...seat, status: 'available' };
        }
        return seat;
      })
    );
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

  const selectedSeats = seats.filter(seat => seat.status === 'selected');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Coach S1 - Sleeper
            <Badge variant="outline">72 seats</Badge>
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
            {/* Bay layout */}
            {[0, 8].map((bayStart) => (
              <div key={bayStart} className="border rounded-lg p-4 bg-card">
                <h4 className="text-sm font-medium mb-3">Bay {bayStart === 0 ? '1' : '2'}</h4>
                <div className="grid grid-cols-4 gap-2">
                  {/* Main berths (6 seats) */}
                  <div className="col-span-3 grid grid-cols-3 gap-2">
                    {seats.slice(bayStart, bayStart + 6).map((seat) => (
                      <Button
                        key={seat.id}
                        variant="outline"
                        size="sm"
                        className={`h-8 w-full text-xs transition-all ${getSeatColor(seat.status)}`}
                        onClick={() => handleSeatClick(seat.id)}
                        disabled={seat.status === 'booked'}
                      >
                        {seat.number}
                      </Button>
                    ))}
                  </div>
                  
                  {/* Side berths (2 seats) */}
                  <div className="grid grid-cols-1 gap-2">
                    {seats.slice(bayStart + 6, bayStart + 8).map((seat) => (
                      <Button
                        key={seat.id}
                        variant="outline"
                        size="sm"
                        className={`h-8 w-full text-xs transition-all ${getSeatColor(seat.status)}`}
                        onClick={() => handleSeatClick(seat.id)}
                        disabled={seat.status === 'booked'}
                      >
                        {seat.number}
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
                {selectedSeats.map(seat => (
                  <Badge key={seat.id} variant="secondary">
                    Seat {seat.number}
                  </Badge>
                ))}
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-muted-foreground">
                  Total: ₹{selectedSeats.length * 450}
                </span>
                <Button size="sm">
                  Proceed to Book
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SeatMap;