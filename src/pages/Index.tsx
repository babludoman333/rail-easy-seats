import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import TrainSearchForm from "@/components/search/TrainSearchForm";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import vandeBharatHero from "@/assets/vande-bharat-hero.jpg";
import trainsStationBg from "@/assets/trains-station-bg.jpg";
import trainImage1 from "@/assets/train-image-1.jpg";
import trainImage2 from "@/assets/train-image-2.jpg";
import trainImage3 from "@/assets/train-image-3.jpg";

interface Station {
  id: string;
  name: string;
  code: string;
  city: string;
  state: string;
}

interface Train {
  id: string;
  number: string;
  name: string;
  from_station_id: string;
  to_station_id: string;
  departure_time: string;
  arrival_time: string;
  duration: string;
  price: number;
  total_seats: number;
  operating_days?: string[];
  class_prices?: any;
  from_station?: Station;
  to_station?: Station;
}

const Index = () => {
  const [searchResults, setSearchResults] = useState<Train[]>([]);
  const [isSearched, setIsSearched] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const rotatingImages = [trainImage1, trainImage2, trainImage3, vandeBharatHero];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % rotatingImages.length
      );
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-16 px-4 bg-gradient-to-r from-primary to-primary-hover overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60 transition-all duration-1000"
          style={{ backgroundImage: `url(${rotatingImages[currentImageIndex]})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary-hover/80" />
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-4 animate-fade-in">
            Smart Railway Booking
          </h1>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto animate-fade-in">
            Experience seamless train booking with interactive seat selection and real-time availability
          </p>
        </div>
      </section>

      {/* Search Form */}
      <section className="py-12 px-4 -mt-8 relative z-10">
        <div className="container mx-auto">
          <div className="animate-scale-in">
            <TrainSearchForm onSearch={setSearchResults} onSearchStart={() => setIsSearched(true)} />
          </div>
        </div>
      </section>

      {/* Search Results */}
      {isSearched && (
        <section className="py-8 px-4">
          <div className="container mx-auto">
            <h2 className="text-2xl font-bold mb-6">
              {searchResults.length > 0 ? "Available Trains" : "No trains found"}
            </h2>
            <div className="space-y-4">
              {searchResults.map((train, index) => (
                <Card key={train.id} className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
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
                            {train.from_station?.name} → {train.to_station?.name}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {train.departure_time} - {train.arrival_time}
                          </div>
                          <div>Duration: {train.duration}</div>
                        </div>
                        {train.operating_days && (
                          <div className="mt-2">
                            <div className="text-xs text-muted-foreground mb-1">Operating Days:</div>
                            <div className="flex flex-wrap gap-1">
                              {train.operating_days.map((day, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {day.slice(0, 3)}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          {train.class_prices ? (
                            <div>
                              <div className="text-2xl font-bold">
                                ₹{Math.min(...Object.values(train.class_prices as Record<string, number>)).toLocaleString()} 
                                - ₹{Math.max(...Object.values(train.class_prices as Record<string, number>)).toLocaleString()}
                              </div>
                              <div className="text-xs text-muted-foreground">Price range by class</div>
                            </div>
                          ) : (
                            <div className="text-2xl font-bold">₹{train.price.toLocaleString()}</div>
                          )}
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                            <Users className="h-4 w-4" />
                            {train.total_seats} seats
                          </div>
                        </div>
                        <Link to="/booking" state={{ train }}>
                          <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-300 hover:scale-105 hover:shadow-lg">
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
      )}
    </div>
  );
};

export default Index;
