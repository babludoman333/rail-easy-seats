-- First, ensure the trigger exists on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Backfill existing users who don't have profiles yet
-- This will create profile records for any existing auth users without profiles
INSERT INTO public.profiles (id, full_name, username, email)
SELECT 
  au.id,
  au.raw_user_meta_data->>'full_name',
  au.raw_user_meta_data->>'username',
  au.email
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;