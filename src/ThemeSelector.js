// @flow

import React from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import type { ThemeName } from './types';
import type { IntlShape } from 'react-intl';
import { injectIntl } from 'react-intl';
import './ThemeSelector.scss';

type ThemeSelectorProps = {
    intl: IntlShape,
    onSelect: (value: ThemeName) => void
};

class ThemeSelector extends React.Component<ThemeSelectorProps, {}> {
    render() {
        return (
            <DropdownButton className='ThemeSelector preview-announce-it' onSelect={this.props.onSelect} title={`${this.props.intl.formatMessage({id:'ThemeSelector.theme'})}`}>
                {
                    /* $FlowFixMe
                        Cannot get Dropdown.Item because property Item is missing in statics of Dropdown
                    */
                    <Dropdown.Item className='preview-announce-it' eventKey='mixed'>{this.props.intl.formatMessage({id:'ThemeSelector.theme.mixed'})}</Dropdown.Item>
                }
                {
                    // $FlowFixMe
                    <Dropdown.Item className='preview-announce-it' eventKey='light'>{this.props.intl.formatMessage({id:'ThemeSelector.theme.light'})}</Dropdown.Item>
                }

                { // $FlowFixMe
                    <Dropdown.Item className='preview-announce-it' eventKey='dark'>{this.props.intl.formatMessage({id:'ThemeSelector.theme.dark'})}</Dropdown.Item>
                }
                { // $FlowFixMe
                    <Dropdown.Item className='preview-announce-it' eventKey='gray'>{this.props.intl.formatMessage({id:'ThemeSelector.theme.gray'})}</Dropdown.Item>
                }
                { // $FlowFixMe
                    <Dropdown.Item className='preview-announce-it' eventKey='contrast'>{this.props.intl.formatMessage({id:'ThemeSelector.theme.contrast'})}</Dropdown.Item>
                }
            </DropdownButton>
        );
    }
}

export default injectIntl(ThemeSelector);
