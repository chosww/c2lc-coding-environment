// @flow

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import CommandBlock from './CommandBlock';
import { createIntl } from 'react-intl';
import AudioManager from './AudioManager';
import CommandPaletteCommand from './CommandPaletteCommand';

// Mocks
jest.mock('./AudioManager');

configure({ adapter: new Adapter()});

function hasPressedClass(wrapper) {
    return wrapper.find(CommandBlock).hasClass('command-block--pressed');
}

function getAriaPressedValue(wrapper) {
    // $FlowFixMe: The flow-typed definitions for enzyme introduce a type-checking error here.
    return wrapper.find(CommandBlock).getElement().props['aria-pressed'];
}

const intl = createIntl({
    locale: 'en',
    defaultLocale: 'en',
    messages: {
        'Command.forward1' : 'forward1'
    }
});

test('Pressed state is false when selecedCommandName is null', () => {
    const wrapper = shallow(
        <CommandPaletteCommand.WrappedComponent
            intl={intl}
            commandName='forward1'
            selectedCommandName={null}
            onChange={() => {}}/>
    );
    expect(hasPressedClass(wrapper)).toBe(false);
    expect(getAriaPressedValue(wrapper)).toBe(false);
});

test('Pressed state is false when selecedCommandName is another command', () => {
    const wrapper = shallow(
        <CommandPaletteCommand.WrappedComponent
            intl={intl}
            commandName='forward1'
            selectedCommandName='left45'
            onChange={() => {}}/>
    );
    expect(hasPressedClass(wrapper)).toBe(false);
    expect(getAriaPressedValue(wrapper)).toBe(false);
});

test('Pressed state is true when selecedCommandName is this command', () => {
    const wrapper = shallow(
        <CommandPaletteCommand.WrappedComponent
            intl={intl}
            commandName='forward1'
            selectedCommandName='forward1'
            onChange={() => {}}/>
    );
    expect(hasPressedClass(wrapper)).toBe(true);
    expect(getAriaPressedValue(wrapper)).toBe(true);
});

test('Clicking the button toggles selectedCommandName and plays its sound', () => {
    const audioManagerInstance = new AudioManager(true);
    // $FlowFixMe: Flow doesn't know about the Jest mock API
    const audioManagerMock = AudioManager.mock.instances[0];
    const mockChangeHandler = jest.fn();

    const wrapper = shallow(
        <CommandPaletteCommand.WrappedComponent
            intl={intl}
            commandName='forward1'
            selectedCommandName={null}
            audioManager={audioManagerInstance}
            onChange={mockChangeHandler}/>
    );

    const button = wrapper.find(CommandBlock);

    // Initially the command is not selected
    button.simulate('click');
    // Verify that the audioManager playAnnouncement is called
    expect(audioManagerMock.playAnnouncement.mock.calls.length).toBe(1);
    expect(audioManagerMock.playAnnouncement.mock.calls[0][0]).toBe('forward1');
    // Verify that onChange is called with the commandName
    expect(mockChangeHandler.mock.calls.length).toBe(1);
    expect(mockChangeHandler.mock.calls[0][0]).toBe('forward1');
    // Update the selectedCommandName
    wrapper.setProps({selectedCommandName: 'forward1'});
    wrapper.update();
    // Click again
    button.simulate('click');
    // Verify that the audioManager playAnnouncement is called again
    expect(audioManagerMock.playAnnouncement.mock.calls.length).toBe(2);
    expect(audioManagerMock.playAnnouncement.mock.calls[1][0]).toBe('forward1');
    // And verify that the command is toggled off
    expect(mockChangeHandler.mock.calls.length).toBe(2);
    expect(mockChangeHandler.mock.calls[1][0]).toBe(null);
});
