//@flow

import ProgramParser from './ProgramParser';

test('Parse empty string', () => {
    expect((new ProgramParser()).parse('')).toStrictEqual([]);
});

test('Parse unsupported character', () => {
    expect(() => {
        (new ProgramParser()).parse('f');
    }).toThrowError(/^Unexpected character: f$/);
});

test('Parse 1', () => {
    expect((new ProgramParser()).parse('1')).toStrictEqual(['forward1']);
});

test('Parse 2', () => {
    expect((new ProgramParser()).parse('2')).toStrictEqual(['forward2']);
});

test('Parse 3', () => {
    expect((new ProgramParser()).parse('3')).toStrictEqual(['forward3']);
});

test('Parse A', () => {
    expect((new ProgramParser()).parse('A')).toStrictEqual(['left45']);
});

test('Parse B', () => {
    expect((new ProgramParser()).parse('B')).toStrictEqual(['left90']);
});

test('Parse D', () => {
    expect((new ProgramParser()).parse('D')).toStrictEqual(['left180']);
});

test('Parse a', () => {
    expect((new ProgramParser()).parse('a')).toStrictEqual(['right45']);
});

test('Parse b', () => {
    expect((new ProgramParser()).parse('b')).toStrictEqual(['right90']);
});

test('Parse d', () => {
    expect((new ProgramParser()).parse('d')).toStrictEqual(['right180']);
});

test('Parse program with multiple commands', () => {
    expect((new ProgramParser()).parse('123ABDabd')).toStrictEqual([
        'forward1',
        'forward2',
        'forward3',
        'left45',
        'left90',
        'left180',
        'right45',
        'right90',
        'right180'
    ]);
});
