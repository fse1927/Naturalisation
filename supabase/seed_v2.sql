-- MASSIVE SEED DATA v2
-- Questions cleanup
DELETE FROM public.questions;
DELETE FROM public.contenu_apprentissage;

-- =============================================
-- 1. LEARNING MODULES
-- =============================================

-- HISTOIRE
INSERT INTO public.contenu_apprentissage (titre, texte_synthese, type_module, audio_url) VALUES
('La Préhistoire et les Gaulois', 'Les premiers habitants sont les Gaulois. Vercingétorix est leur chef célèbre, vaincu par Jules César à Alésia en 52 av. J.-C. Les Romains apportent la paix, les routes et les villes (Lugdunum/Lyon).', 'Histoire', NULL),
('Les Rois de France (Moyen Âge)', 'Clovis est le premier roi des Francs (481). Charlemagne devient Empereur en 800 (école). Louis IX (Saint-Louis) rend la justice sous un chêne.', 'Histoire', NULL),
('La Guerre de Cent Ans (1337-1453)', 'Guerre contre l''Angleterre. Jeanne d''Arc libère Orléans et fait sacrer Charles VII à Reims. Elle est brûlée à Rouen.', 'Histoire', NULL),
('La Renaissance et François Ier', 'François Ier (1515, Marignan) est un roi bâtisseur (Chambord) et protecteur des arts (Léonard de Vinci). L''Ordonnance de Villers-Cotterêts (1539) impose le français comme langue officielle.', 'Histoire', '/audio/histoire_francois1.mp3'),
('Henri IV et les Guerres de Religion', 'Henri IV signe l''Édit de Nantes (1598) qui autorise les protestants à pratiquer leur religion. Il est assassiné par Ravaillac.', 'Histoire', NULL),
('Louis XIV, le Roi Soleil', 'Monarque absolu. Il fait construire le château de Versailles. Il révoque l''Édit de Nantes.', 'Histoire', NULL),
('Les Lumières (XVIIIe siècle)', 'Voltaire, Rousseau, Montesquieu. Des philosophes qui défendent la raison, la tolérance et la liberté, inspirant la Révolution.', 'Histoire', NULL),
('La Révolution Française (1789)', '14 juillet : Prise de la Bastille. 26 août : Déclaration des Droits de l''Homme. Fin de la monarchie absolue.', 'Histoire', '/audio/histoire_rev.mp3'),
('Napoléon Bonaparte', 'Général puis Empereur (1804). Crée le Code Civil, les Lycées, la Légion d''Honneur, les Préfets.', 'Histoire', NULL),
('XIXe siècle : Instabilité et Progrès', 'Alternance de rois, d''empereurs et de républiques. Révolution industrielle. Victor Hugo écrit "Les Misérables".', 'Histoire', NULL),
('Jules Ferry et l''École', 'Lois de 1881-1882 : L''école devient gratuite, laïque et obligatoire pour tous les enfants.', 'Histoire', NULL),
('La Séparation de l''Église et de l''État', 'Loi de 1905. La République est laïque. Elle garantit la liberté de conscience mais ne salarie aucun culte.', 'Histoire', '/audio/histoire_1905.mp3'),
('Première Guerre Mondiale (14-18)', 'Guerre des tranchées. Bataille de Verdun (1916). Armistice le 11 novembre 1918. Les "Poilus".', 'Histoire', NULL),
('Seconde Guerre Mondiale (39-45)', 'Occupation allemande. Régime de Vichy (Pétain). Résistance (Jean Moulin). De Gaulle (Appel du 18 juin 1940). Débarquement en Normandie (6 juin 1944).', 'Histoire', '/audio/histoire_3945.mp3'),
('La Construction Européenne', 'Après 1945, pour maintenir la paix. France et Allemagne se réconcilient. Traité de Rome (1957).', 'Histoire', NULL),
('La Décolonisation', 'Indépendance des colonies (Indochine, Afrique, Algérie en 1962).', 'Histoire', NULL),
('La Ve République', 'Constitution de 1958 voulue par De Gaulle. Stabilité politique. Élection du Président au suffrage universel (1962).', 'Histoire', NULL),
('Mai 1968', 'Mouvement social (étudiants et ouvriers). Grèves générales. Évolution des mœurs.', 'Histoire', NULL),
('Simone Veil', 'Ministre de la Santé. Fait voter la loi sur l''IVG (avortement) en 1975. Première présidente du Parlement européen.', 'Histoire', NULL),
('La France d''aujourd''hui', 'Puissance mondiale (G7, ONU). Pays touristique et culturel. Défis : écologie, numérique.', 'Histoire', NULL);

-- INSTITUTIONS
INSERT INTO public.contenu_apprentissage (titre, texte_synthese, type_module, audio_url) VALUES
('La Constitution', 'C''est la loi suprême. Elle définit les pouvoirs et les droits. La France est une République indivisible, laïque, démocratique et sociale.', 'Institutions', NULL),
('Le Président de la République', 'Chef de l''État. Élu pour 5 ans. Gardien de la Constitution. Chef des armées. Droit de grâce. Dissout l''Assemblée.', 'Institutions', '/audio/inst_pres.mp3'),
('Le Premier Ministre', 'Nommé par le Président. Chef du gouvernement. Responsable devant l''Assemblée. Dirige l''administration.', 'Institutions', NULL),
('Le Parlement', 'Vote la loi et contrôle le gouvernement. Bicaméral : Assemblée nationale (577 députés) + Sénat (348 sénateurs).', 'Institutions', NULL),
('Assemblée Nationale', 'Élue au suffrage direct. Siège au Palais Bourbon. A le dernier mot sur le Sénat en cas de désaccord.', 'Institutions', NULL),
('Le Sénat', 'Élu au suffrage indirect (par les "grands électeurs"). Représente les collectivités territoriales. Palais du Luxembourg.', 'Institutions', NULL),
('La Justice', 'Indépendante. Elle veille au respect des lois. Conseil Constitutionnel vérifie la conformité des lois.', 'Institutions', NULL),
('Collectivités Territoriales', 'Communes (Maire), Départements (Conseil départemental), Régions (Conseil régional). Décentralisation.', 'Institutions', NULL),
('Le Préfet', 'Représentant de l''État dans le département ou la région. Nommé par le Président. Veille à l''ordre public.', 'Institutions', NULL),
('Les Élections', 'Présidentielle (5 ans), Législatives (Députés, 5 ans), Municipales (Maire, 6 ans), Européennes (5 ans).', 'Institutions', NULL);

-- VALEURS & SYMBOLES
INSERT INTO public.contenu_apprentissage (titre, texte_synthese, type_module, audio_url) VALUES
('Le Drapeau', 'Bleu, Blanc, Rouge. Emblème national défini par la Constitution. Doit être respecté.', 'Valeurs', NULL),
('La Devise', 'Liberté, Égalité, Fraternité. Inscrite sur les mairies et écoles.', 'Valeurs', NULL),
('L''Hymne National', 'La Marseillaise. Chant de guerre devenu hymne de la liberté. Rouget de Lisle (1792).', 'Valeurs', '/audio/val_marseillaise.mp3'),
('Marianne', 'Allégorie de la République. Buste dans les mairies. Porte le bonnet phrygien (symbole de liberté).', 'Valeurs', NULL),
('14 Juillet', 'Fête nationale. Commémore la prise de la Bastille (1789) et la Fête de la Fédération (1790). Défilé militaire, feux d''artifice.', 'Valeurs', NULL),
('La Laïcité', 'Liberté de croire ou ne pas croire. Séparation État/Églises. Pas de signes religieux ostentatoires à l''école publique.', 'Valeurs', '/audio/val_laicite.mp3'),
('L''Égalité', 'Tous les citoyens ont les mêmes droits et devoirs, quelles que soient leur origine, religion ou sexe. Égalité Homme-Femme.', 'Valeurs', NULL),
('La Fraternité', 'Solidarité nationale. Sécurité sociale, aide aux plus démunis. Vivre ensemble.', 'Valeurs', NULL),
('Droits du Citoyen', 'Droit de vote, d''expression, de grève, d''association, de sûreté.', 'Valeurs', NULL),
('Devoirs du Citoyen', 'Respecter la loi, payer l''impôt, participer à la défense, respecter autrui et l''environnement.', 'Valeurs', NULL);


-- =============================================
-- 2. QUESTIONS (100 Questions)
-- =============================================

INSERT INTO public.questions (question, reponse_correcte, autres_reponses_fausses, theme) VALUES
-- HISTOIRE (40 questions)
('Qui a dirigé la Résistance depuis Londres ?', 'Charles de Gaulle', '["Napoléon", "Pétain", "Chirac"]'::jsonb, 'Histoire'),
('Quel événement marque le début de la Révolution française ?', 'La prise de la Bastille', '["L''exécution du Roi", "La prise de l''Élysée", "La guerre civile"]'::jsonb, 'Histoire'),
('En quelle année a été adoptée la Déclaration des droits de l''homme ?', '1789', '["1948", "1958", "1804"]'::jsonb, 'Histoire'),
('Qui était le Roi Soleil ?', 'Louis XIV', '["Louis XVI", "Henri IV", "François Ier"]'::jsonb, 'Histoire'),
('Quel roi a imposé le français comme langue officielle (1539) ?', 'François Ier', '["Charlemagne", "Louis XIV", "Clovis"]'::jsonb, 'Histoire'),
('Qui a été le premier Empereur des Français ?', 'Napoléon Ier', '["Louis XIV", "Charlemagne", "Jules César"]'::jsonb, 'Histoire'),
('Quelle guerre a eu lieu entre 1939 et 1945 ?', 'La Seconde Guerre mondiale', '["La Guerre Froide", "La Guerre de 100 ans", "La Grande Guerre"]'::jsonb, 'Histoire'),
('Quel célèbre château a fait construire Louis XIV ?', 'Versailles', '["Chambord", "Louvre", "Fontainebleau"]'::jsonb, 'Histoire'),
('Qui est Jeanne d''Arc ?', 'Une héroïne qui a combattu les Anglais', '["Une reine de France", "Une écrivaine célèbre", "La femme de Napoléon"]'::jsonb, 'Histoire'),
('Quelle est la date de l''Armistice de la Première Guerre mondiale ?', '11 novembre 1918', '["8 mai 1945", "14 juillet 1789", "11 septembre 2001"]'::jsonb, 'Histoire'),
('Qui a aboli l\''esclavage en 1848 ?', 'Victor Schœlcher', '["Jules Ferry", "Napoléon", "De Gaulle"]'::jsonb, 'Histoire'),
('Quel Président a aboli la peine de mort en 1981 ?', 'François Mitterrand', '["Valéry Giscard d''Estaing", "Jacques Chirac", "François Hollande"]'::jsonb, 'Histoire'),
('En quelle année l''Algérie est-elle devenue indépendante ?', '1962', '["1954", "1968", "1945"]'::jsonb, 'Histoire'),
('Qui a fondé la Ve République ?', 'Charles de Gaulle', '["François Mitterrand", "Georges Pompidou", "René Coty"]'::jsonb, 'Histoire'),
('Quelle femme scientifique a reçu deux prix Nobel ?', 'Marie Curie', '["Simone Veil", "George Sand", "Colette"]'::jsonb, 'Histoire'),
('Qui a instauré l''école gratuite et obligatoire ?', 'Jules Ferry', '["Jean Jaurès", "Léon Blum", "Victor Hugo"]'::jsonb, 'Histoire'),
('Quel est l''ancien nom de la France ?', 'La Gaule', '["La Francie", "Le Pays des Francs", "Lutèce"]'::jsonb, 'Histoire'),
('Qui a gagné la bataille d''Alésia ?', 'Jules César (Romains)', '["Vercingétorix", "Clovis", "Attila"]'::jsonb, 'Histoire'),
('Quel monument parisien a été construit pour l''Exposition universelle de 1889 ?', 'La Tour Eiffel', '["L''Arc de Triomphe", "Le Sacré-Cœur", "Le Louvre"]'::jsonb, 'Histoire'),
('Qui est le père de l''Europe ?', 'Robert Schuman / Jean Monnet', '["Charles de Gaulle", "Winston Churchill", "Helmut Kohl"]'::jsonb, 'Histoire'),
('En quelle année les femmes ont-elles voté pour la première fois ?', '1945', '["1936", "1968", "1905"]'::jsonb, 'Histoire'),
('Quel roi a été guillotiné ?', 'Louis XVI', '["Louis XIV", "Henri IV", "Louis XVIII"]'::jsonb, 'Histoire'),
('Qu''est-ce que l''Édit de Nantes ?', 'La tolérance religieuse pour les protestants', '["La fin de l''esclavage", "La création des impôts", "L''annexion de la Bretagne"]'::jsonb, 'Histoire'),
('Qui a écrit "Les Misérables" ?', 'Victor Hugo', '["Émile Zola", "Molière", "Voltaire"]'::jsonb, 'Histoire'),
('Où a eu lieu le débarquement du 6 juin 1944 ?', 'En Normandie', '["En Provence", "En Bretagne", "Dans le Nord"]'::jsonb, 'Histoire'),
('Quelle bataille célèbre a eu lieu en 1916 ?', 'Verdun', '["Austerlitz", "Waterloo", "Marignan"]'::jsonb, 'Histoire'),
('Qui succède à De Gaulle en 1969 ?', 'Georges Pompidou', '["Valéry Giscard d''Estaing", "Alain Poher", "François Mitterrand"]'::jsonb, 'Histoire'),
('Quel est le texte fondateur de 1789 ?', 'La Déclaration des Droits de l''Homme et du Citoyen', '["Le Code Civil", "La Constitution", "Le Traité de Versailles"]'::jsonb, 'Histoire'),
('Qui était Jean Moulin ?', 'Un chef de la Résistance', '["Un ministre de Vichy", "Un écrivain", "Un général américain"]'::jsonb, 'Histoire'),
('Que s''est-il passé en Mai 1968 ?', 'Un grand mouvement de grèves et de manifestations', '["Une guerre civile", "La chute du gouvernement", "L''élection de Mitterrand"]'::jsonb, 'Histoire'),
('Qui a fait construire l''Arc de Triomphe ?', 'Napoléon Ier', '["Louis XIV", "De Gaulle", "Chirac"]'::jsonb, 'Histoire'),
('Quelle république a duré le plus longtemps ?', 'La Troisième République', '["La Quatrième République", "La Première République", "La Seconde République"]'::jsonb, 'Histoire'),
('Qui est le premier roi des Francs chrétien ?', 'Clovis', '["Charlemagne", "Pépin le Bref", "Hugues Capet"]'::jsonb, 'Histoire'),
('Quelle reine a été guillotinée ?', 'Marie-Antoinette', '["Catherine de Médicis", "Aliénor d''Aquitaine", "Anne de Bretagne"]'::jsonb, 'Histoire'),
('Quand a eu lieu la séparation de l''Église et de l''État ?', '1905', '["1789", "1945", "1958"]'::jsonb, 'Histoire'),
('Quelle année marque la fin de la monarchie absolue ?', '1789', '["1792", "1815", "1848"]'::jsonb, 'Histoire'),
('Qui a sacré Charlemagne empereur ?', 'Le Pape', '["Les nobles", "Son père", "Le peuple"]'::jsonb, 'Histoire'),
('Où Napoléon est-il mort ?', 'À Sainte-Hélène', '["À Waterloo", "À Paris", "En Corse"]'::jsonb, 'Histoire'),
('Qui a créé la Sécurité Sociale ?', 'Le gouvernement provisoire en 1945', '["De Gaulle seul", "Léon Blum", "Le Front Populaire"]'::jsonb, 'Histoire'),
('Qui est Simone Veil ?', 'Femme politique, rescapée des camps, loi IVG', '["Une chanteuse", "Une reine", "Une scientifique"]'::jsonb, 'Histoire'),

-- INSTITUTIONS (30 questions)
('Où réside le Président de la République ?', 'Palais de l''Élysée', '["Palais Bourbon", "Hôtel Matignon", "Palais du Luxembourg"]'::jsonb, 'Institutions'),
('Qui a le pouvoir exécutif ?', 'Le Président et le Gouvernement', '["L''Assemblée Nationale", "Les Juges", "Le Maire"]'::jsonb, 'Institutions'),
('Combien y a-t-il de députés ?', '577', '["348", "100", "50"]'::jsonb, 'Institutions'),
('Quelle est la durée du mandat du Président ?', '5 ans (le quinquennat)', '["7 ans", "4 ans", "6 ans"]'::jsonb, 'Institutions'),
('Qui nomme les ministres ?', 'Le Président, sur proposition du Premier ministre', '["Le Premier ministre seul", "L''Assemblée", "Le Peuple"]'::jsonb, 'Institutions'),
('Que signifie le drapeau en berne ?', 'Le deuil national', '["La fête nationale", "La guerre", "La victoire"]'::jsonb, 'Institutions'),
('Quel est l''âge pour être élu député ?', '18 ans', '["21 ans", "23 ans", "25 ans"]'::jsonb, 'Institutions'),
('Qui remplace le Président en cas de décès ?', 'Le Président du Sénat', '["Le Premier Ministre", "Le Président de l''Assemblée", "La Première Dame"]'::jsonb, 'Institutions'),
('Où habite le Premier Ministre ?', 'Hôtel de Matignon', '["Palais de l''Élysée", "Quai d''Orsay", "Place Beauvau"]'::jsonb, 'Institutions'),
('Qu''est-ce que le Journal Officiel ?', 'Le journal où sont publiées les lois', '["Le journal télévisé", "Un journal sportif", "Le journal du Président"]'::jsonb, 'Institutions'),
('Qui dirige la région ?', 'Le Conseil Régional', '["Le Préfet", "Le Maire", "Le Député"]'::jsonb, 'Institutions'),
('Quel est le rôle du Sénat ?', 'Voter les lois et représenter les territoires', '["Juger les ministres", "Diriger l''armée", "Contrôler la police"]'::jsonb, 'Institutions'),
('Qu''est-ce qu''un référendum ?', 'Un vote direct des citoyens par Oui ou Non', '["Une élection présidentielle", "Une manifestation", "Une loi"]'::jsonb, 'Institutions'),
('Qui représente l''État dans le département ?', 'Le Préfet', '["Le Maire", "Le Député", "Le Juge"]'::jsonb, 'Institutions'),
('Quel est le symbole de la justice ?', 'La balance', '["Le glaive seul", "Le lion", "L''aigle"]'::jsonb, 'Institutions'),
('Comment s''appelle l''hymne européen ?', 'L''Ode à la Joie', '["La Marseillaise", "God Save the King", "L''Internationale"]'::jsonb, 'Institutions'),
('Où siège le Parlement européen ?', 'Strasbourg', '["Bruxelles", "Paris", "Berlin"]'::jsonb, 'Institutions'),
('Quelle est la monnaie de la France ?', 'L''Euro', '["Le Franc", "La Livre", "Le Dollar"]'::jsonb, 'Institutions'),
('Qui vote le budget de l''État ?', 'Le Parlement (Assemblée + Sénat)', '["Le Président", "Le Ministre des Finances", "La Banque de France"]'::jsonb, 'Institutions'),
('Qui est le Garde des Sceaux ?', 'Le Ministre de la Justice', '["Le Ministre de l''Intérieur", "Le chef des armées", "Le Président"]'::jsonb, 'Institutions'),
('Qu''est-ce que la cohabitation ?', 'Président et Premier ministre de partis opposés', '["Vivre ensemble sans être marié", "Deux présidents", "La paix"]'::jsonb, 'Institutions'),
('Peut-on voter sans carte d''électeur ?', 'Oui, avec une pièce d''identité', '["Non, c''est impossible", "Seulement pour les municipales", "Oui, sans rien"]'::jsonb, 'Institutions'),
('Qui élit les sénateurs ?', 'Les Grands Électeurs (élus locaux)', '["Les citoyens", "Le Président", "Les députés"]'::jsonb, 'Institutions'),
('Quand ont lieu les élections municipales ?', 'Tous les 6 ans', '["Tous les 5 ans", "Tous les 4 ans", "Tous les 7 ans"]'::jsonb, 'Institutions'),
('Qui garantit l''indépendance de la justice ?', 'Le Président de la République', '["Le Premier Ministre", "Le Pape", "La Police"]'::jsonb, 'Institutions'),
('Quel impôt finance les communes ?', 'La taxe foncière', '["L''impôt sur le revenu", "La TVA", "L''ISF"]'::jsonb, 'Institutions'),
('Où se trouve le Conseil Constitutionnel ?', 'Au Palais Royal', '["Au Louvre", "À Versailles", "À l''Élysée"]'::jsonb, 'Institutions'),
('Qui protège les libertés individuelles ?', 'Le juge judiciaire', '["La police", "Le maire", "Le président"]'::jsonb, 'Institutions'),
('D''où vient la loi ?', 'Projet (Gouvernement) ou Proposition (Parlement)', '["Du Président seul", "Du peuple directement", "Des juges"]'::jsonb, 'Institutions'),
('Le droit de grève est-il reconnu ?', 'Oui, valeur constitutionnelle', '["Non, interdit", "Seulement le week-end", "Sauf pour les profs"]'::jsonb, 'Institutions'),

-- GÉOGRAPHIE & CULTURE (30 questions)
('Quel est le plus long fleuve de France ?', 'La Loire', '["La Seine", "Le Rhône", "Le Rhin"]'::jsonb, 'Géographie'),
('Quelle montagne sépare la France de l''Espagne ?', 'Les Pyrénées', '["Les Alpes", "Le Jura", "Les Vosges"]'::jsonb, 'Géographie'),
('Quelle montagne sépare la France de l''Italie ?', 'Les Alpes', '["Les Pyrénées", "Le Massif Central", "Les Ardennes"]'::jsonb, 'Géographie'),
('Combien de pays ont une frontière avec la France métropolitaine ?', '8', '["5", "4", "10"]'::jsonb, 'Géographie'),
('Quelle est la deuxième ville de France ?', 'Marseille', '["Lyon", "Toulouse", "Nice"]'::jsonb, 'Géographie'),
('Quel climat domine en France ?', 'Tempéré', '["Tropical", "Polaire", "Désertique"]'::jsonb, 'Géographie'),
('Citez un département d''Outre-Mer.', 'La Guadeloupe', '["La Corse", "La Bretagne", "L''Algérie"]'::jsonb, 'Géographie'),
('Quelle ville est connue pour son vin ?', 'Bordeaux', '["Lille", "Brest", "Strasbourg"]'::jsonb, 'Géographie'),
('Quel est le sommet le plus haut d''Europe occidentale ?', 'Le Mont Blanc', '["Le mont Everest", "Le Kilimandjaro", "Le Pic du Midi"]'::jsonb, 'Géographie'),
('Où se trouve la Cour Européenne des Droits de l''Homme ?', 'Strasbourg', '["Bruxelles", "Genève", "Luxembourg"]'::jsonb, 'Géographie'),
('Qui a écrit "Les Trois Mousquetaires" ?', 'Alexandre Dumas', '["Victor Hugo", "Balzac", "Flaubert"]'::jsonb, 'Culture'),
('Qui a composé le Boléro ?', 'Maurice Ravel', '["Debussy", "Chopin", "Mozart"]'::jsonb, 'Culture'),
('Qui est Molière ?', 'Un dramaturge et comédien', '["Un peintre", "Un roi", "Un chanteur"]'::jsonb, 'Culture'),
('Quel musée se trouve dans une ancienne gare ?', 'Musée d''Orsay', '["Le Louvre", "Le Centre Pompidou", "Le Quai Branly"]'::jsonb, 'Culture'),
('Quelle course cycliste est célèbre dans le monde ?', 'Le Tour de France', '["Le Paris-Dakar", "Les 24h du Mans", "Roland Garros"]'::jsonb, 'Culture'),
('Quel plat est une spécialité alsacienne ?', 'La choucroute', '["La bouillabaisse", "Le cassoulet", "La crêpe"]'::jsonb, 'Culture'),
('Qu''est-ce que le Beaujolais Nouveau ?', 'Un vin primeur', '["Un fromage", "Un gâteau", "Une danse"]'::jsonb, 'Culture'),
('Où a lieu le festival de cinéma le plus célèbre ?', 'Cannes', '["Deauville", "Paris", "Avignon"]'::jsonb, 'Culture'),
('Qui a peint la Joconde (exposée au Louvre) ?', 'Léonard de Vinci', '["Picasso", "Monet", "Van Gogh"]'::jsonb, 'Culture'),
('Quelle est la fête de la musique ?', 'Le 21 juin', '["Le 14 juillet", "Le 1er mai", "Le 25 décembre"]'::jsonb, 'Culture'),
('Qui est Edith Piaf ?', 'Une chanteuse célèbre', '["Une actrice", "Une écrivaine", "Une scientifique"]'::jsonb, 'Culture'),
('Qui a écrit "L''Étranger" ?', 'Albert Camus', '["Sartre", "Zola", "Proust"]'::jsonb, 'Culture'),
('Quelle région produit le Champagne ?', 'Grand Est (Champagne)', '["Bourgogne", "Bordeaux", "PACA"]'::jsonb, 'Géographie'),
('Où se trouve le Mont-Saint-Michel ?', 'En Normandie', '["En Bretagne (débat)", "En Vendée", "Dans le Nord"]'::jsonb, 'Géographie'),
('Quelle est la préfecture de la région Île-de-France ?', 'Paris', '["Versailles", "Saint-Denis", "Nanterre"]'::jsonb, 'Géographie'),
('Dans quelle ville se trouve le Parlement de Bretagne ?', 'Rennes', '["Nantes", "Brest", "Quimper"]'::jsonb, 'Géographie'),
('Quel fromage est normand ?', 'Le Camembert', '["Le Roquefort", "Le Comté", "Le Brie"]'::jsonb, 'Culture'),
('Quelle est la devise de Paris ?', 'Fluctuat nec mergitur', '["Veni Vidi Vici", "Liberté Égalité Fraternité", "Droit au but"]'::jsonb, 'Culture'),
('Quel célèbre mémorial se trouve à Verdun ?', 'L''Ossuaire de Douaumont', '["Le Mémorial de Caen", "L''Arc de Triomphe", "Les Invalides"]'::jsonb, 'Histoire'),
('Quelle île est surnommée l''Île de Beauté ?', 'La Corse', '["La Martinique", "Oléron", "Ré"]'::jsonb, 'Géographie');
