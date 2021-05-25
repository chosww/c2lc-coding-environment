// @flow

export default class LoopSerializer {
    serialize(loopStack): string {
        let loopText = '';
        if (loopStack.size > 0) {
            const numberOfLoops = loopStack.size;
            let counter = 0;
            for (const loop of loopStack) {
                const { startIndex, endIndex, iterations } = loop[1];
                const loopNumber = loop[0].split('-')[1];
                loopText += `${loopNumber}-${startIndex}-${endIndex}-${iterations}`;
                counter++;
                if (counter !== numberOfLoops) {
                    loopText += '_';
                }
            }
        }
        return loopText;
    }

    deserialize(loopText: string) {
        //TODO: Filter invalid values from loopText
        const loopStack = new Map();
        const loops = loopText.split('_');
        for (const loop of loops) {
            const loopValues = loop.split('-');
            const loopObject = {
                startIndex: loopValues[1],
                endIndex: loopValues[2],
                iterations: loopValues[3],
                iterationsLeft: loopValues[3]
            };
            loopStack.set(`loop-${loopValues[0]}`, loopObject);
        }
        return loopStack;
    }
};
