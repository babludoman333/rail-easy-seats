import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { CheckCircle, Download, Home, Calendar, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const BookingConfirmed = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const bookingData = location.state;

  useEffect(() => {
    if (bookingData && user) {
      saveBookingToDatabase();
    }
  }, [bookingData, user]);

  const saveBookingToDatabase = async () => {
    try {
      const { error } = await supabase
        .from('bookings')
        .insert({
          user_id: user?.id,
          train_id: bookingData.train.id,
          booking_id: bookingData.bookingId,
          passenger_name: bookingData.passenger.name,
          passenger_age: parseInt(bookingData.passenger.age),
          passenger_gender: bookingData.passenger.gender,
          journey_date: bookingData.journeyDate,
          seat_numbers: bookingData.selectedSeats,
          coach: bookingData.selectedCoach,
          class: bookingData.selectedClass || 'Sleeper',
          total_amount: bookingData.totalAmount,
          status: 'confirmed'
        });

      if (error) {
        console.error('Error saving booking:', error);
        toast({
          title: "Warning",
          description: "Booking confirmed but not saved to database",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error saving booking:', error);
    }
  };

  if (!bookingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card>
          <CardContent className="text-center p-8">
            <p className="text-muted-foreground mb-4">No booking data found</p>
            <Button asChild>
              <Link to="/">Go Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="container mx-auto max-w-2xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
          <p className="text-muted-foreground">
            Your train ticket has been booked successfully
          </p>
        </div>

        {/* Booking Details Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Booking Details</span>
              <Badge className="bg-green-500 hover:bg-green-600">
                {bookingData.bookingId}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Train Information */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">{bookingData.train.name}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{bookingData.train.number}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{bookingData.journeyDate}</span>
                </div>
              </div>
            </div>

            {/* Route Information */}
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="text-center">
                <div className="font-semibold">{bookingData.train.departure_time}</div>
                <div className="text-sm text-muted-foreground">{bookingData.train.from_station?.name}</div>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{bookingData.train.duration}</span>
              </div>
              <div className="text-center">
                <div className="font-semibold">{bookingData.train.arrival_time}</div>
                <div className="text-sm text-muted-foreground">{bookingData.train.to_station?.name}</div>
              </div>
            </div>

            {/* Passenger and Seat Details */}
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Passenger:</span>
                <span className="font-medium">{bookingData.passenger.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Age/Gender:</span>
                <span>{bookingData.passenger.age} / {bookingData.passenger.gender}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Class:</span>
                <span>{bookingData.selectedClass || 'Sleeper'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Coach:</span>
                <span>{bookingData.selectedCoach}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Seats:</span>
                <div className="flex gap-2">
                  {bookingData.selectedSeats.map((seat: string) => (
                    <Badge key={seat} variant="secondary">{seat}</Badge>
                  ))}
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Method:</span>
                <span className="capitalize">{bookingData.paymentMethod}</span>
              </div>
            </div>

            {/* Total Amount */}
            <div className="border-t pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total Paid:</span>
                <span className="text-green-600">₹{bookingData.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download Ticket
          </Button>
          <Button asChild>
            <Link to="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Additional Information */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-3">Important Information</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• Please carry a valid ID proof while traveling</li>
              <li>• Arrive at the station at least 30 minutes before departure</li>
              <li>• Cancellation charges apply as per railway rules</li>
              <li>• Keep your booking ID safe for any future reference</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookingConfirmed;