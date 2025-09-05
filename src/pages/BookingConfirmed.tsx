import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { CheckCircle, Download, Home, Calendar, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import jsPDF from 'jspdf';
import trainLogo from '@/assets/train-logo.png';

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
      // Validate required data
      if (!bookingData.journeyDate || !bookingData.train?.id || !user?.id || !bookingData.bookingId) {
        console.error('Missing required booking data:', {
          journeyDate: bookingData.journeyDate,
          trainId: bookingData.train?.id,
          userId: user?.id,
          bookingId: bookingData.bookingId
        });
        toast({
          title: "Error",
          description: "Missing required booking information",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          train_id: bookingData.train.id,
          booking_id: bookingData.bookingId,
          passenger_name: bookingData.passenger.name,
          passenger_age: parseInt(bookingData.passenger.age),
          passenger_gender: bookingData.passenger.gender,
          journey_date: bookingData.journeyDate,
          seat_numbers: bookingData.selectedSeats,
          coach: bookingData.selectedCoach,
          class: bookingData.selectedClass || 'Sleeper',
          class_price: bookingData.classPrice || 0,
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
      } else {
        console.log('Booking saved successfully');
      }
    } catch (error) {
      console.error('Error saving booking:', error);
      toast({
        title: "Warning", 
        description: "Booking confirmed but not saved to database",
        variant: "destructive"
      });
    }
  };

  const downloadTicket = (booking: any) => {
    const doc = new jsPDF();
    
    // Professional header with gradient background
    doc.setFillColor(34, 85, 136);
    doc.rect(0, 0, 210, 40, 'F');
    
    // Company name and branding
    doc.setFontSize(28);
    doc.setTextColor(255, 255, 255);
    doc.text('RailEase', 20, 22);
    doc.setFontSize(12);
    doc.text('Your Premium Railway Booking Partner', 20, 32);
    
    // Professional border
    doc.setDrawColor(34, 85, 136);
    doc.setLineWidth(2);
    doc.rect(5, 5, 200, 287, 'S');
    
    // PNR Section with enhanced design
    doc.setFillColor(245, 245, 245);
    doc.rect(130, 8, 70, 30, 'F');
    doc.setDrawColor(34, 85, 136);
    doc.rect(130, 8, 70, 30, 'S');
    
    doc.setFontSize(10);
    doc.setTextColor(34, 85, 136);
    doc.text('PNR NUMBER', 135, 18);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(booking.bookingId.toString(), 135, 30);
    doc.setFont('helvetica', 'normal');
    
    // Status badge
    doc.setFillColor(34, 139, 34);
    doc.rect(135, 42, 25, 8, 'F');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text('CONFIRMED', 137, 48);
    
    // Journey Details Section with icon-style headers
    doc.setFontSize(16);
    doc.setTextColor(34, 85, 136);
    doc.text('🚂 Journey Details', 20, 60);
    
    // Decorative line
    doc.setDrawColor(34, 85, 136);
    doc.setLineWidth(1);
    doc.line(20, 63, 190, 63);
    
    // Journey info in card style
    doc.setFillColor(250, 250, 250);
    doc.rect(15, 70, 180, 35, 'F');
    doc.setDrawColor(220, 220, 220);
    doc.rect(15, 70, 180, 35, 'S');
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`🚆 Train: ${booking.train?.name || 'Unknown'} (${booking.train?.number || 'N/A'})`, 20, 80);
    doc.text(`📍 Route: ${booking.train?.from_station?.name || 'Unknown'} → ${booking.train?.to_station?.name || 'Unknown'}`, 20, 90);
    doc.text(`🕐 Departure: ${booking.train?.departure_time || 'N/A'} | Arrival: ${booking.train?.arrival_time || 'N/A'}`, 20, 100);
    
    // Passenger Details Section
    doc.setFontSize(16);
    doc.setTextColor(34, 85, 136);
    doc.text('👤 Passenger & Seat Information', 20, 125);
    doc.line(20, 128, 190, 128);
    
    // Passenger card
    doc.setFillColor(248, 249, 250);
    doc.rect(15, 135, 180, 40, 'F');
    doc.setDrawColor(220, 220, 220);
    doc.rect(15, 135, 180, 40, 'S');
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Name: ${booking.passenger.name}`, 20, 145);
    doc.text(`Age: ${booking.passenger.age} years`, 110, 145);
    doc.text(`Gender: ${booking.passenger.gender}`, 20, 155);
    doc.text(`Class: ${booking.selectedClass}`, 110, 155);
    doc.text(`Coach: ${booking.selectedCoach}`, 20, 165);
    doc.text(`Seat(s): ${booking.selectedSeats.join(', ')}`, 110, 165);
    
    // Journey Date highlight
    doc.setFillColor(255, 235, 59);
    doc.rect(15, 180, 180, 15, 'F');
    doc.setFontSize(14);
    doc.setTextColor(68, 68, 68);
    doc.text(`📅 Journey Date: ${new Date(booking.journeyDate).toLocaleDateString('en-IN')}`, 20, 190);
    
    // Payment Section
    doc.setFillColor(232, 245, 233);
    doc.rect(15, 200, 180, 25, 'F');
    doc.setDrawColor(76, 175, 80);
    doc.rect(15, 200, 180, 25, 'S');
    
    doc.setFontSize(14);
    doc.setTextColor(34, 85, 136);
    doc.text('💳 Payment Information', 20, 215);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Amount Paid: ₹${booking.totalAmount}`, 20, 220);
    doc.text(`Payment Method: ${booking.paymentMethod}`, 110, 220);
    
    // QR Code placeholder
    doc.setFillColor(240, 240, 240);
    doc.rect(160, 230, 30, 30, 'F');
    doc.setDrawColor(200, 200, 200);
    doc.rect(160, 230, 30, 30, 'S');
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text('QR Code', 170, 248);
    
    // Important Instructions with icons
    doc.setFontSize(14);
    doc.setTextColor(220, 38, 127);
    doc.text('⚠️ Important Travel Instructions', 20, 235);
    
    doc.setFontSize(9);
    doc.setTextColor(68, 68, 68);
    doc.text('📋 Please carry original photo ID proof (Aadhaar, PAN, Passport, Driving License)', 20, 245);
    doc.text('🕐 Arrive at station 30 minutes before departure time', 20, 252);
    doc.text('🎫 This e-ticket is valid for travel without printout', 20, 259);
    doc.text('📞 Customer Care: 139 (24x7) | Emergency: 112', 20, 266);
    
    // Professional footer
    doc.setFillColor(34, 85, 136);
    doc.rect(0, 275, 210, 22, 'F');
    
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text('🚆 RailEase - Connecting India, One Journey at a Time', 20, 287);
    doc.setFontSize(8);
    doc.text(`Generated: ${new Date().toLocaleString('en-IN')} | This is a computer-generated document`, 20, 292);
    
    doc.save(`RailEase-Ticket-${booking.bookingId}.pdf`);
    
    toast({
      title: "Success",
      description: "Professional ticket downloaded successfully"
    });
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
        <div className="text-center mb-8 animate-fade-in">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4 animate-scale-in" />
          <h1 className="text-3xl font-bold mb-2 animate-fade-in">Booking Confirmed!</h1>
          <p className="text-muted-foreground animate-fade-in">
            Your train ticket has been booked successfully
          </p>
        </div>

        {/* Booking Details Card */}
        <Card className="mb-8 animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Booking Details</span>
              <Badge className="bg-green-500 hover:bg-green-600 animate-pulse">
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
          <Button variant="outline" className="flex items-center gap-2 hover-lift" onClick={() => downloadTicket(bookingData)}>
            <Download className="h-4 w-4" />
            Download Ticket
          </Button>
          <Button asChild className="hover-lift">
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