// @flow

import * as React from 'react';
import type { AvailableLanguages } from './types';
import './LanguageSelector.scss';

type LanguageSelectorProps = {
    ariaLabel: string,
    availableLanguages: Array<AvailableLanguages>,
    currentLanguage: AvailableLanguages,
    onSelect: (selectedLanguage: AvailableLanguages) => void
};

class LanguageSelector extends React.Component<LanguageSelectorProps, {}> {
    static defaultProps = {
        availableLanguages: [
            'en',
            'fr'
        ]
    }

    handleSelectLanguageOption = (event: Event) => {
        // $FlowFixMe: event currentTarget doesn't know about value property.
        const selectedLanguage = event.currentTarget.value;
        if (selectedLanguage) {
            this.props.onSelect(selectedLanguage);
        }
    }

    render() {
        return (<select
            aria-label={this.props.ariaLabel}
            className="LanguageSelector__container"
            value={this.props.currentLanguage}
            onChange={this.handleSelectLanguageOption}>
            {
                this.props.availableLanguages.map(language => (
                    <option className="LanguageSelector__option" key={`language-option-${language}`} value={language}>
                        {language.toUpperCase()}
                    </option>
                ))
            }
        </select>);
    }
};

export default LanguageSelector;
