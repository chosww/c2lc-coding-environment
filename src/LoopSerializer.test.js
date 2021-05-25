// @flow

import LoopSerializer from './LoopSerializer';

test('Serialize loop stack', () => {
    const loopSerializer = new LoopSerializer();
    const loopStack = new Map();
    loopStack.set('loop-1', {
        startIndex: 1,
        endIndex: 2,
        iterations: 1,
        iterationsLeft: 1
    });
    loopStack.set('loop-2', {
        startIndex: 4,
        endIndex: 5,
        iterations: 1,
        iterationsLeft: 1
    });
    expect(loopSerializer.serialize(loopStack)).toBe('1-1-2-1_2-4-5-1');
});

// test('Deserialize loop stack', () => {
//     const loopSerializer = new LoopSerializer();
//     const loopText = '1-1-2-1_2-3-4-5';
//     expect(loopSerializer.deserialize(loopText)).toBe(
//         'Map {"loop-1" => {"endIndex": "2", "iterations": "1", "iterationsLeft": "1", "startIndex": "1"}, "loop-2" => {"endIndex": "4", "iterations": "5", "iterationsLeft": "5", "startIndex": "3"}}'
//     );
// })
