import * as readline from 'readline';
import * as fs from 'fs';

// Create an interface for reading input
export const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Function to collect user input
export function ask(question: string): Promise<string> {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
}

export function readfile(name: string, encoding: any = 'utf8'): string {
    try {
        return fs.readFileSync(name, encoding) as unknown as string;
    } catch (err) {
        console.error("Error reading the file: ", err);
        return '';
    }
}