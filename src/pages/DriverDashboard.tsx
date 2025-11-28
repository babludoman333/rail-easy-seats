import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Car, DollarSign, MapPin, Clock, CheckCircle, XCircle } from "lucide-react";

interface DriverProfile {
  vehicle_number: string | null;
  vehicle_type: string | null;
  license_number: string | null;
  is_available: boolean;
  rating: number;
  total_rides: number;
  total_earnings: number;
}

const DriverDashboard = () => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<DriverProfile | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    vehicle_number: "",
    vehicle_type: "",
    license_number: ""
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (userRole && userRole !== 'driver') {
      navigate('/');
      return;
    }

    fetchDriverProfile();
  }, [user, userRole, navigate]);

  const fetchDriverProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('driver_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching driver profile:', error);
      toast({
        title: "Error",
        description: "Failed to load driver profile",
        variant: "destructive"
      });
    } else if (data) {
      setProfile(data);
      setFormData({
        vehicle_number: data.vehicle_number || "",
        vehicle_type: data.vehicle_type || "",
        license_number: data.license_number || ""
      });
    }

    setLoading(false);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const { error } = await supabase
      .from('driver_profiles')
      .update({
        vehicle_number: formData.vehicle_number,
        vehicle_type: formData.vehicle_type,
        license_number: formData.license_number
      })
      .eq('user_id', user.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
      setEditMode(false);
      fetchDriverProfile();
    }
  };

  const toggleAvailability = async () => {
    if (!user || !profile) return;

    const { error } = await supabase
      .from('driver_profiles')
      .update({ is_available: !profile.is_available })
      .eq('user_id', user.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update availability",
        variant: "destructive"
      });
    } else {
      fetchDriverProfile();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Driver Dashboard</h1>
          <p className="text-muted-foreground">Manage your rides and profile</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Rides</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profile?.total_rides || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{profile?.total_earnings || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rating</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profile?.rating || 5.0} ⭐</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Button 
                onClick={toggleAvailability}
                variant={profile?.is_available ? "default" : "outline"}
                className="w-full"
              >
                {profile?.is_available ? "Available" : "Unavailable"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Profile Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Driver Profile</CardTitle>
                <CardDescription>Manage your vehicle and license information</CardDescription>
              </div>
              {!editMode && (
                <Button onClick={() => setEditMode(true)}>Edit Profile</Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {editMode ? (
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicle-type">Vehicle Type</Label>
                  <Select 
                    value={formData.vehicle_type}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, vehicle_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bike">Bike/Scooter</SelectItem>
                      <SelectItem value="auto">Auto/Rickshaw</SelectItem>
                      <SelectItem value="sedan">Sedan</SelectItem>
                      <SelectItem value="suv">SUV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vehicle-number">Vehicle Number</Label>
                  <Input
                    id="vehicle-number"
                    placeholder="e.g., DL01AB1234"
                    value={formData.vehicle_number}
                    onChange={(e) => setFormData(prev => ({ ...prev, vehicle_number: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="license-number">License Number</Label>
                  <Input
                    id="license-number"
                    placeholder="Enter your license number"
                    value={formData.license_number}
                    onChange={(e) => setFormData(prev => ({ ...prev, license_number: e.target.value }))}
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit">Save Changes</Button>
                  <Button type="button" variant="outline" onClick={() => setEditMode(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Car className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Vehicle Type</p>
                    <p className="font-medium">{profile?.vehicle_type || "Not set"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Car className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Vehicle Number</p>
                    <p className="font-medium">{profile?.vehicle_number || "Not set"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">License Number</p>
                    <p className="font-medium">{profile?.license_number || "Not set"}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Rides Section - Placeholder for future implementation */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Rides</CardTitle>
            <CardDescription>Your ride history and upcoming bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center py-8">No rides yet. Start accepting rides to see them here!</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DriverDashboard;
