-- Create cab bookings table
CREATE TABLE public.cab_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id TEXT NOT NULL,
  user_id UUID NOT NULL,
  vehicle_type TEXT NOT NULL,
  pickup_location TEXT NOT NULL,
  drop_location TEXT NOT NULL,
  price INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  driver_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.cab_bookings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own cab bookings"
ON public.cab_bookings
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create cab bookings"
ON public.cab_bookings
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Drivers can view assigned bookings"
ON public.cab_bookings
FOR SELECT
USING (auth.uid() = driver_id);

CREATE POLICY "Drivers can update assigned bookings"
ON public.cab_bookings
FOR UPDATE
USING (auth.uid() = driver_id);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_cab_booking_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER update_cab_bookings_updated_at
BEFORE UPDATE ON public.cab_bookings
FOR EACH ROW
EXECUTE FUNCTION public.update_cab_booking_updated_at();