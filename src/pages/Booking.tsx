import { useState, useEffect } from "react";
import { ArrowLeft, CreditCard, Check, Users, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/Header";
import IndianRailSeatMap from "@/components/booking/IndianRailSeatMap";

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const trainData = location.state?.train;
  
  const [step, setStep] = useState(1); // 1: seat selection, 2: passenger details, 3: confirm
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [selectedCoach, setSelectedCoach] = useState("S1");
  const [selectedClass, setSelectedClass] = useState("Sleeper");
  const [journeyDate, setJourneyDate] = useState("");
  const [passengerData, setPassengerData] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    email: user?.email || ""
  });

  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to continue booking",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }
    
    if (!trainData) {
      toast({
        title: "No Train Selected",
        description: "Please select a train from search results",
        variant: "destructive"
      });
      navigate('/');
      return;
    }
  }, [user, trainData, navigate, toast]);

  if (!trainData || !user) {
    return null;
  }

  // Get class-specific price
  const getClassPrice = () => {
    const classCode = getClassCode(selectedClass);
    return trainData.class_prices?.[classCode] || trainData.price;
  };

  const getClassCode = (className: string) => {
    const classMap: Record<string, string> = {
      'AC First Class': '1A',
      'AC Two-Tier': '2A', 
      'AC Three-Tier': '3A',
      'AC Three-Tier Economy': '3E',
      'Sleeper': 'SL',
      'Chair Car': 'CC',
      'Executive Chair Car': 'EC',
      'Second Sitting': '2S'
    };
    return classMap[className] || 'SL';
  };

  const totalAmount = selectedSeats.length * getClassPrice() + 50; // Class-specific fare + booking fee

  const handleSeatSelection = (seats: string[]) => {
    setSelectedSeats(seats);
  };

  const handleClassSelection = (classType: string) => {
    setSelectedClass(classType);
  };

  const handlePassengerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSeats.length === 0) {
      toast({
        title: "No Seats Selected",
        description: "Please select at least one seat",
        variant: "destructive"
      });
      return;
    }
    setStep(3);
  };

  const handleConfirmBooking = () => {
    const bookingData = {
      train: trainData,
      selectedSeats,
      selectedCoach,
      selectedClass,
      journeyDate,
      passenger: passengerData,
      totalAmount,
      classPrice: getClassPrice()
    };
    
    navigate('/payment', { state: bookingData });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Back button */}
          <Button variant="ghost" className="mb-6" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Search
          </Button>

          {/* Progress indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                1
              </div>
              <div className={`h-1 w-16 ${step >= 2 ? 'bg-primary' : 'bg-muted'}`}></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                2
              </div>
              <div className={`h-1 w-16 ${step >= 3 ? 'bg-primary' : 'bg-muted'}`}></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                3
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2">
              {step === 1 && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Select Your Seats</CardTitle>
                    </CardHeader>
                  </Card>
                  
                  <IndianRailSeatMap
                    trainId={trainData.id} 
                    selectedCoach={selectedCoach}
                    onSeatSelect={handleSeatSelection}
                    selectedSeats={selectedSeats}
                    selectedClass={selectedClass}
                    onClassSelect={handleClassSelection}
                    selectedDate={journeyDate ? new Date(journeyDate) : new Date()}
                    onDateSelect={(date) => setJourneyDate(date.toISOString().split('T')[0])}
                  />
                  
                  {selectedSeats.length > 0 && (
                    <div className="flex justify-end">
                      <Button onClick={() => setStep(2)} className="px-8">
                        Continue to Passenger Details
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {step === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Passenger Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePassengerSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            placeholder="Enter full name"
                            value={passengerData.name}
                            onChange={(e) => setPassengerData(prev => ({ ...prev, name: e.target.value }))}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="age">Age</Label>
                          <Input
                            id="age"
                            type="number"
                            placeholder="Age"
                            value={passengerData.age}
                            onChange={(e) => setPassengerData(prev => ({ ...prev, age: e.target.value }))}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="gender">Gender</Label>
                          <Select value={passengerData.gender} onValueChange={(value) => setPassengerData(prev => ({ ...prev, gender: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            placeholder="Enter phone number"
                            value={passengerData.phone}
                            onChange={(e) => setPassengerData(prev => ({ ...prev, phone: e.target.value }))}
                            required
                          />
                        </div>
                      </div>

                      <Button type="submit" className="w-full">
                        Review Booking
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}

              {step === 3 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Review & Confirm Booking</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold">Journey Details</h3>
                      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                        <div className="text-center">
                          <div className="font-semibold">{trainData.departure_time}</div>
                          <div className="text-sm text-muted-foreground">{trainData.from_station?.name}</div>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span className="text-sm">{trainData.duration}</span>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold">{trainData.arrival_time}</div>
                          <div className="text-sm text-muted-foreground">{trainData.to_station?.name}</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold">Passenger Information</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm text-muted-foreground">Name:</span>
                          <div className="font-medium">{passengerData.name}</div>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Age/Gender:</span>
                          <div className="font-medium">{passengerData.age} / {passengerData.gender}</div>
                        </div>
                      </div>
                    </div>

                    <Button onClick={handleConfirmBooking} className="w-full">
                      Proceed to Payment - ₹{totalAmount.toLocaleString()}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Booking summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="font-medium">{trainData.name}</p>
                    <Badge variant="outline" className="mt-1">{trainData.number}</Badge>
                    <p className="text-sm text-muted-foreground mt-2">
                      {trainData.from_station?.name} → {trainData.to_station?.name}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {trainData.departure_time} - {trainData.arrival_time}
                      </div>
                    </div>
                    {journeyDate && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Journey: {new Date(journeyDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  <Separator />

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Class:</span>
                        <Badge variant="outline">{selectedClass}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Coach:</span>
                        <Badge variant="outline">{selectedCoach}</Badge>
                      </div>
                    <div className="flex justify-between">
                      <span>Seats:</span>
                      <span className="font-medium">
                        {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None selected"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Passengers:</span>
                      <span>{selectedSeats.length}</span>
                    </div>
                  </div>

                  {selectedSeats.length > 0 && (
                    <>
                      <Separator />
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Base Fare ({selectedClass}):</span>
                          <span>₹{(selectedSeats.length * getClassPrice()).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Booking Fee:</span>
                          <span>₹50</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg">
                          <span>Total:</span>
                          <span>₹{totalAmount.toLocaleString()}</span>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;