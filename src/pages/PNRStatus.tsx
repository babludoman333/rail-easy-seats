import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/layout/Header";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface BookingDetails {
  id: string;
  booking_id: string;
  passenger_name: string;
  passenger_age: number;
  passenger_gender: string;
  journey_date: string;
  seat_numbers: string[];
  coach: string;
  class: string;
  class_price: number;
  total_amount: number;
  status: string;
  created_at: string;
  train: {
    name: string;
    number: string;
    departure_time: string;
    arrival_time: string;
    duration: string;
    from_station: {
      name: string;
      code: string;
      city: string;
    };
    to_station: {
      name: string;
      code: string;
      city: string;
    };
  };
}

const PNRStatus = () => {
  const [pnrNumber, setPnrNumber] = useState("");
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pnrNumber.trim()) {
      toast({
        title: "PNR Required",
        description: "Please enter a PNR number",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    setSearched(true);

    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          train:trains(
            name,
            number,
            departure_time,
            arrival_time,
            duration,
            from_station:stations!trains_from_station_id_fkey(name, code, city),
            to_station:stations!trains_to_station_id_fkey(name, code, city)
          )
        `)
        .eq('booking_id', pnrNumber.trim())
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          toast({
            title: "PNR Not Found",
            description: "No booking found with this PNR number",
            variant: "destructive"
          });
          setBookingDetails(null);
        } else {
          throw error;
        }
      } else {
        setBookingDetails(data as BookingDetails);
      }
    } catch (error) {
      console.error('Error fetching PNR details:', error);
      toast({
        title: "Error",
        description: "Failed to fetch PNR details. Please try again.",
        variant: "destructive"
      });
      setBookingDetails(null);
    } finally {
      setIsSearching(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-red-500';
      case 'pending':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">PNR Status Check</h1>
            <p className="text-muted-foreground">Enter your PNR number to check your booking details</p>
          </div>

          {/* Search Form */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Check PNR Status</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pnr">PNR Number</Label>
                  <div className="flex gap-2">
                    <Input
                      id="pnr"
                      placeholder="Enter 10-digit PNR number"
                      value={pnrNumber}
                      onChange={(e) => setPnrNumber(e.target.value)}
                      maxLength={10}
                      className="flex-1"
                    />
                    <Button type="submit" disabled={isSearching}>
                      <Search className="h-4 w-4 mr-2" />
                      {isSearching ? "Searching..." : "Search"}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Booking Details */}
          {searched && !bookingDetails && !isSearching && (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No booking found with this PNR number</p>
              </CardContent>
            </Card>
          )}

          {bookingDetails && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Booking Details</CardTitle>
                  <Badge className={getStatusColor(bookingDetails.status)}>
                    {bookingDetails.status.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* PNR and Booking Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">PNR Number</p>
                    <p className="text-lg font-semibold">{bookingDetails.booking_id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Booking Date</p>
                    <p className="text-lg font-semibold">
                      {new Date(bookingDetails.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Train Details */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Train Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <p className="text-xl font-bold">{bookingDetails.train.name}</p>
                      <Badge variant="outline">{bookingDetails.train.number}</Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">From</p>
                        <p className="font-semibold">{bookingDetails.train.from_station.name}</p>
                        <p className="text-sm text-muted-foreground">{bookingDetails.train.from_station.code}</p>
                        <p className="text-sm font-medium mt-1">{bookingDetails.train.departure_time}</p>
                      </div>
                      
                      <div className="flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">Duration</p>
                          <p className="font-semibold">{bookingDetails.train.duration}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground mb-1">To</p>
                        <p className="font-semibold">{bookingDetails.train.to_station.name}</p>
                        <p className="text-sm text-muted-foreground">{bookingDetails.train.to_station.code}</p>
                        <p className="text-sm font-medium mt-1">{bookingDetails.train.arrival_time}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Passenger Details */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Passenger Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="font-medium">{bookingDetails.passenger_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Age</p>
                      <p className="font-medium">{bookingDetails.passenger_age} years</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Gender</p>
                      <p className="font-medium capitalize">{bookingDetails.passenger_gender}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Journey Details */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Journey Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Journey Date</p>
                      <p className="font-medium">
                        {new Date(bookingDetails.journey_date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Class</p>
                      <p className="font-medium">{bookingDetails.class}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Coach</p>
                      <p className="font-medium">{bookingDetails.coach}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Seat Numbers</p>
                      <div className="flex flex-wrap gap-1">
                        {bookingDetails.seat_numbers.map((seat, index) => (
                          <Badge key={index} variant="secondary">{seat}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Fare Details */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Fare Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Base Fare</span>
                      <span className="font-medium">₹{(bookingDetails.class_price * bookingDetails.seat_numbers.length).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Booking Fee</span>
                      <span className="font-medium">₹50</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total Amount</span>
                      <span>₹{bookingDetails.total_amount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default PNRStatus;