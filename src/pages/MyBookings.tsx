import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Train, Calendar, MapPin, Users, Download, ArrowLeft, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import jsPDF from 'jspdf';
import trainLogo from '@/assets/train-logo.png';

interface Booking {
  id: string;
  booking_id: string;
  passenger_name: string;
  passenger_age: number;
  passenger_gender: string;
  journey_date: string;
  seat_numbers: string[];
  coach: string;
  class: string;
  total_amount: number;
  status: string;
  created_at: string;
  trains: {
    name: string;
    number: string;
    departure_time: string;
    arrival_time: string;
    stations_from: { name: string; code: string } | null;
    stations_to: { name: string; code: string } | null;
  } | null;
}

const MyBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          trains (
            name,
            number,
            departure_time,
            arrival_time,
            stations_from:from_station_id (name, code),
            stations_to:to_station_id (name, code)
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Use type assertion to handle the Supabase return type
      const rawBookings = data as any[] || [];
      
      // Filter out bookings with invalid train data
      const validBookings = rawBookings.filter((booking: any) => {
        return booking.trains && 
               booking.trains.stations_from && 
               booking.trains.stations_to &&
               typeof booking.trains.stations_from === 'object' &&
               typeof booking.trains.stations_to === 'object' &&
               'name' in booking.trains.stations_from &&
               'name' in booking.trains.stations_to;
      });
      
      setBookings(validBookings as Booking[]);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        title: "Error",
        description: "Failed to fetch bookings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadTicket = (booking: Booking) => {
    const doc = new jsPDF();
    
    // Clean professional header
    doc.setFillColor(29, 78, 216);
    doc.rect(0, 0, 210, 45, 'F');
    
    // Company branding
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(28);
    doc.setTextColor(255, 255, 255);
    doc.text('RailEase', 20, 25);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text('Premium Railway Booking Solution', 20, 35);
    
    // Clean border
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(1);
    doc.rect(10, 10, 190, 277, 'S');
    
    // PNR Section
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
    doc.text(booking.booking_id.toString(), 130, 35);
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
    doc.text(`Train: ${booking.trains?.name || 'Unknown'}`, 20, 90);
    doc.setFont('helvetica', 'normal');
    doc.text(`Number: ${booking.trains?.number || 'N/A'}`, 140, 90);
    
    doc.text(`From: ${booking.trains?.stations_from?.name || 'Unknown'}`, 20, 100);
    doc.text(`To: ${booking.trains?.stations_to?.name || 'Unknown'}`, 20, 110);
    
    doc.text(`Departure: ${booking.trains?.departure_time || 'N/A'}`, 140, 100);
    doc.text(`Arrival: ${booking.trains?.arrival_time || 'N/A'}`, 140, 110);
    
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
    doc.text(`Name: ${booking.passenger_name}`, 20, 160);
    doc.text(`Age: ${booking.passenger_age} years`, 120, 160);
    doc.text(`Gender: ${booking.passenger_gender}`, 20, 170);
    doc.text(`Class: ${booking.class}`, 120, 170);
    doc.text(`Coach: ${booking.coach}`, 20, 180);
    doc.text(`Seat(s): ${booking.seat_numbers.join(', ')}`, 120, 180);
    
    // Journey Date - Highlighted
    doc.setFillColor(219, 234, 254);
    doc.rect(15, 190, 180, 15, 'F');
    doc.setDrawColor(59, 130, 246);
    doc.rect(15, 190, 180, 15, 'S');
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.text(`Journey Date: ${new Date(booking.journey_date).toLocaleDateString('en-IN', { 
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
    doc.text(`Amount Paid: ₹${booking.total_amount?.toLocaleString() || '0'}`, 20, 227);
    
    // QR code placeholder
    doc.setFillColor(243, 244, 246);
    doc.rect(145, 210, 40, 40, 'F');
    doc.setDrawColor(156, 163, 175);
    doc.rect(145, 210, 40, 40, 'S');
    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128);
    doc.text('Digital QR Code', 155, 230);
    doc.text('Scan for Details', 157, 237);
    
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
    doc.text('RailEase - Your Trusted Travel Partner', 20, 294);
    doc.text(`Generated: ${new Date().toLocaleString('en-IN')}`, 130, 294);
    
    doc.save(`RailEase-Ticket-${booking.booking_id}.pdf`);
    
    toast({
      title: "Success",
      description: "Professional ticket downloaded successfully!"
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-lg">Loading your bookings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Back to Home Button */}
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate('/')} className="text-sm hover:scale-105 transition-transform duration-200">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Bookings</h1>
          <p className="text-muted-foreground">View and manage your train reservations</p>
        </div>

        {bookings.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Train className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No bookings found</h3>
                <p className="text-muted-foreground mb-4">You haven't made any train reservations yet.</p>
                <Button onClick={() => navigate('/')} className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Book Your First Train
                </Button>
              </CardContent>
            </Card>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking, index) => (
              <Card key={booking.id} className="overflow-hidden hover-lift animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader className="bg-primary/5">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Train className="h-5 w-5 text-primary" />
                      {booking.trains?.name || 'Unknown Train'} - {booking.trains?.number || 'N/A'}
                    </CardTitle>
                    <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                      {booking.status.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Booking ID: {booking.booking_id}</p>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Route Information */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <MapPin className="h-4 w-4 text-primary" />
                        Route
                      </div>
                      <div className="text-sm">
                        <div>{booking.trains?.stations_from?.name || 'Unknown'}</div>
                        <div className="text-muted-foreground">↓</div>
                        <div>{booking.trains?.stations_to?.name || 'Unknown'}</div>
                      </div>
                    </div>

                    {/* Journey Details */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Calendar className="h-4 w-4 text-primary" />
                        Journey
                      </div>
                      <div className="text-sm">
                        <div>{new Date(booking.journey_date).toLocaleDateString()}</div>
                        <div className="text-muted-foreground">
                          {booking.trains?.departure_time || 'N/A'} - {booking.trains?.arrival_time || 'N/A'}
                        </div>
                      </div>
                    </div>

                    {/* Passenger Details */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Users className="h-4 w-4 text-primary" />
                        Passenger
                      </div>
                      <div className="text-sm">
                        <div>{booking.passenger_name}</div>
                        <div className="text-muted-foreground">
                          {booking.passenger_age}yr, {booking.passenger_gender}
                        </div>
                      </div>
                    </div>

                    {/* Seat Details */}
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Seat Details</div>
                      <div className="text-sm">
                        <div>Coach {booking.coach} - {booking.class}</div>
                        <div className="text-muted-foreground">
                          Seats: {booking.seat_numbers.join(', ')}
                        </div>
                        <div className="font-medium text-primary">₹{booking.total_amount}</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <Button 
                      onClick={() => downloadTicket(booking)}
                      variant="outline" 
                      className="flex items-center gap-2 hover-lift"
                    >
                      <Download className="h-4 w-4" />
                      Download Ticket
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;