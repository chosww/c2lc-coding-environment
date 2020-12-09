// @flow

import CharacterState from './CharacterState';
import * as C2lcMath from './C2lcMath';

// TODO: Figure out a better mechanism for using Jest expect.extend()
//       with Flow than casting the expect() result to 'any'.

expect.extend({
    toHaveCharacterState(received, xPos, yPos, direction, path) {
        const pass =
            C2lcMath.approxEqual(received.xPos, xPos, 0.0001)
            && C2lcMath.approxEqual(received.yPos, yPos, 0.0001)
            && received.direction === direction
            && received.pathEquals(path, 0.0001);
        if (pass) {
            return {
                message: () => {
                    return 'Expected not:\n'
                        + `    xPos: ${xPos}\n`
                        + `    yPos: ${yPos}\n`
                        + `    direction: ${direction}\n`
                        + `    path: ${JSON.stringify(path)}\n`
                        + `Received: ${this.utils.printReceived(received)}`;
                },
                pass: true
            };
        } else {
            return {
                message: () => {
                    return 'Expected:\n'
                        + `    xPos: ${xPos}\n`
                        + `    yPos: ${yPos}\n`
                        + `    direction: ${direction}\n`
                        + `    path: ${JSON.stringify(path)}\n`
                        + `Received: ${this.utils.printReceived(received)}`;
                },
                pass: false
            };
        }
    }
});

test('CharacterState.pathEquals', () => {
    const oneSegment = [{x1: 100, y1: 200, x2: 300, y2: 400}];
    const twoSegments = [
        {x1: 100, y1: 200, x2: 300, y2: 400},
        {x1: 500, y1: 600, x2: 700, y2: 800}
    ];

    expect(new CharacterState(0, 0, 0, []).pathEquals([], 1)).toBeTruthy();

    expect(new CharacterState(0, 0, 0, []).pathEquals(oneSegment, 1)).toBeFalsy();
    expect(new CharacterState(0, 0, 0, []).pathEquals(twoSegments, 1)).toBeFalsy();
    expect(new CharacterState(0, 0, 0, oneSegment).pathEquals([], 1)).toBeFalsy();
    expect(new CharacterState(0, 0, 0, oneSegment).pathEquals(twoSegments, 1)).toBeFalsy();
    expect(new CharacterState(0, 0, 0, twoSegments).pathEquals([], 1)).toBeFalsy();
    expect(new CharacterState(0, 0, 0, twoSegments).pathEquals(oneSegment, 1)).toBeFalsy();

    expect(new CharacterState(0, 0, 0, oneSegment).pathEquals([
            {x1: 100, y1: 200, x2: 300, y2: 400}
        ], 1)).toBeTruthy();

    expect(new CharacterState(0, 0, 0, twoSegments).pathEquals([
            {x1: 100, y1: 200, x2: 300, y2: 400},
            {x1: 500, y1: 600, x2: 700, y2: 800}
        ], 1)).toBeTruthy();

    expect(new CharacterState(0, 0, 0, twoSegments).pathEquals([
            {x1: 100, y1: 200, x2: 300, y2: 400},
            {x1: 501, y1: 600, x2: 700, y2: 800}
        ], 1)).toBeFalsy();

    expect(new CharacterState(0, 0, 0, twoSegments).pathEquals([
            {x1: 100, y1: 200, x2: 300, y2: 400},
            {x1: 500, y1: 601, x2: 700, y2: 800}
        ], 1)).toBeFalsy();

    expect(new CharacterState(0, 0, 0, twoSegments).pathEquals([
            {x1: 100, y1: 200, x2: 300, y2: 400},
            {x1: 500, y1: 600, x2: 701, y2: 800}
        ], 1)).toBeFalsy();

    expect(new CharacterState(0, 0, 0, twoSegments).pathEquals([
            {x1: 100, y1: 200, x2: 300, y2: 400},
            {x1: 500, y1: 600, x2: 700, y2: 801}
        ], 1)).toBeFalsy();
});

test('CharacterState.getDirectionDegrees() should return the direction in degrees', () => {
    expect(new CharacterState(0, 0, 0, []).getDirectionDegrees()).toBe(0);
    expect(new CharacterState(0, 0, 1, []).getDirectionDegrees()).toBe(45);
    expect(new CharacterState(0, 0, 2, []).getDirectionDegrees()).toBe(90);
    expect(new CharacterState(0, 0, 3, []).getDirectionDegrees()).toBe(135);
    expect(new CharacterState(0, 0, 4, []).getDirectionDegrees()).toBe(180);
    expect(new CharacterState(0, 0, 5, []).getDirectionDegrees()).toBe(225);
    expect(new CharacterState(0, 0, 6, []).getDirectionDegrees()).toBe(270);
    expect(new CharacterState(0, 0, 7, []).getDirectionDegrees()).toBe(315);
});

test('The character can move in 8 directions (N, NE, E, SE, S, SW, W, NW)', () => {
    // N
    (expect(new CharacterState(0, 0, 0, []).forward(100, true)): any)
        .toHaveCharacterState(0, -100, 0, [{x1: 0, y1: 0, x2: 0, y2: -100}]);
    // NE
    (expect(new CharacterState(0, 0, 1, []).forward(100, true)): any)
        .toHaveCharacterState(100, -100, 1, [{x1: 0, y1: 0, x2: 100, y2: -100}]);
    // E
    (expect(new CharacterState(0, 0, 2, []).forward(100, true)): any)
        .toHaveCharacterState(100, 0, 2, [{x1: 0, y1: 0, x2: 100, y2: 0}]);
    // SE
    (expect(new CharacterState(0, 0, 3, []).forward(100, true)): any)
        .toHaveCharacterState(100, 100, 3, [{x1: 0, y1: 0, x2: 100, y2: 100}]);
    // S
    (expect(new CharacterState(0, 0, 4, []).forward(100, true)): any)
        .toHaveCharacterState(0, 100, 4, [{x1: 0, y1: 0, x2: 0, y2: 100}]);
    // SW
    (expect(new CharacterState(0, 0, 5, []).forward(100, true)): any)
        .toHaveCharacterState(-100, 100, 5, [{x1: 0, y1: 0, x2: -100, y2: 100}]);
    // W
    (expect(new CharacterState(0, 0, 6, []).forward(100, true)): any)
        .toHaveCharacterState(-100, 0, 6, [{x1: 0, y1: 0, x2: -100, y2: 0}]);
    // NW
    (expect(new CharacterState(0, 0, 7, []).forward(100, true)): any)
        .toHaveCharacterState(-100, -100, 7, [{x1: 0, y1: 0, x2: -100, y2: -100}]);
});

test('Turn Left moves anti-clockwise and wraps at N', () => {
    (expect(new CharacterState(0, 0, 3, []).turnLeft(1)): any)
        .toHaveCharacterState(0, 0, 2, []);
    (expect(new CharacterState(0, 0, 3, []).turnLeft(3)): any)
        .toHaveCharacterState(0, 0, 0, []);
    (expect(new CharacterState(0, 0, 3, []).turnLeft(4)): any)
        .toHaveCharacterState(0, 0, 7, []);
});

test('Turn Right moves clockwise and wraps at N', () => {
    (expect(new CharacterState(0, 0, 5, []).turnRight(1)): any)
        .toHaveCharacterState(0, 0, 6, []);
    (expect(new CharacterState(0, 0, 5, []).turnRight(3)): any)
        .toHaveCharacterState(0, 0, 0, []);
    (expect(new CharacterState(0, 0, 5, []).turnRight(4)): any)
        .toHaveCharacterState(0, 0, 1, []);
});

test('Each Forward move should create a path segment', () => {
    (expect(new CharacterState(0, 0, 2, []).forward(100, true).forward(100, true)): any)
        .toHaveCharacterState(200, 0, 2, [
            {x1: 0, y1: 0, x2: 100, y2: 0},
            {x1: 100, y1: 0, x2: 200, y2: 0}
        ]);
    (expect(new CharacterState(0, 0, 2, []).forward(100, true).turnLeft(2).forward(100, true)): any)
        .toHaveCharacterState(100, -100, 0, [
            {x1: 0, y1: 0, x2: 100, y2: 0},
            {x1: 100, y1: 0, x2: 100, y2: -100}
        ]);
    (expect(new CharacterState(0, 0, 2, []).forward(100, true).turnRight(2).forward(100, true)): any)
        .toHaveCharacterState(100, 100, 4, [
            {x1: 0, y1: 0, x2: 100, y2: 0},
            {x1: 100, y1: 0, x2: 100, y2: 100}
        ]);
});

test('Forward move should not create a path segment, when drawingEnabled is false', () => {
    (expect(new CharacterState(0, 0, 2, []).forward(100, false)): any)
        .toHaveCharacterState(100, 0, 2, []);
    (expect(new CharacterState(0, 0, 2, []).forward(100, false).forward(200, true)): any)
        .toHaveCharacterState(300, 0, 2, [
            {x1: 100, y1: 0, x2: 300, y2: 0}
        ]);
    (expect(new CharacterState(0, 0, 2, []).forward(100, true).forward(200, false)): any)
        .toHaveCharacterState(300, 0, 2, [
            {x1: 0, y1: 0, x2: 100, y2: 0}
        ]);
    (expect(new CharacterState(0, 0, 2, []).forward(100, false).forward(200, false)): any)
        .toHaveCharacterState(300, 0, 2, []);
});

test('When direction is not an integer in range 0-7, forward() should throw an Error', () => {
    expect.assertions(3);

    expect(() => {
        (new CharacterState(0, 0, -1, [])).forward(1, false);
    }).toThrowError(/^CharacterState direction must be an integer in range 0-7 inclusive$/);

    expect(() => {
        (new CharacterState(0, 0, 8, [])).forward(1, false);
    }).toThrowError(/^CharacterState direction must be an integer in range 0-7 inclusive$/);

    expect(() => {
        (new CharacterState(0, 0, 0.5, [])).forward(1, false);
    }).toThrowError(/^CharacterState direction must be an integer in range 0-7 inclusive$/);
});
