
-- 1. Create or Replace the Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.utilisateurs (id, nom_prenom, profil_situation)
  VALUES (
      new.id, 
      new.raw_user_meta_data->>'full_name', 
      new.raw_user_meta_data->>'situation'
  )
  ON CONFLICT (id) DO NOTHING; -- Avoid errors if ID exists
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Drop existing trigger if any (to avoid duplicates/errors)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 3. Create the Trigger
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 4. BACKFILL: Insert existing users who are missing from 'utilisateurs'
-- This fixes the foreign key error for users who already signed up
INSERT INTO public.utilisateurs (id, nom_prenom, profil_situation)
SELECT 
    id, 
    raw_user_meta_data->>'full_name',
    raw_user_meta_data->>'situation'
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.utilisateurs)
ON CONFLICT (id) DO NOTHING;

-- Verification log
DO $$
DECLARE
    missing_count INT;
BEGIN
    SELECT count(*) INTO missing_count 
    FROM auth.users 
    WHERE id NOT IN (SELECT id FROM public.utilisateurs);
    
    RAISE NOTICE 'Cleanup complete. Remaining missing users: %', missing_count;
END $$;
