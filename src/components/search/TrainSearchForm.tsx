import { useState, useEffect } from "react";
import { CalendarDays, MapPin, ArrowRightLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  operating_days: string[];
  class_prices: any;
  from_station?: Station;
  to_station?: Station;
}

interface TrainSearchFormProps {
  onSearch: (trains: Train[]) => void;
  onSearchStart: () => void;
}

const TrainSearchForm = ({ onSearch, onSearchStart }: TrainSearchFormProps) => {
  const [searchData, setSearchData] = useState({
    from: "",
    to: "",
    date: ""
  });
  const [stations, setStations] = useState<Station[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    const { data, error } = await supabase
      .from('stations')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching stations:', error);
      return;
    }
    
    setStations(data || []);
  };

  const handleSwapStations = () => {
    setSearchData(prev => ({
      ...prev,
      from: prev.to,
      to: prev.from
    }));
  };

  const handleSearch = async () => {
    if (!searchData.from || !searchData.to || !searchData.date) {
      toast({
        title: "Missing Information", 
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Check if selected date is in the future
    const selectedDate = new Date(searchData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      toast({
        title: "Invalid Date",
        description: "Please select a future date for your journey",
        variant: "destructive"
      });
      return;
    }

    onSearchStart();
    
    const { data, error } = await supabase
      .from('trains')
      .select(`
        *,
        from_station:stations!trains_from_station_id_fkey(*),
        to_station:stations!trains_to_station_id_fkey(*)
      `)
      .eq('from_station_id', searchData.from)
      .eq('to_station_id', searchData.to);
    
    if (error) {
      console.error('Error searching trains:', error);
      toast({
        title: "Search Error",
        description: "Failed to search for trains",
        variant: "destructive"
      });
      return;
    }
    
    // Filter trains based on operating days (reuse selectedDate)
    const dayName = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });
    
    const filteredTrains = (data || []).filter(train => 
      train.operating_days && train.operating_days.includes(dayName)
    );
    
    onSearch(filteredTrains);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Find Your Train</CardTitle>
        <p className="text-muted-foreground">Search and book railway tickets with ease</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          {/* From Station */}
          <div className="space-y-2">
            <Label htmlFor="from" className="text-sm font-medium">From</Label>
            <Select value={searchData.from} onValueChange={(value) => setSearchData(prev => ({ ...prev, from: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select source station" />
              </SelectTrigger>
              <SelectContent>
                {stations.map((station) => (
                  <SelectItem key={station.id} value={station.id}>
                    {station.name} ({station.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full p-2 h-10 w-10"
              onClick={handleSwapStations}
            >
              <ArrowRightLeft className="h-4 w-4" />
            </Button>
          </div>

          {/* To Station */}
          <div className="space-y-2">
            <Label htmlFor="to" className="text-sm font-medium">To</Label>
            <Select value={searchData.to} onValueChange={(value) => setSearchData(prev => ({ ...prev, to: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select destination station" />
              </SelectTrigger>
              <SelectContent>
                {stations.filter(station => station.id !== searchData.from).map((station) => (
                  <SelectItem key={station.id} value={station.id}>
                    {station.name} ({station.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm font-medium">Journey Date</Label>
            <div className="relative">
              <CalendarDays className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="date"
                type="date"
                className="pl-10"
                min={new Date().toISOString().split('T')[0]}
                value={searchData.date}
                onChange={(e) => setSearchData(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
          </div>
        </div>

        {/* Search Button */}
        <div className="flex justify-center pt-4">
          <Button
            onClick={handleSearch}
            size="lg"
            className="px-8 py-3 bg-gradient-to-r from-primary to-primary-hover hover:shadow-lg transition-all"
          >
            <Search className="h-5 w-5 mr-2" />
            Search Trains
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrainSearchForm;