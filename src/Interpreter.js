// @flow

import type {Program} from './types';

/* eslint-disable no-use-before-define */
export type CommandHandler = { (Interpreter, stepTimeMs: number): Promise<void> };
/* eslint-enable no-use-before-define */

export type InterpreterRunningState = { isRunning: boolean, activeStep: ?number, pausedStep: ?number }
// TODO: I don't think that Interpreter having memory is quite the right
//       factoring. But this will evolve. Maybe something like a parameterized
//       Project<T> that contains program and memory.

export default class Interpreter {
    commands: { [command: string]: { [namespace: string]: CommandHandler } };
    program: Program;
    programCounter: number;
    memory: { [string]: any };
    isRunning: boolean;
    pausedIndex: ?number;
    stepTimeMs: number;
    onRunningStateChange: (InterpreterRunningState) => void;

    constructor(onRunningStateChange: (InterpreterRunningState) => void, stepTimeMs: number) {
        this.commands = {};
        this.program = [];
        this.programCounter = 0;
        this.memory = {};
        // Group isRunning and pausedIndex as a tri state
        this.isRunning = false;
        this.pausedIndex = null;
        this.onRunningStateChange = onRunningStateChange;
        this.stepTimeMs = stepTimeMs;
    }

    addCommandHandler(command: string, namespace: string, handler: CommandHandler) {
        let commandNamespaces = this.commands[command];
        if (!commandNamespaces) {
            commandNamespaces = {};
            this.commands[command] = commandNamespaces;
        }
        commandNamespaces[namespace] = handler;
    }

    setProgram(program: Program): void {
        this.program = program;
        this.programCounter = 0;
    }

    run(program: Program): Promise<void> {
        this.program = program;
        this.programCounter = this.pausedIndex != null ? this.pausedIndex : 0;
        this.isRunning = true;
        return new Promise((resolve, reject) => {
            this.continueRun(resolve, reject);
        });
    }

    continueRun(resolve: (result:any) => void, reject: (error: any) => void): void {
        if (this.isRunning) {
            if (this.atEnd()) {
                this.isRunning = false;
                this.pausedIndex = null;
                this.onRunningStateChange({isRunning: this.isRunning, activeStep: null, pausedStep: null});
                resolve();
            } else {
                this.onRunningStateChange({isRunning: this.isRunning, activeStep: this.programCounter, pausedStep: null});
                this.step().then(() => {
                    this.continueRun(resolve, reject);
                }, (error: Error) => {
                    // Reject the run Promise when the step Promise is rejected
                    this.isRunning = false;
                    this.onRunningStateChange({isRunning: this.isRunning, activeStep: null, pausedStep: null});
                    reject(error);
                });
            }
        } else {
            resolve();
        }
    }

    atEnd(): boolean {
        return this.programCounter >= this.program.length;
    }

    step(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.atEnd()) {
                // We're at the end, nothing to do
                resolve();
            } else {
                this.doCommand(this.program[this.programCounter]).then(() => {
                    // When the command has completed, increment
                    // the programCounter and resolve the step Promise
                    this.programCounter = this.programCounter + 1;
                    resolve();
                }, (error: Error) => {
                    reject(error);
                });
            }
        });
    }

    updatePausedIndex(index: number): void {
        this.pausedIndex = index;
    }

    pause(index: ?number): void {
        this.isRunning = false;
        this.pausedIndex = index;
        this.onRunningStateChange({isRunning: this.isRunning, activeStep: null, pausedStep: index});
    }

    stop(): void {
        this.isRunning = false;
        this.pausedIndex = null;
        this.onRunningStateChange({isRunning: this.isRunning, activeStep: null, pausedStep: null});
    }

    doCommand(command: string): Promise<any> {
        const handlers = this.lookUpCommandHandlers(command);
        if (handlers.length === 0) {
            return Promise.reject(new Error(`Unknown command: ${command}`));
        } else {
            return this.callCommandHandlers(handlers);
        }
    }

    callCommandHandlers(handlers: Array<CommandHandler>): Promise<any> {
        const promises = [];
        const stepTimeMs = this.stepTimeMs;
        for (const handler of handlers) {
            promises.push(handler(this, stepTimeMs));
        }
        return Promise.all(promises);
    };

    lookUpCommandHandlers(command: string): Array<CommandHandler> {
        const commandNamespaces = this.commands[command];
        if (commandNamespaces) {
            const handlers = [];
            for (const namespace in commandNamespaces) {
                handlers.push(commandNamespaces[namespace]);
            }
            return handlers;
        } else {
            return [];
        }
    }

    setStepTime(stepTimeMs: number) {
        this.stepTimeMs = stepTimeMs;
    }
}
