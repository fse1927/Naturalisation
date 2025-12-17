-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Table: utilisateurs (Extensions of Auth)
-- Note: triggers to sync with auth.users would be ideal, but for now we define the table.
create table public.utilisateurs (
  id uuid references auth.users not null primary key,
  nom_prenom text,
  profil_situation text, -- Marié, Célibataire, etc.
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for utilisateurs
alter table public.utilisateurs enable row level security;
create policy "Users can view their own profile" on public.utilisateurs
  for select using (auth.uid() = id);
create policy "Users can update their own profile" on public.utilisateurs
  for update using (auth.uid() = id);

-- Table: contenu_apprentissage
create table public.contenu_apprentissage (
  id serial primary key,
  titre text not null,
  texte_synthese text not null,
  type_module text not null, -- Histoire, Institutions, Valeurs
  audio_url text, -- URL for TTS
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for contenu_apprentissage
alter table public.contenu_apprentissage enable row level security;
create policy "Public read access" on public.contenu_apprentissage
  for select using (true);

-- Table: questions
create table public.questions (
  id serial primary key,
  question text not null,
  reponse_correcte text not null,
  autres_reponses_fausses jsonb not null, -- Array of strings
  theme text not null, -- Histoire, Géographie, Actualité
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for questions
alter table public.questions enable row level security;
create policy "Public read access" on public.questions
  for select using (true);

-- Table: historique_tests
create table public.historique_tests (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.utilisateurs(id) not null,
  date_test timestamp with time zone default timezone('utc'::text, now()) not null,
  score_pourcentage integer not null,
  temps_total_secondes integer not null,
  questions_manquees jsonb -- Array of Question IDs
);

-- RLS for historique_tests
alter table public.historique_tests enable row level security;
create policy "Users can view their own history" on public.historique_tests
  for select using (auth.uid() = user_id);
create policy "Users can insert their own history" on public.historique_tests
  for insert with check (auth.uid() = user_id);

-- View: Mes Faiblesses (Optional, or handled in code)
-- Simple query would be selecting questions_manquees for user
