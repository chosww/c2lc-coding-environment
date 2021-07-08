// @flow

import type { Program } from './types';

export default class ProgramSequence {
    program: Program;
    programCounter: number;
    editingDisabled: boolean;

    constructor(program: Program, programCounter: number, editingDisabled: boolean) {
        this.program = program;
        this.programCounter = programCounter;
        this.editingDisabled = editingDisabled;
    }

    getProgram(): Program {
        return this.program;
    }

    getProgramLength(): number {
        return this.program.length;
    }

    getProgramCounter(): number {
        return this.programCounter;
    }

    getCurrentProgramStep(): string {
        return this.program[this.programCounter];
    }

    getProgramStepAt(index: number): string {
        return this.program[index];
    }

    updateProgram(program: Program): ProgramSequence {
        return new ProgramSequence(program, this.programCounter, this.editingDisabled);
    }

    updateProgramCounter(programCounter: number): ProgramSequence {
        return new ProgramSequence(this.program, programCounter, this.editingDisabled);
    }

    updateProgramAndProgramCounter(program: Program, programCounter: number): ProgramSequence {
        return new ProgramSequence(program, programCounter, this.editingDisabled);
    }

    updateEditingDisabled(editingDisabled: boolean): ProgramSequence {
        return new ProgramSequence(this.program, this.programCounter, editingDisabled);
    }

    incrementProgramCounter(): ProgramSequence {
        return new ProgramSequence(this.program, this.programCounter + 1, this.editingDisabled);
    }

    overwriteStep(index: number, command: string): ProgramSequence {
        if (!this.editingDisabled) {
            const program = this.program.slice();
            program[index] = command;
            return this.updateProgram(program);
        }
        return this;
    }

    insertStep(index: number, command: string): ProgramSequence {
        if (!this.editingDisabled) {
            const program = this.program.slice();
            program.splice(index, 0, command);
            if (index <= this.programCounter) {
                return this.updateProgramAndProgramCounter(program, this.programCounter + 1);
            } else {
                return this.updateProgram(program);
            }
        }
        return this;
    }

    deleteStep(index: number): ProgramSequence {
        if (!this.editingDisabled) {
            const program = this.program.slice();
            program.splice(index, 1);
            if (index < this.programCounter && this.program.length > 1) {
                return this.updateProgramAndProgramCounter(program, this.programCounter - 1);
            } else {
                return this.updateProgram(program);
            }
        }
        return this;
    }

    swapStep(indexFrom: number, indexTo: number): ProgramSequence {
        if (!this.editingDisabled) {
            const program = this.program.slice();
            if (program[indexFrom] != null && program[indexTo] != null) {
                const currentStep = program[indexFrom];
                program[indexFrom] = program[indexTo];
                program[indexTo] = currentStep;
            }
            return this.updateProgram(program);
        }
        return this;
    }
}
