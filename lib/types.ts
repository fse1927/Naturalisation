export type ContenuApprentissage = {
    id: number | string;
    titre: string;
    texte_synthese: string;
    type_module: string; // 'Histoire', 'Institutions', 'Valeurs'
    audio_url?: string;
    created_at: string;
};

export type Question = {
    id: number;
    question: string;
    reponse_correcte: string;
    autres_reponses_fausses: string[];
    theme: string;
    created_at: string;
};

export type UserProfile = {
    id: string;
    nom_prenom: string | null;
    profil_situation: string | null;
    email?: string;
};

export type UserStats = {
    totalTests: number;
    avgScore: number;
    history?: { score_pourcentage: number; date_test: string }[];
};
