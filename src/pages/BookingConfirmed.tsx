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
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Set page margins and dimensions
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 15;
    const contentWidth = pageWidth - (2 * margin);
    
    // Professional gradient header
    doc.setFillColor(28, 100, 242); // Modern blue
    doc.rect(0, 0, pageWidth, 50, 'F');
    
    // Add subtle gradient effect with overlays
    doc.setFillColor(28, 100, 242, 0.8);
    doc.rect(0, 0, pageWidth, 50, 'F');
    
    // Company branding
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(32);
    doc.setTextColor(255, 255, 255);
    doc.text('🚆 RailEase', margin, 25);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text('Your Premium Railway Booking Partner', margin, 35);
    
    // Booking confirmation badge
    doc.setFillColor(34, 197, 94); // Green
    doc.roundedRect(pageWidth - 80, 15, 65, 20, 3, 3, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text('CONFIRMED', pageWidth - 75, 27);
    
    // Main content border
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(1);
    doc.roundedRect(margin, 60, contentWidth, pageHeight - 120, 5, 5, 'S');
    
    // PNR Section - Enhanced
    const pnrY = 75;
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(margin + 10, pnrY, contentWidth - 20, 25, 3, 3, 'F');
    doc.setDrawColor(28, 100, 242);
    doc.setLineWidth(0.5);
    doc.roundedRect(margin + 10, pnrY, contentWidth - 20, 25, 3, 3, 'S');
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(75, 85, 99);
    doc.text('PNR NUMBER', margin + 15, pnrY + 10);
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(28, 100, 242);
    doc.text(booking.bookingId.toString(), margin + 15, pnrY + 20);
    
    // Train Details Card
    const trainY = 115;
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin + 5, trainY, contentWidth - 10, 45, 5, 5, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin + 5, trainY, contentWidth - 10, 45, 5, 5, 'S');
    
    // Train header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(28, 100, 242);
    doc.text('🚂 Journey Details', margin + 10, trainY + 12);
    
    // Train info
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(31, 41, 55);
    
    const trainName = booking.train?.name || 'Unknown Train';
    const trainNumber = booking.train?.number || 'N/A';
    doc.text(`Train: ${trainName} (${trainNumber})`, margin + 10, trainY + 25);
    
    const fromStation = booking.train?.from_station?.name || 'Unknown';
    const toStation = booking.train?.to_station?.name || 'Unknown';
    doc.text(`Route: ${fromStation} → ${toStation}`, margin + 10, trainY + 32);
    
    const depTime = booking.train?.departure_time || 'N/A';
    const arrTime = booking.train?.arrival_time || 'N/A';
    doc.text(`Departure: ${depTime} | Arrival: ${arrTime}`, margin + 10, trainY + 39);
    
    // Passenger Information Card
    const passengerY = 175;
    doc.setFillColor(252, 252, 252);
    doc.roundedRect(margin + 5, passengerY, contentWidth - 10, 50, 5, 5, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin + 5, passengerY, contentWidth - 10, 50, 5, 5, 'S');
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(28, 100, 242);
    doc.text('👤 Passenger & Seat Information', margin + 10, passengerY + 12);
    
    // Passenger details in two columns
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(31, 41, 55);
    
    // Left column
    doc.text(`Name: ${booking.passenger.name}`, margin + 10, passengerY + 25);
    doc.text(`Age: ${booking.passenger.age} years`, margin + 10, passengerY + 32);
    doc.text(`Gender: ${booking.passenger.gender}`, margin + 10, passengerY + 39);
    
    // Right column  
    doc.text(`Class: ${booking.selectedClass || 'Sleeper'}`, margin + 100, passengerY + 25);
    doc.text(`Coach: ${booking.selectedCoach}`, margin + 100, passengerY + 32);
    doc.text(`Seat(s): ${booking.selectedSeats.join(', ')}`, margin + 100, passengerY + 39);
    
    // Journey Date Highlight
    const dateY = 240;
    doc.setFillColor(254, 240, 138); // Yellow highlight
    doc.roundedRect(margin + 5, dateY, contentWidth - 10, 15, 3, 3, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(146, 64, 14); // Amber text
    const formattedDate = new Date(booking.journeyDate).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric', 
      month: 'long',
      day: 'numeric'
    });
    doc.text(`📅 Journey Date: ${formattedDate}`, margin + 10, dateY + 10);
    
    // Payment Information
    const paymentY = 270;
    doc.setFillColor(240, 253, 244); // Light green
    doc.roundedRect(margin + 5, paymentY, contentWidth - 60, 20, 3, 3, 'F');
    doc.setDrawColor(34, 197, 94);
    doc.setLineWidth(0.5);
    doc.roundedRect(margin + 5, paymentY, contentWidth - 60, 20, 3, 3, 'S');
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(22, 163, 74);
    doc.text('💳 Payment Information', margin + 10, paymentY + 8);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(31, 41, 55);
    doc.text(`Amount: ₹${booking.totalAmount.toLocaleString()}`, margin + 10, paymentY + 15);
    doc.text(`Method: ${booking.paymentMethod || 'Card'}`, margin + 80, paymentY + 15);
    
    // QR Code section
    const qrX = pageWidth - 55;
    doc.setFillColor(248, 248, 248);
    doc.roundedRect(qrX, paymentY, 35, 35, 3, 3, 'F');
    doc.setDrawColor(200, 200, 200);
    doc.roundedRect(qrX, paymentY, 35, 35, 3, 3, 'S');
    
    // QR placeholder pattern
    doc.setFillColor(100, 100, 100);
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        if ((i + j) % 2 === 0) {
          doc.rect(qrX + 3 + i * 5, paymentY + 3 + j * 5, 4, 4, 'F');
        }
      }
    }
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(120, 120, 120);
    doc.text('e-Ticket QR', qrX + 4, paymentY + 32);
    
    // Important Instructions
    const instructionsY = 315;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(220, 38, 127);
    doc.text('⚠️ Important Travel Instructions', margin, instructionsY);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(55, 65, 81);
    const instructions = [
      '📋 Carry original photo ID (Aadhaar/PAN/Passport/License)',
      '🕐 Arrive 30 minutes before departure',
      '🎫 E-ticket valid without printout',
      '📞 Customer Care: 139 | Emergency: 112'
    ];
    
    instructions.forEach((instruction, index) => {
      doc.text(instruction, margin, instructionsY + 10 + (index * 6));
    });
    
    // Professional footer
    doc.setFillColor(31, 41, 55);
    doc.rect(0, pageHeight - 25, pageWidth, 25, 'F');
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.text('🚆 RailEase - Connecting India, One Journey at a Time', margin, pageHeight - 15);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(200, 200, 200);
    const timestamp = new Date().toLocaleString('en-IN');
    doc.text(`Generated: ${timestamp} | This is a computer-generated ticket`, margin, pageHeight - 8);
    
    // Save the PDF
    doc.save(`RailEase-Ticket-${booking.bookingId}.pdf`);
    
    toast({
      title: "Success",
      description: "Professional e-ticket downloaded successfully!"
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