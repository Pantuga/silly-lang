import * as input from './input.mjs'
import {Token, Command, TokenTypes} from './classes.mjs'
import {strToNum} from './parser.mjs';

// sorry for long file, most of it is the execute method in the interpreter

const cmds = {
    declare: ':3',
    assign: ':p', // :P

    concat: ':v', // :V
    add: ':d', // :D
    sub: ':c',
    mult: ':}',
    div: ':{',
    inc: '^.^',
    dec: 't.t', // T.T

    in: 'owo', // OwO
    out: 'uwu', // UwU
    error: 'xwx',

    // for normal jumps: "jmp [destination] ~"
    // for condicional jumps: "jmp [destination] [arg1] [condition] [arg2] ~"
    label: 'u.u',
    jmp: 'o.o',
    jmp_eq: ':)',
    jmp_neq: ':(',
    jmp_eq_notype: '>:)',
    jmp_neq_notype: '>:(',
    jmp_gt: ':]',
    jmp_lt: ':[',
    jmp_eq_gt: '>:]',
    jmp_eq_lt: '>:[',


    halt: "x.x"
}

export class Interpreter {
    private varMap: {[idx: string]: number | string} = {
        "_endl": '\n',
        "_tab": '\t',
        "_nan": NaN,
        "_empty_str": '',

        "_prog_counter": 0,

        ":>": 1,
        "_true": 1,
        ":<": 0,
        "_false": 0,
        "twt" /*TwT*/: 0, // random number (to be reevaluated every command)
    };

    logerror(msg: string = 'No further information provided.', error: string = 'Error'): void {
        console.log('\x1b[1m\x1b[31m' + `${error} in Command ${this.varMap._prog_counter}: ` + '\x1b[0m\x1b[31m' + msg + '\x1b[0m')
    }

    logcode(code: Command[]): void {
        code.forEach(cmd => cmd.log());
    }

    concatTokens(array: Token[], start: number = 0): string {
        let out: string = '';
        for (let i = start; i < array.length; i++) {
            out += this.getTokenValue(array[i]);
        }
        return out;
    }
    
    declareVar(name: string, value: number | string): boolean {
        if (name in this.varMap) {
            this.logerror(`Variable ${name} already exists`);
            return false;
        };
        this.varMap[name] = value;
        return true;
    }

    assignVar(name: string, value: number | string): boolean {
        if (name in this.varMap) {
            this.varMap[name] = value;
            return true;
        }
        this.logerror(`Variable "${name}" not found.`);
        return false;
    }

    getTokenValue(token: Token): number | string {
        switch (token.type) {
            case TokenTypes.ANY:
            if (token.value in this.varMap) {
                return this.varMap[token.value];
            } else {
                this.logerror(`Variable "${token.value}" not found.`);
                break;
            }
            case TokenTypes.STR:
                return token.value;
            case TokenTypes.INT:
                return strToNum(token.value);
        }
        return '';
    }

    getName(token: Token): string {
        if (token.type == TokenTypes.ANY) return token.value;

        this.logerror(`${token.value} is not a valid variable name.`)
        return '';
    }

    getKeyword(token: Token): string {
        if (token.type == TokenTypes.ANY && token.value in cmds)
            return token.value;

        this.logerror(`"${token.value}" is not a valid keyword name.`)
        return '';
    }


    getString(token: Token): string {
        switch (token.type) {
            case TokenTypes.ANY:
                if (typeof this.varMap[token.value] == 'string') return this.varMap[token.value] as string;
                else {
                    this.logerror(`${token.value} is not a string.`);
                    break;
                }
            case TokenTypes.STR:
                return token.value;
            case TokenTypes.INT:
                this.logerror(`${token.value} is not a string.`);
                break;
        }
        return '';
    }

    getNum(token: Token): number {
        switch (token.type) {
            case TokenTypes.ANY:
                const value = this.varMap[token.value];
                if (typeof value === 'number') {
                    return value; // Return the number directly
                } else if (typeof value === 'string') {
                    // Try to parse the string as a number
                    const parsed = parseFloat(value);
                    if (!isNaN(parsed)) {
                        return parsed;
                    } else
                        this.logerror(`${token.value} is not a number.`)
                }
                break;
            case TokenTypes.STR:
                this.logerror(`${token.value} is not a number.`);
                break;
            case TokenTypes.INT:
                return strToNum(token.value);
        }
        return NaN;
    }

    checkArgs(cmd: Command, ...sizes: number[]): boolean {
        const out = sizes.includes(cmd.args.length);
        if (!out)
            this.logerror(`Invalid argument count for "${cmd.name}": ${cmd.args.length}. Allowed counts: ${sizes.join(', ')}`)
        return out;
    }

    atLeastArgs(cmd: Command, min: number): boolean {
        const out = cmd.args.length >= min;
        if(!out)
            this.logerror(`Invalid argument count for "${cmd.name}": ${cmd.args.length}. Command must have at least ${min} arguments`);
        return out;
    }

    async execute(code: Command[]) {
        console.log('')
        for (let i = 0; i < code.length; i++) {
            const cmd = code[i];
            
            if (cmd.name === cmds.halt) break; // Stop execution on halt command

            this.varMap._prog_counter = i;
            this.varMap["twt"] = Math.random();

            switch (cmd.name) {
                // input/output
                case cmds.in:
                    if (!this.atLeastArgs(cmd, 2)) break;

                    const inputValue = await input.ask(this.concatTokens(cmd.args, 1));
                    this.assignVar(this.getName(cmd.args[0]), inputValue);
                    break;
                case cmds.out:
                    console.log(this.concatTokens(cmd.args));
                    break;
                case cmds.error:
                    this.logerror(this.concatTokens(cmd.args), 'Runtime Error');
                    break;
                // varables
                case cmds.declare:
                    if (!this.checkArgs(cmd, 1, 2)) break;

                    if (cmd.args.length == 2)
                        this.declareVar(this.getName(cmd.args[0]), this.getTokenValue(cmd.args[1]));
                    else
                        this.declareVar(this.getName(cmd.args[0]), NaN); // Default value for declaration
                    
                    break;
                case cmds.assign:
                    if (!this.checkArgs(cmd, 2)) break;

                    this.assignVar(this.getName(cmd.args[0]), this.getTokenValue(cmd.args[1]))
                    break;
                case cmds.label:
                    if (!this.checkArgs(cmd, 1)) break;

                    this.declareVar(this.getName(cmd.args[0]), this.varMap._prog_counter);
                    break;
                // string operations
                case cmds.concat:
                    if (!this.atLeastArgs(cmd, 2)) break;

                    this.assignVar(this.getName(cmd.args[0]), this.getString(cmd.args[0]).concat(this.concatTokens(cmd.args, 1)))
                    break;
                // number operations/arithmetic
                case cmds.add:
                    if (!this.checkArgs(cmd, 2)) break;

                    this.assignVar(this.getName(cmd.args[0]), this.getNum(cmd.args[0]) + this.getNum(cmd.args[1]))
                    break;
                case cmds.sub:
                    if (!this.checkArgs(cmd, 2)) break;

                    this.assignVar(this.getName(cmd.args[0]), this.getNum(cmd.args[0]) - this.getNum(cmd.args[1]))
                    break;
                case cmds.mult:
                    if (!this.checkArgs(cmd, 2)) break;

                    this.assignVar(this.getName(cmd.args[0]), this.getNum(cmd.args[0]) * this.getNum(cmd.args[1]))
                    break;
                case cmds.div:
                    if (!this.checkArgs(cmd, 2)) break;

                    this.assignVar(this.getName(cmd.args[0]), this.getNum(cmd.args[0]) / this.getNum(cmd.args[1]))
                    break;
                case cmds.inc:
                    case cmds.mult:
                    if (!this.checkArgs(cmd, 1)) break;

                    this.assignVar(this.getName(cmd.args[0]), this.getNum(cmd.args[0]) + 1)
                    break;
                case cmds.dec:
                    if (!this.checkArgs(cmd, 1)) break;

                    this.assignVar(this.getName(cmd.args[0]), this.getNum(cmd.args[0]) - 1)
                    break;
                // jump/flow logic
                case cmds.jmp:
                    if (!this.checkArgs(cmd, 1, 4)) break;

                    if (cmd.args.length == 1)
                        i = this.getNum(cmd.args[0])

                    else switch (this.getKeyword(cmd.args[2])) {
                        case cmds.jmp_eq:
                            if (this.getTokenValue(cmd.args[1]) === this.getTokenValue(cmd.args[2]))
                                i = this.getNum(cmd.args[0])
                            break;
                        case cmds.jmp_neq:
                            if (!(this.getTokenValue(cmd.args[1]) === this.getTokenValue(cmd.args[2])))
                                i = this.getNum(cmd.args[0])
                            break;
                        case cmds.jmp_eq_notype:
                            if (this.getTokenValue(cmd.args[1]) == this.getTokenValue(cmd.args[2]))
                                i = this.getNum(cmd.args[0])
                            break;
                        case cmds.jmp_neq_notype:
                            if (!(this.getTokenValue(cmd.args[1]) == this.getTokenValue(cmd.args[2])))
                                i = this.getNum(cmd.args[0])
                            break;
                        case cmds.jmp_gt:
                            if (this.getTokenValue(cmd.args[1]) > this.getTokenValue(cmd.args[2]))
                                i = this.getNum(cmd.args[0])
                            break;
                        case cmds.jmp_lt:
                            if (this.getTokenValue(cmd.args[1]) < this.getTokenValue(cmd.args[2]))
                                i = this.getNum(cmd.args[0])
                            break;
                        case cmds.jmp_eq_gt:
                            if (this.getTokenValue(cmd.args[1]) >= this.getTokenValue(cmd.args[2]))
                                i = this.getNum(cmd.args[0])
                            break;
                        case cmds.jmp_eq_lt:
                            if (this.getTokenValue(cmd.args[1]) <= this.getTokenValue(cmd.args[2]))
                                i = this.getNum(cmd.args[0])
                            break;
                        default: this.logerror(`The keyword ${cmd.args[2]} is not a valid keyword for a condicional jump.`)
                    }
                    break;
                // default > log an error
                default:
                    this.logerror(`The command "${cmd.name}" does not exit`)
            }
        }

        input.rl.close()
    }
}