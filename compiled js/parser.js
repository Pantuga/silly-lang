"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.END_COMMAND = exports.MULTI_L_COMMENT = exports.LINE_COMMENT = exports.QUOTE = exports.NUM_PREFIX = void 0;
exports.strToNum = strToNum;
exports.tokenize = tokenize;
exports.parse = parse;
var classes_1 = require("./classes");
exports.NUM_PREFIX = '#';
exports.QUOTE = '"';
exports.LINE_COMMENT = '>w<';
exports.MULTI_L_COMMENT = ['>o<', '>.<'];
exports.END_COMMAND = '~';
function strToNum(str) {
    return str.slice(exports.NUM_PREFIX.length);
}
function colorTxt(text, colorCode) {
    return "\u001B[".concat(colorCode, "m").concat(text, "\u001B[0m");
}
function isCharSpace(ch) {
    return ch[0] === ' ' || (ch[0] === '\t' || ch[0] === '\n');
}
function isSubstrAt(str, substr, idx) {
    var out = true;
    for (var i = 0; i < substr.length; i++) {
        if (str[i + idx] !== substr[i]) {
            out = false;
            break;
        }
    }
    return out;
}
// cleans comments off the code for the processing
function delComments(code, lineCom, quoteCom) {
    if (lineCom === void 0) { lineCom = exports.LINE_COMMENT; }
    if (quoteCom === void 0) { quoteCom = exports.MULTI_L_COMMENT; }
    var out = '';
    var inQuoteCom = false;
    var inLineCom = false;
    for (var i = 0; i < code.length; i++) {
        if (inLineCom) {
            // End line comment at newline
            if (code[i] === '\n')
                inLineCom = false;
        }
        else if (inQuoteCom) {
            // Check for the closing delimiter of multi-line comment
            if (isSubstrAt(code.toLowerCase(), quoteCom[1], i)) {
                inQuoteCom = false;
                i += quoteCom[1].length - 1; // Skip the closing delimiter
            }
        }
        else {
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
    if (inQuoteCom)
        console.log(colorTxt("Warning: multi line comment never closed. Check for missing \"".concat(exports.MULTI_L_COMMENT[1], "\""), '33'));
    return out;
}
// Transforms the code string into an array of tokens (See Token class)
// NOT case sensitive!
function tokenize(code, quote, intPrefix) {
    if (quote === void 0) { quote = exports.QUOTE; }
    if (intPrefix === void 0) { intPrefix = exports.NUM_PREFIX; }
    var output = [];
    var buff = ''; // buffer for value
    var tokenType = classes_1.TokenTypes.ANY; // buffer for type
    var inQuotes = false; // for quote checking
    var cleancode = delComments(code);
    for (var _i = 0, cleancode_1 = cleancode; _i < cleancode_1.length; _i++) {
        var ch = cleancode_1[_i];
        if (inQuotes) { // checks if the current char. is inside quotes
            if (ch == quote) { // check for closing quote, push the buffer and reset it
                inQuotes = false;
                output.push(new classes_1.Token(buff, tokenType));
                buff = '';
                tokenType = classes_1.TokenTypes.ANY;
            }
            else { // else add to the buffer
                buff += ch;
            }
        }
        else { // if not inside quotes
            if (ch == quote) { // check for opening quote
                inQuotes = true;
                tokenType = classes_1.TokenTypes.STR;
            }
            else if (isCharSpace(ch)) { // else, check for white space
                if (buff.trim() !== '') { // if the buffer is not empty, push the buffer and reset it
                    if (isSubstrAt(buff, intPrefix, 0))
                        tokenType = classes_1.TokenTypes.INT;
                    output.push(new classes_1.Token(buff.trim().toLowerCase(), tokenType)); // all lower case
                    buff = '';
                    tokenType = classes_1.TokenTypes.ANY;
                }
            }
            else { // else add the current char. to the buffer
                buff += ch;
            }
        }
    }
    // Handle the last token if buff is not empty
    if (buff.trim() !== '') {
        output.push(new classes_1.Token(buff.trim().toLowerCase(), tokenType));
    }
    return output;
}
// syntax:
// [command name] [command args] ~
// where 'command name' is 1 token and 'command args' is a list of tokens
// the command ends with '~' or endCmd, if specified
function parse(code, endCmd) {
    if (endCmd === void 0) { endCmd = exports.END_COMMAND; }
    var output = [];
    var buff = null;
    for (var _i = 0, code_1 = code; _i < code_1.length; _i++) {
        var tk = code_1[_i];
        if (!buff) { // if this is first token after an endCmd char.
            buff = new classes_1.Command(tk.value);
        }
        else {
            if (tk.value == endCmd && tk.type == classes_1.TokenTypes.ANY) { // if token is endCmd
                if (buff)
                    output.push(buff);
                buff = null;
            }
            else { // token is an argument
                if (buff)
                    buff.args.push(tk);
            }
        }
    }
    if (buff)
        console.log(colorTxt("Warning: last command is not closed. Check for missing \"".concat(exports.END_COMMAND, "\"."), '33'));
    return output;
}
