import Header from "@/components/layout/Header";
import TrainSearchForm from "@/components/search/TrainSearchForm";
import SeatMap from "@/components/booking/SeatMap";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Users } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  // Mock train search results
  const mockTrains = [
    {
      id: 1,
      number: "12345",
      name: "Rajdhani Express",
      from: "New Delhi",
      to: "Mumbai Central", 
      departure: "16:55",
      arrival: "08:35",
      duration: "15h 40m",
      price: 2499,
      available: 23
    },
    {
      id: 2,
      number: "12951",
      name: "Mumbai Rajdhani",
      from: "New Delhi",
      to: "Mumbai Central",
      departure: "17:20",
      arrival: "09:05", 
      duration: "15h 45m",
      price: 2699,
      available: 8
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-16 px-4 bg-gradient-to-r from-primary to-primary-hover">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-4">
            Smart Railway Booking
          </h1>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Experience seamless train booking with interactive seat selection and real-time availability
          </p>
        </div>
      </section>

      {/* Search Form */}
      <section className="py-12 px-4 -mt-8 relative z-10">
        <div className="container mx-auto">
          <TrainSearchForm />
        </div>
      </section>

      {/* Search Results */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold mb-6">Available Trains</h2>
          <div className="space-y-4">
            {mockTrains.map((train) => (
              <Card key={train.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{train.name}</h3>
                        <Badge variant="outline">{train.number}</Badge>
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {train.from} → {train.to}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {train.departure} - {train.arrival}
                        </div>
                        <div>Duration: {train.duration}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-2xl font-bold">₹{train.price.toLocaleString()}</div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        {train.available} seats
                      </div>
                    </div>
                    <Link to="/booking">
                      <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors">
                        Book Now
                      </button>
                    </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Seat Selection Demo */}
      <section className="py-12 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">Interactive Seat Selection</h2>
          <div className="max-w-4xl mx-auto">
            <SeatMap />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
