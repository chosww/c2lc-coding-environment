// @flow
// These are just a rudimentary sanity check of the DisallowedActionsSerializer,
// the underlying serializer is tested in depth elsewhere.
import DisallowedActionsSerializer from './DisallowedActionsSerializer';

test("Serialize disallowed actions", () => {
    const serializer = new DisallowedActionsSerializer();

    expect(serializer.serialize({})).toStrictEqual('');
    expect(serializer.serialize({ forward: true })).toStrictEqual('1');
    expect(serializer.serialize({ backward: true})).toStrictEqual('4');
    expect(serializer.serialize({ left45: true})).toStrictEqual('A');
    expect(serializer.serialize({ left90: true})).toStrictEqual('B');
    expect(serializer.serialize({ left180: true})).toStrictEqual('D');
    expect(serializer.serialize({ right45: true})).toStrictEqual('a');
    expect(serializer.serialize({ right90: true})).toStrictEqual('b');
    expect(serializer.serialize({ right180: true})).toStrictEqual('d');
    expect(serializer.serialize({ loop: true})).toStrictEqual('l');
    expect(serializer.serialize({
        forward: false,
        backward: true,
        left45: false,
        left90: true,
        left180: false,
        right45: true,
        right90: false,
        right180: true,
        loop: true
    })).toStrictEqual('246Badl');
});

test("Deserialize disallowed actions.", () => {
    const serializer = new DisallowedActionsSerializer();
    expect(serializer.deserialize('')).toStrictEqual({});
    expect(serializer.deserialize('1')).toStrictEqual({ forward: true });
    expect(serializer.deserialize('4')).toStrictEqual({ backward: true });
    expect(serializer.deserialize('A')).toStrictEqual({ left45: true });
    expect(serializer.deserialize('B')).toStrictEqual({ left90: true });
    expect(serializer.deserialize('D')).toStrictEqual({ left180: true });
    expect(serializer.deserialize('a')).toStrictEqual({ right45: true });
    expect(serializer.deserialize('b')).toStrictEqual({ right90: true });
    expect(serializer.deserialize('d')).toStrictEqual({ right180: true });
    expect(serializer.deserialize('l')).toStrictEqual({ loop: true });
    expect(serializer.deserialize('123456ABDabdl')).toStrictEqual({
        forward: true,
        backward: true,
        left45: true,
        left90: true,
        left180: true,
        right45: true,
        right90: true,
        right180: true,
        loop: true
    });
});

test('Deserializing an unsupported actionKey should throw an Error', () => {
    expect(() => {
        (new DisallowedActionsSerializer()).deserialize('9');
    }).toThrowError(/^Unrecognized disallowedActions text when deserialize text: 9$/);
});