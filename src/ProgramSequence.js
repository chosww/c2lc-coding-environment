// @flow

import type { Program } from './types';

export default class ProgramSequence {
    program: Program;
    programCounter: number;
    loopStack: Array<any>;

    constructor(program: Program, programCounter: number, loopStack: any) {
        this.program = program;
        this.programCounter = programCounter;
        this.loopStack = loopStack;
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

    getLoopStack() {
        return this.loopStack;
    }

    updateProgram(program: Program): ProgramSequence {
        return new ProgramSequence(program, this.programCounter, this.loopStack);
    }

    updateProgramCounter(programCounter: number): ProgramSequence {
        return new ProgramSequence(this.program, programCounter, this.loopStack);
    }

    updateProgramAndProgramCounter(program: Program, programCounter: number): ProgramSequence {
        return new ProgramSequence(program, programCounter, this.loopStack);
    }

    updateProgramAndLoopStack(program: Program, loopStack): ProgramSequence {
        return new ProgramSequence(program, this.programCounter, loopStack);
    }

    incrementProgramCounter(): ProgramSequence {
        return new ProgramSequence(this.program, this.programCounter + 1, this.loopStack);
    }

    // updateLoopStackNestedLoops() {
    //     for (const [key, value] of this.loopStack) {
    //         const {startIndex, endIndex} = value;
    //         value.nestedLoops = this.getNestedLoops(startIndex, endIndex);
    //         this.loopStack.set(key, value);
    //         console.log(this.loopStack);
    //     }
    //     return new ProgramSequence(this.program, this.programCounter, this.loopStack);
    // }

    appendLoopStack(index: number): ProgramSequence {
        const program = this.program.slice();
        program.splice(index, 0, 'loopStart');
        const loopId = `loop-${this.loopStack.size}`;
        const updatedLoopStack = this.updateLoopStack(index);
        //console.log(updatedLoopStack);
        this.loopStack.set(loopId, {
            startIndex: index,
            endIndex: index + 1,
            iterations: 1,
            iterationsLeft: 1,
            nestedLoops: []
        });
        return new ProgramSequence(program, this.programCounter, updatedLoopStack);
    }

    updateLoopCounter(loopId: string, counter: number): ProgramSequence {
        const loopStep = this.loopStack.get(loopId);
        if (loopStep) {
            Object.assign(loopStep, {
                iterations: counter,
                iterationsLeft: counter
            });
        }
        this.loopStack.set(loopId, loopStep);
        return new ProgramSequence(this.program, this.programCounter, this.loopStack);
    }

    decrementLoopCounter(loopId: string): ProgramSequence {
        const loopStep = this.loopStack.get(loopId);
        if (loopStep) {
            Object.assign(loopStep, {
                iterationsLeft: loopStep.iterationsLeft - 1
            });
        }
        this.loopStack.set(loopId, loopStep);
        return new ProgramSequence(this.program, this.programCounter, this.loopStack);
    }

    getNestedLoops(start: number, end: number) {
        const childrenLoops = [];
        for (const [key, value] of this.loopStack) {
            const { startIndex } = value;
            if (start < startIndex && end > startIndex) {
                console.log('push');
                childrenLoops.push(key);
            }
        }
        return childrenLoops;
    }

    updateLoopStack(index: number) {
        const currentLoopStack = this.loopStack;
        for (const [key, value] of currentLoopStack) {
            const { startIndex, endIndex } = value;
            console.log(`start index is ${startIndex} end index is ${endIndex}`);
            if (startIndex > index) {
                value.startIndex += 2;
                value.endIndex += 2;
                currentLoopStack.set(key, value);
            } else if (startIndex < index && endIndex >= index){
                // within a loop
                value.endIndex += 2;
                currentLoopStack.set(key, value);
            }
        }
        return currentLoopStack;
    }

    overwriteStep(index: number, command: string): ProgramSequence {
        const program = this.program.slice();
        program[index] = command;
        return this.updateProgram(program);
    }

    insertStep(index: number, command: string): ProgramSequence {
        const program = this.program.slice();
        program.splice(index, 0, command);
        if (index <= this.programCounter) {
            return this.updateProgramAndProgramCounter(program, this.programCounter + 1);
        } else {
            return this.updateProgram(program);
        }
    }

    deleteStep(index: number): ProgramSequence {
        const program = this.program.slice();
        program.splice(index, 1);
        if (index < this.programCounter && this.program.length > 1) {
            return this.updateProgramAndProgramCounter(program, this.programCounter - 1);
        } else {
            return this.updateProgram(program);
        }
    }

    swapStep(indexFrom: number, indexTo: number): ProgramSequence {
        const program = this.program.slice();
        if (program[indexFrom] != null && program[indexTo] != null) {
            const currentStep = program[indexFrom];
            program[indexFrom] = program[indexTo];
            program[indexTo] = currentStep;
            if (program[indexFrom] === 'loopEnd') {

            }
        }
        return this.updateProgram(program);
    }
}
