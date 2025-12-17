
import * as fs from 'fs';
import * as path from 'path';

function walk(dir: string, callback: (path: string) => void) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filepath = path.join(dir, file);
        const stats = fs.statSync(filepath);
        if (stats.isDirectory()) {
            walk(filepath, callback);
        } else if (stats.isFile()) {
            callback(filepath);
        }
    }
}

const root = path.resolve(__dirname, '../app');
walk(root, (filepath) => {
    if (!filepath.endsWith('.tsx') && !filepath.endsWith('.ts')) return;

    const content = fs.readFileSync(filepath, 'utf-8');
    const lines = content.split('\n');
    if (lines.length >= 33) {
        const line33 = lines[32]; // 0-indexed
        if (line33.includes('g') || lines[33]?.includes('g')) { // Check 33 and 34 just in case
            console.log(`\nFile: ${filepath}`);
            console.log(`Line 33: ${line33.trim()}`);
        }
    }
});
