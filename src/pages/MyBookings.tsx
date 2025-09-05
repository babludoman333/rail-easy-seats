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
    doc.text(booking.booking_id.toString(), 135, 30);
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
    doc.text(`🚆 Train: ${booking.trains?.name || 'Unknown'} (${booking.trains?.number || 'N/A'})`, 20, 80);
    doc.text(`📍 Route: ${booking.trains?.stations_from?.name || 'Unknown'} → ${booking.trains?.stations_to?.name || 'Unknown'}`, 20, 90);
    doc.text(`🕐 Departure: ${booking.trains?.departure_time || 'N/A'} | Arrival: ${booking.trains?.arrival_time || 'N/A'}`, 20, 100);
    
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
    doc.text(`Name: ${booking.passenger_name}`, 20, 145);
    doc.text(`Age: ${booking.passenger_age} years`, 110, 145);
    doc.text(`Gender: ${booking.passenger_gender}`, 20, 155);
    doc.text(`Class: ${booking.class}`, 110, 155);
    doc.text(`Coach: ${booking.coach}`, 20, 165);
    doc.text(`Seat(s): ${booking.seat_numbers.join(', ')}`, 110, 165);
    
    // Journey Date highlight
    doc.setFillColor(255, 235, 59);
    doc.rect(15, 180, 180, 15, 'F');
    doc.setFontSize(14);
    doc.setTextColor(68, 68, 68);
    doc.text(`📅 Journey Date: ${new Date(booking.journey_date).toLocaleDateString('en-IN')}`, 20, 190);
    
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
    doc.text(`Amount Paid: ₹${booking.total_amount}`, 20, 220);
    doc.text(`Status: ${booking.status.toUpperCase()}`, 110, 220);
    
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
    
    doc.save(`RailEase-Ticket-${booking.booking_id}.pdf`);
    
    toast({
      title: "Success",
      description: "Professional ticket downloaded successfully"
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