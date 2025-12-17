-- Secure the questions table by removing the public INSERT policy
-- This is critical to run after migration is complete.

-- Drop the permissive policy created for migration
DROP POLICY IF EXISTS "Allow public insert access" ON public.questions;

-- Ensure Update is also restricted if it was made public (it was in our previous snippet)
DROP POLICY IF EXISTS "Allow public update access" ON public.questions;

-- Re-assert Read Only for public
-- (Already exists as "Allow public read access" but ensuring it's the only one)

-- Optional: Create an Admin-only policy if needed in future
-- CREATE POLICY "Allow admin insert" ON public.questions FOR INSERT TO authenticated USING (auth.jwt() ->> 'role' = 'service_role');
