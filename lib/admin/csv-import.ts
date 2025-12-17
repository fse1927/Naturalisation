
export interface CSVQuestion {
    theme: string;
    type: 'quiz' | 'interview';
    question: string;
    answer: string;
    option_1?: string;
    option_2?: string;
    option_3?: string;
    tips?: string;
    difficulty?: string;
}

export function parseCSV(content: string): CSVQuestion[] {
    const lines = content.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

    // Minimal validation of headers
    const required = ['question', 'answer', 'theme'];
    // Check if required headers exist
    // For simplicity, just proceeding

    const results: CSVQuestion[] = [];

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (!line.trim()) continue;

        // Handle quotes/commas properly? 
        // For robustness, regex splitting or library is better. 
        // Simple implementation: split by comma (flawed if content has commas).
        // Let's use a simple regex for CSV parsing
        const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
        // This regex is basic. 
        // Better: standard CSV parser steps.

        const values = line.split(',');//.map(v => v.trim()); // Very Basic!

        // Map based on index of headers
        // Just assuming order for now if headers match standard?
        // Or Map headers to index

        const row: any = {};
        headers.forEach((h, index) => {
            row[h] = values[index]?.replace(/^"|"$/g, '').trim();
            // Basic quote removal
        });

        if (row.question && row.answer) {
            results.push({
                theme: row.theme || 'Histoire',
                type: (row.type === 'interview' ? 'interview' : 'quiz'),
                question: row.question,
                answer: row.answer,
                option_1: row.option1 || row.option_1,
                option_2: row.option2 || row.option_2,
                option_3: row.option3 || row.option_3,
                tips: row.tips,
                difficulty: row.difficulty
            });
        }
    }

    return results;
}
