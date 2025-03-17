import * as input from './input'
import * as parser from './parser';
import {Interpreter} from './interpreter'
import {Token, Command} from './classes'

// Main function to run the program
async function main() {

    const filename = await input.ask('File name/path: ');

    const data = input.readfile(filename);

    // console.log("Contents of the file: \n" + data)
    // console.log("-------------")

    const tokens: Token[] = parser.tokenize(data);
    const program: Command[] = parser.parse(tokens);
  
    const int = new Interpreter();

    // int.logcode(program);
    // console.log("-------------")

    await int.execute(program);

    input.rl.close(); // Close the readline interface
}

// Run the main function
main();