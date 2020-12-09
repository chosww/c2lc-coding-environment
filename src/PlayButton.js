// @flow

import React from 'react';
import AriaDisablingButton from './AriaDisablingButton';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { ReactComponent as PlayIcon } from './svg/Play.svg';
import { ReactComponent as PauseIcon } from './svg/Pause.svg';
import './PlayButton.scss';

type PlayButtonProps = {
    intl: IntlShape,
    interpreterIsRunning: boolean,
    disabled: boolean,
    onClick: () => void
};

class PlayButton extends React.Component<PlayButtonProps, {}> {
    render() {
        return (
            <AriaDisablingButton
                aria-label={
                    this.props.interpreterIsRunning ?
                    this.props.intl.formatMessage({id:'PlayButton.pause'}) :
                    this.props.intl.formatMessage({id:'PlayButton.run'})}
                className={
                    this.props.interpreterIsRunning ?
                    'PlayButton--playing' :
                    'PlayButton'}
                disabledClassName='PlayButton--disabled'
                disabled={this.props.disabled}
                onClick={this.props.onClick}>
                {this.props.interpreterIsRunning ?
                    <PauseIcon /> :
                    <PlayIcon />
                }
            </AriaDisablingButton>
        );
    }
}

export default injectIntl(PlayButton);
