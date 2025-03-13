import * as readline from 'readline';
import * as fs from 'fs';
import * as parser from './parser';
import * as interpreter from './interpreter'
import {Token, Command} from './classes'

// Create an interface for reading input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Function to collect user input
function ask(question: string): Promise<string> {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
}

function readfile(name: string, encoding: any = 'utf8'): string {
    try {
        return fs.readFileSync(name, encoding) as unknown as string;
    } catch (err) {
        console.error("Error reading the file: ", err);
        return '';
    }
}

// Main function to run the program
async function main() {

    const filename = await ask('File name/path: ');
    rl.close(); // Close the readline interface

    const data = readfile(filename);
    console.log("Contents of the file: \n" + data)

    console.log("-------------")

    const tokens: Token[] = parser.tokenize(data);
    const program: Command[] = parser.parse(tokens);
    interpreter.logcode(program);
    
}

// Run the main function
main();