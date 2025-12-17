export type ContenuApprentissage = {
    id: number | string;
    titre: string;
    texte_synthese: string;
    type_module: string; // 'Histoire', 'Institutions', 'Valeurs'
    audio_url?: string;
    created_at: string;
};



export type UserProfile = {
    id: string;
    nom_prenom: string | null;
    profil_situation: string | null;
    email?: string;
    is_admin?: boolean;
    // Extended profile fields
    sexe?: 'M' | 'F' | null;
    date_naissance?: string | null;
    pays_naissance?: string | null;
    ville_residence?: string | null;
    profession?: string | null;
    nationalite_origine?: string | null;
    date_arrivee_france?: string | null;
    niveau_francais?: string | null;
};

export type UserStats = {
    totalTests: number;
    avgScore: number;
    history?: { score_pourcentage: number; date_test: string }[];
};
