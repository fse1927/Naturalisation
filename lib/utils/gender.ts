/**
 * Gender-aware text utilities for French language
 * Avoids the (e) suffix by using the user's gender preference
 */

export type Gender = 'M' | 'F' | null | undefined;

/**
 * Returns the correct gendered suffix for French words
 * @param gender - 'M' for masculine, 'F' for feminine
 * @param masculineSuffix - Suffix for masculine (usually empty)
 * @param feminineSuffix - Suffix for feminine (usually 'e')
 * @returns The appropriate suffix based on gender, or "(e)" if gender unknown
 */
export function genderSuffix(
    gender: Gender,
    feminineSuffix: string = 'e',
    masculineSuffix: string = ''
): string {
    if (gender === 'F') return feminineSuffix;
    if (gender === 'M') return masculineSuffix;
    return `(${feminineSuffix})`; // Fallback for unknown gender
}

/**
 * Common gendered words helper
 */
export const genderedWords = {
    // Profession/Status
    employee: (g: Gender) => `Employé${genderSuffix(g)}`,
    student: (g: Gender) => `Étudiant${genderSuffix(g)}`,
    retired: (g: Gender) => `Retraité${genderSuffix(g)}`,
    unemployed: (g: Gender) => `Au chômage`,

    // Marital Status
    single: () => 'Célibataire',
    married: (g: Gender) => `Marié${genderSuffix(g)}`,
    pacs: (g: Gender) => `Pacsé${genderSuffix(g)}`,
    divorced: (g: Gender) => `Divorcé${genderSuffix(g)}`,
    widowed: (g: Gender) => g === 'F' ? 'Veuve' : g === 'M' ? 'Veuf' : 'Veuf/Veuve',

    // General
    learner: (g: Gender) => `Apprenant${genderSuffix(g)}`,
    beginner: (g: Gender) => `Débutant${genderSuffix(g)}`,
    expert: (g: Gender) => `Expert${genderSuffix(g)}`,
    citizen: (g: Gender) => `Citoyen${g === 'F' ? 'ne' : g === 'M' ? '' : '(ne)'}`,
    french: (g: Gender) => `Français${genderSuffix(g, 'e', '')}`,
};
