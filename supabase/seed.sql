-- Seed Data for contenu_apprentissage

insert into public.contenu_apprentissage (titre, texte_synthese, type_module) values
('La Marseillaise', 'Hymne national écrit par Rouget de Lisle en 1792.', 'Histoire'),
('La Devise', 'Liberté, Égalité, Fraternité.', 'Valeurs'),
('Le Président', 'Elu pour 5 ans au suffrage universel direct.', 'Institutions'),
('14 Juillet', 'Fête nationale commémorant la prise de la Bastille (1789) et la fête de la fédération (1790).', 'Histoire'),
('La Laïcité', 'Principe de séparation des Églises et de l’État (Loi de 1905).', 'Valeurs');

-- Seed Data for questions
insert into public.questions (question, reponse_correcte, autres_reponses_fausses, theme) values
('Qui est l''actuel président de la République ?', 'Emmanuel Macron', '["François Hollande", "Nicolas Sarkozy", "Jacques Chirac"]', 'Actualité'),
('Quelle est la devise de la France ?', 'Liberté, Égalité, Fraternité', '["Travail, Famille, Patrie", "Honneur et Patrie", "Union et Discipline"]', 'Valeurs'),
('En quelle année a eu lieu la Révolution française ?', '1789', '["1792", "1815", "1905"]', 'Histoire'),
('Qu''est-ce que le Palais de l''Élysée ?', 'La résidence du Président', '["Le siège du Sénat", "Le siège de l''Assemblée nationale", "Un musée"]', 'Institutions'),
('Quel fleuve traverse Paris ?', 'La Seine', '["Le Rhône", "La Loire", "La Garonne"]', 'Géographie');
