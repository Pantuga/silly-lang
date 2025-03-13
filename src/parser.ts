import {Command, Token, TokenTypes} from './classes'

function isCharSpace(ch: string): boolean {
    return ch[0] === ' ' || (ch[0] === '\t' || ch[0] === '\n')
}

function isSubstrAt(str: string, substr: string, idx: number): boolean {
    let out: boolean = true;
    for (let i = 0; i < substr.length; i++) {
        if (str[i+ idx] !== substr[i]) {
            out = false;
            break;
        }
    }
    return out;
}

// cleans comments off the code for the processing
function delComments(code: string, lineCom: string = '>w<', quoteCom: [string, string] = ['>o<', '>.<']): string {
    let out: string = '';
    let inQuoteCom: boolean = false;
    let inLineCom: boolean = false;
    
    for (let i = 0; i < code.length; i++) {
        if (inLineCom) {
            // End line comment at newline
            if (code[i] === '\n') inLineCom = false;
        } else if (inQuoteCom) {
            // Check for the closing delimiter of multi-line comment
            if (isSubstrAt(code, quoteCom[1], i)) {
                inQuoteCom = false;
                i += quoteCom[1].length - 1; // Skip the closing delimiter
            }
        } else {
            // Check for line comment
            if (isSubstrAt(code, lineCom, i)) {
                inLineCom = true;
                i += lineCom.length - 1; // Skip the line comment delimiter
            }
            // Check for multi-line comment
            else if (isSubstrAt(code, quoteCom[0], i)) {
                inQuoteCom = true;
                i += quoteCom[0].length - 1; // Skip the opening delimiter
            }
            // Add non-comment characters to the output
            else {
                out += code[i];
            }
        }
    }

    return out;
}

// Transforms the code string into an array of tokens (See Token class)
// NOT case sensitive!
export function tokenize(code: string, quote: string = '"'): Token[] {
    let output: Token[] = [];
    let buff: string = ''; // buffer for value
    let tokenType: number = TokenTypes.ANY; // buffer for type
    let inQuotes: boolean = false; // for quote checking
    const cleancode: string = delComments(code).toLowerCase(); // from here ALL code is in lower case
    
    for (let ch of cleancode) {
        if (inQuotes) { // checks if the current char. is inside quotes
            if (ch == quote) { // check for closing quote, push the buffer and reset it
                inQuotes = false;
                output.push(new Token(buff.trim(), tokenType)); 
                buff = '';
                tokenType = TokenTypes.ANY;
            } else { // else add to the buffer
                buff += ch;
            }
        } else { // if not inside quotes
            if (ch == quote) { // check for opening quote
                inQuotes = true;
                tokenType = TokenTypes.STR;
            } else if (isCharSpace(ch)) { // else, check for white space
                if (buff.trim() !== '') { // if the buffer is not empty, push the buffer and reset it
                    output.push(new Token(buff.trim(), tokenType));
                    buff = '';
                    tokenType = TokenTypes.ANY;
                }
            } else { // else add the current char. to the buffer
                buff += ch;
            }
        }
    }

    // Handle the last token if buff is not empty
    if (buff.trim() !== '') {
        output.push(new Token(buff.trim(), tokenType));
    }

    return output;
}

// syntax:
// [command name] [command args] ~
// where 'command name' is 1 token and 'command args' is a list of tokens
// the command ends with '~' or endCmd, if specified
export function parse(code: Token[], endCmd: string = '~'): Command[] {
    let output: Command[] = [];
    let buff: Command | null = null;

    for (let tk of code) {
        if (!buff) { // if this is first token after an endCmd char.
            buff = new Command(tk.value);
        } else {
            if (tk.value == endCmd && tk.type == TokenTypes.ANY) { // if token is endCmd
                if (buff) output.push(buff);
                buff = null;
            } else { // token is an argument
                if (buff) buff.args.push(tk);
            }
        }
    }

    return output;
} 