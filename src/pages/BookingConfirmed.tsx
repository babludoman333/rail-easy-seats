import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { CheckCircle, Download, Home, Calendar, MapPin, Users, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import jsPDF from 'jspdf';
import QRCode from 'qrcode';
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

      // Save cab booking if exists
      if (bookingData.cabBooking) {
        const { error: cabError } = await supabase
          .from('cab_bookings')
          .insert({
            booking_id: bookingData.bookingId,
            user_id: user.id,
            vehicle_type: bookingData.cabBooking.vehicleType,
            pickup_location: bookingData.cabBooking.pickupLocation,
            drop_location: bookingData.cabBooking.dropLocation,
            price: bookingData.cabBooking.price,
            status: 'pending'
          });

        if (cabError) {
          console.error('Error saving cab booking:', cabError);
        }
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

  const downloadTicket = async (booking: any) => {
    const doc = new jsPDF();
    
    // Prepare QR code data with journey details
    const qrData = JSON.stringify({
      pnr: booking.bookingId,
      train: {
        name: booking.train?.name,
        number: booking.train?.number
      },
      passenger: {
        name: booking.passenger.name,
        age: booking.passenger.age,
        gender: booking.passenger.gender
      },
      journey: {
        from: booking.train?.from_station?.name,
        to: booking.train?.to_station?.name,
        date: booking.journeyDate,
        departure: booking.train?.departure_time,
        arrival: booking.train?.arrival_time
      },
      seat: {
        coach: booking.selectedCoach,
        class: booking.selectedClass || 'Sleeper',
        numbers: booking.selectedSeats
      },
      amount: booking.totalAmount,
      status: 'confirmed'
    });

    // Generate QR code
    const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
      width: 150,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    
    // Clean professional header
    doc.setFillColor(29, 78, 216);
    doc.rect(0, 0, 210, 45, 'F');
    
    // Company branding with better contrast
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(28);
    doc.setTextColor(255, 255, 255);
    doc.text('Nxt Journey', 20, 25);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text('Premium Railway Booking Solution', 20, 35);
    
    // Clean border
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(1);
    doc.rect(10, 10, 190, 277, 'S');
    
    // PNR Section - Clean design
    doc.setFillColor(248, 250, 252);
    doc.rect(125, 15, 70, 25, 'F');
    doc.setDrawColor(203, 213, 225);
    doc.rect(125, 15, 70, 25, 'S');
    
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text('PNR NUMBER', 130, 23);
    doc.setFontSize(16);
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.text(booking.bookingId.toString(), 130, 35);
    doc.setFont('helvetica', 'normal');
    
    // Status badge
    doc.setFillColor(34, 197, 94);
    doc.rect(130, 43, 30, 10, 'F');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('CONFIRMED', 134, 50);
    doc.setFont('helvetica', 'normal');
    
    // Journey Details Header
    doc.setFontSize(16);
    doc.setTextColor(29, 78, 216);
    doc.setFont('helvetica', 'bold');
    doc.text('Journey Details', 20, 70);
    doc.setFont('helvetica', 'normal');
    
    // Separator line
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.5);
    doc.line(20, 74, 190, 74);
    
    // Journey information card
    doc.setFillColor(249, 250, 251);
    doc.rect(15, 80, 180, 40, 'F');
    doc.setDrawColor(229, 231, 235);
    doc.rect(15, 80, 180, 40, 'S');
    
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.text(`Train: ${booking.train?.name || 'Unknown'}`, 20, 90);
    doc.setFont('helvetica', 'normal');
    doc.text(`Number: ${booking.train?.number || 'N/A'}`, 140, 90);
    
    doc.text(`From: ${booking.train?.from_station?.name || 'Unknown'}`, 20, 100);
    doc.text(`To: ${booking.train?.to_station?.name || 'Unknown'}`, 20, 110);
    
    doc.text(`Departure: ${booking.train?.departure_time || 'N/A'}`, 140, 100);
    doc.text(`Arrival: ${booking.train?.arrival_time || 'N/A'}`, 140, 110);
    
    // Passenger Information Header
    doc.setFontSize(16);
    doc.setTextColor(29, 78, 216);
    doc.setFont('helvetica', 'bold');
    doc.text('Passenger Information', 20, 140);
    doc.setFont('helvetica', 'normal');
    
    doc.setDrawColor(203, 213, 225);
    doc.line(20, 144, 190, 144);
    
    // Passenger details card
    doc.setFillColor(254, 249, 195);
    doc.rect(15, 150, 180, 35, 'F');
    doc.setDrawColor(251, 191, 36);
    doc.rect(15, 150, 180, 35, 'S');
    
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text(`Name: ${booking.passenger.name}`, 20, 160);
    doc.text(`Age: ${booking.passenger.age} years`, 120, 160);
    doc.text(`Gender: ${booking.passenger.gender}`, 20, 170);
    doc.text(`Class: ${booking.selectedClass || 'Sleeper'}`, 120, 170);
    doc.text(`Coach: ${booking.selectedCoach}`, 20, 180);
    doc.text(`Seat(s): ${booking.selectedSeats.join(', ')}`, 120, 180);
    
    // Journey Date - Highlighted
    doc.setFillColor(219, 234, 254);
    doc.rect(15, 190, 180, 15, 'F');
    doc.setDrawColor(59, 130, 246);
    doc.rect(15, 190, 180, 15, 'S');
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.text(`Journey Date: ${new Date(booking.journeyDate).toLocaleDateString('en-IN', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })}`, 20, 200);
    doc.setFont('helvetica', 'normal');
    
    // Payment Information
    doc.setFillColor(220, 252, 231);
    doc.rect(15, 210, 120, 20, 'F');
    doc.setDrawColor(34, 197, 94);
    doc.rect(15, 210, 120, 20, 'S');
    
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.text('Payment Details', 20, 220);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text(`Amount Paid: ₹${booking.totalAmount?.toLocaleString() || '0'}`, 20, 227);
    
    // Add QR code with border
    doc.setDrawColor(156, 163, 175);
    doc.setLineWidth(1);
    doc.rect(145, 210, 40, 40, 'S');
    doc.addImage(qrCodeDataUrl, 'PNG', 147, 212, 36, 36);
    doc.setFontSize(7);
    doc.setTextColor(107, 114, 128);
    doc.text('Scan for Details', 153, 253);
    
    // Important Instructions
    doc.setFontSize(14);
    doc.setTextColor(220, 38, 127);
    doc.setFont('helvetica', 'bold');
    doc.text('Travel Instructions', 20, 265);
    doc.setFont('helvetica', 'normal');
    
    doc.setFontSize(9);
    doc.setTextColor(55, 65, 81);
    doc.text('• Carry valid photo ID (Aadhaar/PAN/Passport/DL) during travel', 20, 272);
    doc.text('• Arrive 30 minutes before departure • Valid for travel without print', 20, 278);
    
    // Clean footer
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 287, 210, 10, 'F');
    
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text('Nxt Journey - Your Trusted Travel Partner', 20, 294);
    doc.text(`Generated: ${new Date().toLocaleString('en-IN')}`, 130, 294);
    
    doc.save(`NxtJourney-Ticket-${booking.bookingId}.pdf`);
    
    toast({
      title: "Success",
      description: "Professional ticket downloaded successfully!"
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

        {/* Cab Booking Details */}
        {bookingData.cabBooking && (
          <Card className="mb-8 animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                Cab Booking Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Vehicle Type:</span>
                <span className="font-medium">{bookingData.cabBooking.vehicleType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pickup Location:</span>
                <span className="font-medium">{bookingData.cabBooking.pickupLocation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Drop Location:</span>
                <span className="font-medium">{bookingData.cabBooking.dropLocation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <Badge variant="outline" className="bg-yellow-100">Pending Driver Assignment</Badge>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Cab Fare:</span>
                  <span className="text-primary">₹{bookingData.cabBooking.price.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

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