-- Update existing profiles with email and username from auth.users
UPDATE public.profiles p
SET 
  email = au.email,
  username = COALESCE(p.username, au.raw_user_meta_data->>'username')
FROM auth.users au
WHERE p.id = au.id 
  AND (p.email IS NULL OR (p.username IS NULL AND au.raw_user_meta_data->>'username' IS NOT NULL));