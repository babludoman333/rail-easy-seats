import { useState } from "react";
import { CalendarDays, MapPin, ArrowRightLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const TrainSearchForm = () => {
  const [searchData, setSearchData] = useState({
    from: "",
    to: "",
    date: "",
    class: ""
  });

  const handleSwapStations = () => {
    setSearchData(prev => ({
      ...prev,
      from: prev.to,
      to: prev.from
    }));
  };

  const handleSearch = () => {
    console.log("Searching trains:", searchData);
    // TODO: Implement search functionality
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Find Your Train</CardTitle>
        <p className="text-muted-foreground">Search and book railway tickets with ease</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          {/* From Station */}
          <div className="space-y-2">
            <Label htmlFor="from" className="text-sm font-medium">From</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="from"
                placeholder="Source Station"
                className="pl-10"
                value={searchData.from}
                onChange={(e) => setSearchData(prev => ({ ...prev, from: e.target.value }))}
              />
            </div>
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
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="to"
                placeholder="Destination Station"
                className="pl-10"
                value={searchData.to}
                onChange={(e) => setSearchData(prev => ({ ...prev, to: e.target.value }))}
              />
            </div>
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
                value={searchData.date}
                onChange={(e) => setSearchData(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
          </div>

          {/* Class */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Class</Label>
            <Select value={searchData.class} onValueChange={(value) => setSearchData(prev => ({ ...prev, class: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sleeper">Sleeper (SL)</SelectItem>
                <SelectItem value="3ac">AC 3 Tier (3A)</SelectItem>
                <SelectItem value="2ac">AC 2 Tier (2A)</SelectItem>
                <SelectItem value="1ac">AC 1 Tier (1A)</SelectItem>
                <SelectItem value="cc">Chair Car (CC)</SelectItem>
              </SelectContent>
            </Select>
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