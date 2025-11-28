-- Update handle_new_user function to create user roles and driver profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- Insert into profiles table
  INSERT INTO public.profiles (id, full_name, username, email)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'username',
    new.email
  );
  
  -- Determine if user is a driver and create appropriate role
  DECLARE
    is_driver BOOLEAN;
    user_role public.app_role;
  BEGIN
    is_driver := COALESCE((new.raw_user_meta_data->>'is_driver')::boolean, false);
    
    IF is_driver THEN
      user_role := 'driver';
    ELSE
      user_role := 'passenger';
    END IF;
    
    -- Insert user role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (new.id, user_role);
    
    -- If driver, create driver profile
    IF is_driver THEN
      INSERT INTO public.driver_profiles (user_id)
      VALUES (new.id);
    END IF;
  END;
  
  RETURN new;
END;
$function$;