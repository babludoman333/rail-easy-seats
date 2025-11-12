-- Add email column to profiles table for username login support
ALTER TABLE public.profiles
ADD COLUMN email text;

-- Create index for faster email lookups
CREATE INDEX idx_profiles_email ON public.profiles(email);

-- Update the handle_new_user function to include email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, full_name, username, email)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'username',
    new.email
  );
  RETURN new;
END;
$function$;