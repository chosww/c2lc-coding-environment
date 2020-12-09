//@flow

import type { Program } from './types';

type ProgramToken = 'forward1' | 'forward2' | 'forward3' |
                    'left45' | 'left90' | 'left180' |
                    'right45' | 'right90' | 'right180' |
                    'eof';

export default class ProgramParser {
    text: string;
    textIndex: number;
    ch: string;

    constructor() {
        this.text = '';
        this.textIndex = 0;
        this.ch = 'eof';
    }

    parse(text: string): Program {
        this.text = text;
        this.textIndex = 0;
        this.nextCh();

        const program  = [];
        let token = this.getToken();
        while (token !== 'eof') {
            program.push(token);
            token = this.getToken();
        }
        return program;
    }

    getToken(): ProgramToken {
        switch(this.ch) {
            case 'eof': return 'eof';
            case '1':
                this.nextCh();
                return 'forward1';
            case '2':
                this.nextCh();
                return 'forward2';
            case '3':
                this.nextCh();
                return 'forward3';
            case 'A':
                this.nextCh();
                return 'left45';
            case 'B':
                this.nextCh();
                return 'left90';
            case 'D':
                this.nextCh();
                return 'left180';
            case 'a':
                this.nextCh();
                return 'right45';
            case 'b':
                this.nextCh();
                return 'right90';
            case 'd':
                this.nextCh();
                return 'right180';
            default:
                throw new Error(`Unexpected character: ${this.ch}`);
        }
    }

    getInteger(): number {
        let digits = '';
        while (this.isDigit()) {
            digits += this.ch;
            this.nextCh();
        }
        return parseInt(digits, 10);
    }

    nextCh() {
        if (this.textIndex >= this.text.length) {
            this.ch = 'eof';
        } else {
            this.ch = this.text.charAt(this.textIndex);
            this.textIndex += 1;
        }
    }

    isDigit(): boolean {
        return (this.ch >= '0' && this.ch <= '9');
    }
};
