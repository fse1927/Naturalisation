-- Create ENUM for difficulty levels
CREATE TYPE difficulty_level AS ENUM ('facile', 'moyen', 'difficile');

-- Add difficulty column to questions table
ALTER TABLE public.questions 
ADD COLUMN IF NOT EXISTS difficulty difficulty_level DEFAULT 'moyen' NOT NULL;

-- Pass existing questions to 'moyen' if needed (handled by default, but good for clarity)
UPDATE public.questions SET difficulty = 'moyen' WHERE difficulty IS NULL;
