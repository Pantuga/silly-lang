import {Token, Command} from './classes'

export function logcode(code: Command[]): void {
    code.forEach(cmd => cmd.log());
}

export class MemoryTape {
    private tape: number[];

    constructor (size: number) {
        this.tape = [];
        for (let i = 0; i < size; i++) {
            this.tape.push(0)
        }
    }
    
    at(idx: number): number {
        return this.tape[idx];
    }
}

export class Interpreter {

}