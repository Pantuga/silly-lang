import {Command, Token, TokenTypes} from './classes.mjs'

export const NUM_PREFIX = '#'
export const QUOTE = '"'
export const LINE_COMMENT = '>w<'
export const MULTI_L_COMMENT: [string, string] = ['>o<', '>.<']
export const END_COMMAND = '~'

export function strToNum(str: string): number {
    return str.slice(NUM_PREFIX.length) as unknown as number;
}

function colorTxt(text: string, colorCode: string): string {
    return `\x1b[${colorCode}m${text}\x1b[0m`;
}

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
function delComments(code: string, lineCom: string = LINE_COMMENT, quoteCom: [string, string] = MULTI_L_COMMENT): string {
    let out: string = '';
    let inQuoteCom: boolean = false;
    let inLineCom: boolean = false;
    
    for (let i = 0; i < code.length; i++) {
        if (inLineCom) {
            // End line comment at newline
            if (code[i] === '\n') inLineCom = false;
        } else if (inQuoteCom) {
            // Check for the closing delimiter of multi-line comment
            if (isSubstrAt(code.toLowerCase(), quoteCom[1], i)) {
                inQuoteCom = false;
                i += quoteCom[1].length - 1; // Skip the closing delimiter
            }
        } else {
            // Check for line comment
            if (isSubstrAt(code.toLowerCase(), lineCom, i)) {
                inLineCom = true;
                i += lineCom.length - 1; // Skip the line comment delimiter
            }
            // Check for multi-line comment
            else if (isSubstrAt(code.toLowerCase(), quoteCom[0], i)) {
                inQuoteCom = true;
                i += quoteCom[0].length - 1; // Skip the opening delimiter
            }
            // Add non-comment characters to the output
            else {
                out += code[i];
            }
        }
    }

    if (inQuoteCom) console.log(colorTxt(`Warning: multi line comment never closed. Check for missing "${MULTI_L_COMMENT[1]}"`, '33'))
    return out;
}

// Transforms the code string into an array of tokens (See Token class)
// NOT case sensitive!
export function tokenize(code: string, quote: string = QUOTE, intPrefix: string = NUM_PREFIX): Token[] {
    let output: Token[] = [];
    let buff: string = ''; // buffer for value
    let tokenType: number = TokenTypes.ANY; // buffer for type
    let inQuotes: boolean = false; // for quote checking
    const cleancode: string = delComments(code);
    
    for (let ch of cleancode) {
        if (inQuotes) { // checks if the current char. is inside quotes
            if (ch == quote) { // check for closing quote, push the buffer and reset it
                inQuotes = false;
                output.push(new Token(buff, tokenType)); 
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
                    if (isSubstrAt(buff, intPrefix, 0)) tokenType = TokenTypes.INT
                    output.push(new Token(buff.trim().toLowerCase(), tokenType)); // all lower case
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
        output.push(new Token(buff.trim().toLowerCase(), tokenType));
    }

    return output;
}

// syntax:
// [command name] [command args] ~
// where 'command name' is 1 token and 'command args' is a list of tokens
// the command ends with '~' or endCmd, if specified
export function parse(code: Token[], endCmd: string = END_COMMAND): Command[] {
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

    if (buff) console.log(colorTxt(`Warning: last command is not closed. Check for missing "${END_COMMAND}".`, '33'))

    return output;
} 