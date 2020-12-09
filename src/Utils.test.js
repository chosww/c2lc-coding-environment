// @flow

import { generateEncodedProgramURL } from './Utils.js';

test('Test URL encoding', () => {
    expect(generateEncodedProgramURL('version=5', 'f1=f2=f3', '0ab')).toBe('?v=version%3D5&p=f1%3Df2%3Df3&c=0ab');
    expect(generateEncodedProgramURL('version?5', 'f1?f2?f3', '0aab0c0')).toBe('?v=version%3F5&p=f1%3Ff2%3Ff3&c=0aab0c0');
    expect(generateEncodedProgramURL('version 5', 'f1 f2 f3', '0a b c')).toBe('?v=version%205&p=f1%20f2%20f3&c=0a%20b%20c');
});
