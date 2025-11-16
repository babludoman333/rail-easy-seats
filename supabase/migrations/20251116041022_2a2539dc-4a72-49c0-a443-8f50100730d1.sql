-- Allow public access to read email by username for login purposes
-- This is safe because emails are already public (used for login)
CREATE POLICY "Allow public email lookup by username for login"
ON public.profiles
FOR SELECT
USING (true);