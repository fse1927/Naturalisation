-- Create a unified questions table
CREATE TABLE IF NOT EXISTS public.questions (
    id TEXT PRIMARY KEY,
    theme TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('quiz', 'interview')),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    options TEXT[], -- Array of strings for quiz options
    explanation TEXT,
    info_cards_chapter TEXT, -- Maps to official chapters for 'Apprendre' module
    metadata JSONB DEFAULT '{}'::jsonb, -- Stores flexible fields: required_for, answer_tips, difficulty, importance, source
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow read access for all users
CREATE POLICY "Allow public read access" ON public.questions
    FOR SELECT USING (true); -- Publicly readable for now, adjust if needed

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS questions_theme_idx ON public.questions(theme);
CREATE INDEX IF NOT EXISTS questions_type_idx ON public.questions(type);
CREATE INDEX IF NOT EXISTS questions_chapter_idx ON public.questions(info_cards_chapter);
