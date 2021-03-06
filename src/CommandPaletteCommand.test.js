// @flow

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import { Col, Button } from 'react-bootstrap';
import { createIntl } from 'react-intl';
import App from './App';
import CommandPaletteCommand from './CommandPaletteCommand';

configure({ adapter: new Adapter()});

function hasPressedClass(wrapper) {
    return wrapper.find(Button).hasClass('command-block--pressed');
}

function getAriaPressedValue(wrapper) {
    return wrapper.find(Button).getElement().props['aria-pressed'];
}

const intl = createIntl({
    locale: 'en',
    defaultLocale: 'en',
    messages: {
        'CommandPaletteCommand.forward' : 'forward'
    }
});

test('Pressed state is false when selecedCommandName is null', () => {
    const wrapper = shallow(
        <CommandPaletteCommand.WrappedComponent
            intl={intl}
            commandName='forward'
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
            commandName='forward'
            selectedCommandName='left'
            onChange={() => {}}/>
    );
    expect(hasPressedClass(wrapper)).toBe(false);
    expect(getAriaPressedValue(wrapper)).toBe(false);
});

test('Pressed state is true when selecedCommandName is this command', () => {
    const wrapper = shallow(
        <CommandPaletteCommand.WrappedComponent
            intl={intl}
            commandName='forward'
            selectedCommandName='forward'
            onChange={() => {}}/>
    );
    expect(hasPressedClass(wrapper)).toBe(true);
    expect(getAriaPressedValue(wrapper)).toBe(true);
});

test('Clicking the button toggles selectedCommandName', () => {
    const mockChangeHandler = jest.fn();

    const wrapper = shallow(
        <CommandPaletteCommand.WrappedComponent
            intl={intl}
            commandName='forward'
            selectedCommandName={null}
            onChange={mockChangeHandler}/>
    );

    const button = wrapper.find(Button);

    // Initially the command is not selected
    button.simulate('click');
    // Verify that onChange is called with the commandName
    expect(mockChangeHandler.mock.calls.length).toBe(1);
    expect(mockChangeHandler.mock.calls[0][0]).toBe('forward');
    // Update the selectedCommandName
    wrapper.setProps({selectedCommandName: 'forward'});
    wrapper.update();
    // Click again
    button.simulate('click');
    // And verify that the command is toggled off
    expect(mockChangeHandler.mock.calls.length).toBe(2);
    expect(mockChangeHandler.mock.calls[1][0]).toBe(null);
});
