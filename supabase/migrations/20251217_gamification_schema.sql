-- User Progress for 'Apprendre' modules
CREATE TABLE IF NOT EXISTS public.user_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    module_id TEXT NOT NULL, -- Corresponds to question.id or chapter identifier
    learned_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, module_id)
);

-- RLS for user_progress
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own progress" ON public.user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON public.user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own progress" ON public.user_progress FOR DELETE USING (auth.uid() = user_id);

-- Badges System
CREATE TABLE IF NOT EXISTS public.badges (
    id TEXT PRIMARY KEY, -- e.g., 'citizen_expert'
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon_url TEXT,
    condition_type TEXT, -- 'score', 'streak', 'completion'
    condition_value INTEGER
);

-- User Badges (Unlocked)
CREATE TABLE IF NOT EXISTS public.user_badges (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    badge_id TEXT REFERENCES public.badges(id) NOT NULL,
    unlocked_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, badge_id)
);

-- RLS for badges
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read badges" ON public.badges FOR SELECT USING (true);

ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own badges" ON public.user_badges FOR SELECT USING (auth.uid() = user_id);
-- Insert traditionally done by server action/trigger
