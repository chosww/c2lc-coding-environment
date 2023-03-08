// @flow

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure, ReactWrapper } from 'enzyme';
import LanguageSelector from './LanguageSelector';
import type { AvailableLanguages } from './types';
import * as TestUtils from './TestUtils';

configure({ adapter: new Adapter()});

const defaultLanguageSelectorProps = {
    ariaLabel: "Language Selector",
    currentLanguage: "en"
};

function getLanguageSelector(languageSelectorWrapper: ReactWrapper<HTMLElement>): ReactWrapper<HTMLElement> {
    return languageSelectorWrapper.find('.LanguageSelector__container');
}

function createShallowLanguageSelector(props) {
    const mockSelectLanguageOption = jest.fn();
    const wrapper: $FlowIgnoreType = shallow(
        React.createElement(
            LanguageSelector,
            Object.assign(
                {},
                defaultLanguageSelectorProps,
                {
                    onSelect: mockSelectLanguageOption
                },
                props
            )
        )
    );

    return {
        wrapper,
        mockSelectLanguageOption
    };
}

test('Rendering LanguageSelector', () => {
    const availableLanguages = ['en'];
    const { wrapper } = createShallowLanguageSelector({ availableLanguages });
    expect(wrapper.props().children.length).toBe(1);

    availableLanguages.push('fr');
    wrapper.setProps({ availableLanguages });
    expect(wrapper.props().children.length).toBe(2);
});

test('Clicking an option will call onSelect method', () => {
    const { wrapper, mockSelectLanguageOption } = createShallowLanguageSelector();
    const languageSelectorOption = getLanguageSelector(wrapper).at(0);
    const currentTarget = (value: string) => ({
        value
    });
    languageSelectorOption.simulate('change', TestUtils.makeChangeEvent(currentTarget('en')));
    expect(mockSelectLanguageOption.mock.calls.length).toBe(1);
    expect(mockSelectLanguageOption.mock.calls[0][0]).toBe('en');
})