// @flow

import type {Program} from './types';

function deleteStep(program: Program, index: number): Program {
    // Make a shallow copy before we modify it with splice()
    program = program.slice();
    program.splice(index, 1);
    return program;
};

function expandProgram(program: Program, length: number, fill: string): Program {
    // Make a shallow copy before we add to the program
    program = program.slice();
    while (program.length < length) {
        program.push(fill);
    }
    return program;
};

function insert(program: Program, index: number, command: string, fill: string): Program {
    program = expandProgram(program, index, fill);
    program.splice(index, 0, command);
    return program;
};

function shift(program: Program, index: number, commands: array<string>, fill: string): Program {
    const shiftBy = index + commands.length;
    program = program.slice();
    for (let i=index; i<shiftBy; i++) {
        program.splice(i, 0, commands[i-index]);
    }
    return program;
};

function overwrite(program: Program, index: number, command: string, fill: string): Program {
    program = expandProgram(program, index + 1, fill);
    program[index] = command;
    return program;
};

function trimEnd(program: Program, commandToTrim: string): Program {
    // Make a shallow copy before we trim
    program = program.slice();
    while ((program.length > 0)
            && (program[program.length - 1] === commandToTrim)) {
        program.pop();
    }
    return program;
};

export {
    deleteStep,
    expandProgram,
    insert,
    shift,
    overwrite,
    trimEnd
};
