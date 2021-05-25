// @flow

import React from 'react';
import AriaDisablingButton from './AriaDisablingButton';
import classNames from 'classnames';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import './LoopCounter.scss';

type LoopCounterProps = {
    intl: IntlShape,
    iterationsLeft: number,
    startingPoint: string,
    endingPoint: string,
    disabled: boolean,
    onClick: () => void
};

class LoopCounter extends React.Component<LoopCounterProps, {}> {
    constructor(props: LoopCounterProps) {
        super(props);
        this.state = {
            isInfiniteLoop: false,
            loopCounter: this.props.iterationsLeft
        };
    }

    onClickLoopForever = () => {
        const prevIsInfiniteLoop = this.state.isInfiniteLoop;
        this.setState({
            isInfiniteLoop: !this.prevIsInfiniteLoop
        });
    }

    onChangeLoopCounter = (e: SyntheticKeyboardEvent<HTMLInputElement>) => {
        this.setState({
            loopCounter: e.currentTarget.value
        });
    }

    render() {
        // const classes = classNames(
        //     this.props.className,
        // );
        const styles = {
            left: `${this.props.startingPoint}px`,
            width: `${this.props.width}px`
        }
        const isDisabled = this.props.editingDisabled || this.state.isInfiniteLoop;
        return (
            <div
                style={styles}
                className='loopCounter'>
                <div className='loopCounter__loop-controller'>
                    <input
                        className='loopCounter__input-box'
                        size='2'
                        maxLength='2'
                        aria-label={this.props.intl.formatMessage(
                            {id:'LoopCounter.inputBox'},
                            {iterations: this.props.iterationsLeft})}
                        aria-disabled={isDisabled}
                        name={this.props.loopId}
                        type='text'
                        value={this.state.loopCounter}
                        onChange={!isDisabled ? this.onChangeLoopCounter : undefined}
                        onKeyDown={this.props.onUpdateLoopCounter}
                        onBlur={this.props.onBlurLoopCounterInputBox} />
                    <button
                        className='loopCounter__loop-forever-button'
                        onClick={this.onClickLoopForever}>
                        Forever
                    </button>
                </div>
            </div>
        );
    }
}

export default injectIntl(LoopCounter);
