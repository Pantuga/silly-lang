export enum TokenTypes {
    ANY,
    STR
}

// for lexing and tokenization
// makes parsing easier nad more clean
export class Token {
    public value: string = '';
    public type: number = 0;

    constructor (value: string, type: number = TokenTypes.ANY) {
        this.value = value;
        this.type = type;
    }

    log(indent: string = ''): void {
        console.log(`${indent}${this.value} (${this.type})`)
    }
}

// product of parser
// interpreted bt the interpreter module
export class Command {
    public name: Token;
    public args: Token[];

    constructor (name: string, args: Token[] = []) {
        this.name = new Token(name);
        this.args = args
    }

    log(): void {
        console.log(`${this.name.value}: `);
        for (let tk of this.args) {
            tk.log('    ');
        }
        console.log('');
    }
}