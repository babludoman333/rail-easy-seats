import { useState } from "react";
import { ArrowLeft, CreditCard, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/layout/Header";

const Booking = () => {
  const [step, setStep] = useState(1); // 1: passenger details, 2: payment, 3: confirmation
  const [passengerData, setPassengerData] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    email: ""
  });

  // Mock booking data
  const bookingDetails = {
    train: "12345 - Rajdhani Express",
    from: "New Delhi",
    to: "Mumbai Central",
    date: "15 Dec 2024",
    seats: ["S1-25", "S1-26"],
    class: "Sleeper",
    fare: 900
  };

  const handlePassengerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePayment = () => {
    // Mock payment processing
    setTimeout(() => {
      setStep(3);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <Button variant="ghost" className="mb-6" onClick={() => window.history.back()}>
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
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            placeholder="Enter phone number"
                            value={passengerData.phone}
                            onChange={(e) => setPassengerData(prev => ({ ...prev, phone: e.target.value }))}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="Enter email"
                            value={passengerData.email}
                            onChange={(e) => setPassengerData(prev => ({ ...prev, email: e.target.value }))}
                            required
                          />
                        </div>
                      </div>

                      <Button type="submit" className="w-full">
                        Continue to Payment
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}

              {step === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <CreditCard className="h-5 w-5" />
                        <span className="font-medium">Payment Simulation</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        This is a demo payment gateway. No actual payment will be processed.
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Card Number</Label>
                        <Input placeholder="1234 5678 9012 3456" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Expiry Date</Label>
                          <Input placeholder="MM/YY" />
                        </div>
                        <div className="space-y-2">
                          <Label>CVV</Label>
                          <Input placeholder="123" />
                        </div>
                      </div>
                    </div>

                    <Button onClick={handlePayment} className="w-full">
                      Pay ₹{bookingDetails.fare}
                    </Button>
                  </CardContent>
                </Card>
              )}

              {step === 3 && (
                <Card>
                  <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 bg-available rounded-full flex items-center justify-center mb-4">
                      <Check className="h-8 w-8 text-available-foreground" />
                    </div>
                    <CardTitle className="text-2xl">Booking Confirmed!</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <p className="font-medium">Booking ID</p>
                      <p className="text-2xl font-bold text-primary">RE{Date.now()}</p>
                    </div>
                    
                    <p className="text-muted-foreground">
                      Your ticket has been booked successfully. A confirmation email has been sent to your registered email address.
                    </p>
                    
                    <div className="flex gap-3 justify-center">
                      <Button variant="outline">Download Ticket</Button>
                      <Button>View Booking</Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Booking summary */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="font-medium">{bookingDetails.train}</p>
                    <p className="text-sm text-muted-foreground">
                      {bookingDetails.from} → {bookingDetails.to}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {bookingDetails.date}
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Class:</span>
                      <Badge variant="outline">{bookingDetails.class}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Seats:</span>
                      <span className="font-medium">{bookingDetails.seats.join(", ")}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Base Fare:</span>
                      <span>₹{bookingDetails.fare - 50}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Booking Fee:</span>
                      <span>₹50</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>₹{bookingDetails.fare}</span>
                    </div>
                  </div>
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