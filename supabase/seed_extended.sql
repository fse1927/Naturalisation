-- Extended Data for Naturalisation App

-- =============================================
-- 1. LEARNING MODULES (Contenu Apprentissage)
-- =============================================

-- HISTOIRE
INSERT INTO public.contenu_apprentissage (titre, texte_synthese, type_module, audio_url) VALUES
('La Révolution Française (1789)', 'La Révolution française marque la fin de la monarchie absolue et la naissance de la République. Le 14 juillet 1789, la prise de la Bastille symbolise la révolte du peuple. La Déclaration des droits de l''homme et du citoyen est adoptée le 26 août 1789.', 'Histoire', '/audio/histoire_1.mp3'),
('Le Premier Empire (1804-1815)', 'Napoléon Bonaparte devient Empereur des Français en 1804. Il réorganise l''administration (préfets), la justice (Code civil) et l''éducation (lycées).', 'Histoire', '/audio/histoire_2.mp3'),
('La IIIème République (1870-1940)', 'C''est une période de stabilité démocratique. L''école devient gratuite, laïque et obligatoire (Lois Ferry, 1881-1882). La loi de 1905 sépare l''Église et l''État.', 'Histoire', NULL),
('La Seconde Guerre Mondiale (1939-1945)', 'La France est occupée par l''Allemagne nazie. Le Général de Gaulle lance l''Appel du 18 juin 1940 depuis Londres pour résister. La France est libérée en 1944.', 'Histoire', NULL),
('La Vème République (1958)', 'Fondée par le Général de Gaulle, elle renforce le pouvoir du Président. La Constitution de 1958 est toujours en vigueur.', 'Histoire', '/audio/histoire_5.mp3');

-- INSTITUTIONS
INSERT INTO public.contenu_apprentissage (titre, texte_synthese, type_module, audio_url) VALUES
('Le Président de la République', 'Chef de l''État, élu pour 5 ans au suffrage universel direct. Il nomme le Premier ministre, préside le Conseil des ministres et est chef des armées. Il réside au Palais de l''Élysée.', 'Institutions', '/audio/inst_1.mp3'),
('Le Premier Ministre', 'Chef du gouvernement, nommé par le Président. Il dirige l''action du gouvernement et assure l''exécution des lois. Il réside à l''Hôtel de Matignon.', 'Institutions', '/audio/inst_2.mp3'),
('Le Parlement', 'Composé de deux chambres : l''Assemblée nationale (députés élus, siège au Palais Bourbon) et le Sénat (sénateurs élus, siège au Palais du Luxembourg). Ils votent les lois.', 'Institutions', NULL),
('Le Maire et la Commune', 'La commune est la base de l''administration territoriale. Le Maire est élu par le conseil municipal. Il gère l''état civil, les écoles primaires, l''urbanisme.', 'Institutions', NULL),
('Les Départements et Régions', 'La France est divisée en régions et départements. Le Conseil départemental gère le social et les collèges. Le Conseil régional gère l''économie et les lycées.', 'Institutions', '/audio/inst_5.mp3');

-- VALEURS
INSERT INTO public.contenu_apprentissage (titre, texte_synthese, type_module, audio_url) VALUES
('Liberté, Égalité, Fraternité', 'C''est la devise de la République. Liberté de penser, de croire, de s''exprimer. Égalité devant la loi, sans distinction d''origine ou de religion. Fraternité : solidarité entre les citoyens.', 'Valeurs', '/audio/val_1.mp3'),
('La Laïcité', 'Principe fondamental : l''État est neutre et ne finance aucun culte. Chacun est libre de pratiquer sa religion ou de ne pas en avoir, dans le respect de l''ordre public.', 'Valeurs', '/audio/val_2.mp3'),
('Les Symboles de la République', 'Le drapeau tricolore (Bleu, Blanc, Rouge). La Marseillaise (hymne national). Marianne (figure allégorique). Le 14 Juillet (Fête nationale). Le Coq.', 'Valeurs', NULL),
('Droits et Devoirs du Citoyen', 'Droits : vote, éligibilité, protection sociale, éducation. Devoirs : respecter la loi, payer l''impôt, participer à la défense (JDC), être juré d''assises.', 'Valeurs', NULL),
('L''Union Européenne', 'La France est membre fondateur de l''UE (1957). Symbole : drapeau à 12 étoiles sur fond bleu. Hymne : Ode à la Joie. Monnaie : Euro.', 'Valeurs', '/audio/val_5.mp3');


-- =============================================
-- 2. QUESTIONS (Quiz)
-- =============================================

INSERT INTO public.questions (question, reponse_correcte, autres_reponses_fausses, theme) VALUES
-- HISTOIRE
('En quelle année a eu lieu la prise de la Bastille ?', '1789', '["1792", "1804", "1945"]'::jsonb, 'Histoire'),
('Qui a instauré le Code Civil ?', 'Napoléon Bonaparte', '["Louis XIV", "Charles de Gaulle", "François Mitterrand"]'::jsonb, 'Histoire'),
('Quel roi a été guillotiné pendant la Révolution ?', 'Louis XVI', '["Louis XIV", "Henri IV", "François Ier"]'::jsonb, 'Histoire'),
('Quelle guerre a eu lieu de 1914 à 1918 ?', 'La Première Guerre mondiale', '["La Guerre de Cent Ans", "La Seconde Guerre mondiale", "La Guerre d''Algérie"]'::jsonb, 'Histoire'),
('Qui a lancé l''appel du 18 juin 1940 ?', 'Charles de Gaulle', '["Philippe Pétain", "Jean Moulin", "Napoléon"]'::jsonb, 'Histoire'),
('En quelle année les femmes ont-elles obtenu le droit de vote ?', '1944', '["1789", "1848", "1981"]'::jsonb, 'Histoire'),
('Qui a aboli la peine de mort en France ?', 'François Mitterrand (Badinter)', '["Jacques Chirac", "Charles de Gaulle", "Georges Pompidou"]'::jsonb, 'Histoire'),
('Quel événement célèbre-t-on le 11 novembre ?', 'L''armistice de 1918', '["La victoire de 1945", "La prise de la Bastille", "La fête du travail"]'::jsonb, 'Histoire'),
('Qui était Jeanne d''Arc ?', 'Une héroïne de la guerre de Cent Ans', '["Une reine de France", "Une écrivaine", "Une révolutionnaire"]'::jsonb, 'Histoire'),
('Quand l''école est-elle devenue gratuite et obligatoire ?', '1881-1882 (Jules Ferry)', '["1958", "1789", "1936"]'::jsonb, 'Histoire'),

-- INSTITUTIONS
('Pour combien de temps est élu le Président de la République ?', '5 ans', '["4 ans", "6 ans", "7 ans"]'::jsonb, 'Institutions'),
('Où siègent les députés ?', 'À l''Assemblée nationale', '["Au Sénat", "À l''Élysée", "À Matignon"]'::jsonb, 'Institutions'),
('Qui a le pouvoir de voter les lois ?', 'Le Parlement', '["Le Président", "Les Juges", "Le Maire"]'::jsonb, 'Institutions'),
('Quel est l''âge de la majorité en France ?', '18 ans', '["16 ans", "21 ans", "25 ans"]'::jsonb, 'Institutions'),
('Qui dirige le gouvernement ?', 'Le Premier ministre', '["Le Président", "Le Maire", "Le Préfet"]'::jsonb, 'Institutions'),
('Combien y a-t-il de départements en France (environ) ?', '101', '["50", "12", "500"]'::jsonb, 'Institutions'),
('Que signifie "démocratie" ?', 'Le gouvernement du peuple, par le peuple, pour le peuple', '["Le pouvoir aux riches", "Le pouvoir au roi", "L''absence de règles"]'::jsonb, 'Institutions'),
('Quel est le rôle du Conseil Constitutionnel ?', 'Vérifier que les lois respectent la Constitution', '["Juger les criminels", "Élire le Président", "Faire les lois"]'::jsonb, 'Institutions'),
('Qui est le chef des armées ?', 'Le Président de la République', '["Le Ministre de la Défense", "Le Premier ministre", "Un Général"]'::jsonb, 'Institutions'),
('Quel est le numéro d''urgence européen ?', '112', '["18", "17", "15"]'::jsonb, 'Institutions'),

-- GÉOGRAPHIE
('Quelle est la capitale de la France ?', 'Paris', '["Lyon", "Marseille", "Bordeaux"]'::jsonb, 'Géographie'),
('Quel est le fleuve qui traverse Paris ?', 'La Seine', '["Le Rhône", "La Loire", "La Garonne"]'::jsonb, 'Géographie'),
('Citez un pays frontalier de la France.', 'L''Allemagne', '["Le Royaume-Uni", "Le Portugal", "La Pologne"]'::jsonb, 'Géographie'),
('Quel est le plus haut sommet de France ?', 'Le Mont Blanc', '["Le Mont Saint-Michel", "Le Pic du Midi", "Le Kilimandjaro"]'::jsonb, 'Géographie'),
('Dans quel océan ou mer se jette la Loire ?', 'L''Océan Atlantique', '["La Mer Méditerranée", "La Manche", "La Mer du Nord"]'::jsonb, 'Géographie'),
('Citez une grande ville du sud de la France.', 'Marseille', '["Lille", "Strasbourg", "Brest"]'::jsonb, 'Géographie'),
('Quelle île française se trouve en Méditerranée ?', 'La Corse', '["La Réunion", "La Martinique", "Tahiti"]'::jsonb, 'Géographie'),
('Qu''est-ce que l''Outre-mer ?', 'Les territoires français situés hors du continent européen', '["Les pays étrangers", "Les zones de guerre", "Les frontières"]'::jsonb, 'Géographie'),
('Combien y a-t-il de régions en France métropolitaine (depuis 2016) ?', '13', '["22", "10", "5"]'::jsonb, 'Géographie'),
('Quelle ville est surnommée la "Capitale de l''Europe" ?', 'Strasbourg', '["Bruxelles", "Paris", "Berlin"]'::jsonb, 'Géographie'),

-- VALEURS & SOCIÉTÉ
('Quelle est la devise de la France ?', 'Liberté, Égalité, Fraternité', '["Travail, Famille, Patrie", "Droit, Devoir, Citoyenneté", "Amour, Gloire, Beauté"]'::jsonb, 'Valeurs'),
('Que signifie la laïcité ?', 'La neutralité religieuse de l''État', '["L''interdiction des religions", "L''obligation d''être catholique", "La liberté de tout faire"]'::jsonb, 'Valeurs'),
('Quel animal est l''emblème de la France ?', 'Le Coq', '["Le Lion", "L''Aigle", "L''Ours"]'::jsonb, 'Valeurs'),
('Quel est l''hymne national français ?', 'La Marseillaise', '["Le Chant des Partisans", "L''Hymne à la Joie", "Douce France"]'::jsonb, 'Valeurs'),
('Quelle femme symbolise la République française ?', 'Marianne', '["Jeanne d''Arc", "Marie Curie", "Catherine Deneuve"]'::jsonb, 'Valeurs'),
('Le vote est-il obligatoire en France ?', 'Non, c''est un droit et un devoir moral', '["Oui, c''est puni par la loi", "Seulement pour les hommes", "Seulement pour les riches"]'::jsonb, 'Valeurs'),
('Qu''est-ce que la fraternité ?', 'La solidarité entre les citoyens', '["Avoir des frères", "L''égalité homme-femme", "Payer des impôts"]'::jsonb, 'Valeurs'),
('Peut-on être discriminé pour sa religion en France ?', 'Non, c''est interdit par la loi', '["Oui, c''est normal", "Seulement dans le privé", "Ça dépend"]'::jsonb, 'Valeurs'),
('Quelle est la couleur du milieu du drapeau français ?', 'Blanc', '["Bleu", "Rouge", "Vert"]'::jsonb, 'Valeurs'),
('Citez un devoir du citoyen français.', 'Payer ses impôts', '["Avoir une voiture", "Parler anglais", "Voyager"]'::jsonb, 'Valeurs');
