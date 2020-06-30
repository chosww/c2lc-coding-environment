// @flow

import React from 'react';
import AriaDisablingButton from './AriaDisablingButton';
import { injectIntl } from 'react-intl';
import type { Program } from './types';
import { ReactComponent as MovePreviousIcon } from './svg/MovePrevious.svg';
import { ReactComponent as MoveNextIcon } from './svg/MoveNext.svg';
import { ReactComponent as DeleteIcon } from './svg/Delete.svg';
import { ReactComponent as ReplaceIcon } from './svg/replace.svg';
import './ActionPanel.scss';

type ActionPanelProps = {
    focusedOptionName: ?string,
    selectedCommandName: ?string,
    program: Program,
    pressedStepIndex: number,
    position: {
        top: number,
        right: number
    },
    intl: any,
    onDelete: () => void,
    onReplace: () => void,
    onMoveToPreviousStep: () => void,
    onMoveToNextStep: () => void
};

class ActionPanel extends React.Component<ActionPanelProps, {}> {
    actionPanelRef: { current: null | HTMLDivElement };

    constructor(props) {
        super(props);
        this.actionPanelRef = React.createRef();
    }

    makeStepInfoMessage() {
        const currentStepName = this.props.program[this.props.pressedStepIndex];

        let ariaLabelObj = {
            'stepNumber': this.props.pressedStepIndex + 1,
            'stepName': this.props.intl.formatMessage({id:`CommandInfo.${currentStepName}`}),
            'selectedCommandName': '',
            'previousStepInfo': '',
            'nextStepInfo': ''
        };

        if (this.props.selectedCommandName) {
            ariaLabelObj['selectedCommandName'] =
                this.props.intl.formatMessage(
                    { id: 'ActionPanel.selectedCommandName' },
                    { selectedCommandName: this.props.selectedCommandName }
                );
        }

        if (this.props.pressedStepIndex > 0) {
            const prevStepName = this.props.program[this.props.pressedStepIndex - 1];
            ariaLabelObj['previousStepInfo'] =
                this.props.intl.formatMessage(
                    { id: `CommandInfo.previousStep.${prevStepName}`},
                    { previousStepNumber: this.props.pressedStepIndex }
                );
        }

        if (this.props.pressedStepIndex < (this.props.program.length - 1)) {
            const nextStepName = this.props.program[this.props.pressedStepIndex + 1];
            ariaLabelObj['nextStepInfo'] =
                this.props.intl.formatMessage(
                    { id: `CommandInfo.nextStep.${nextStepName}`},
                    { nextStepNumber: this.props.pressedStepIndex + 2}
                );
        }

        return ariaLabelObj;
    }

    render() {
        const positionStyles = {
            position: 'absolute',
            top: this.props.position.top,
            right: this.props.position.right
        }
        const stepInfoMessage = this.makeStepInfoMessage();
        return (
            <div
                id='ActionPanel'
                className={'ActionPanel__panel'}
                data-actionpanelgroup={true}
                style={positionStyles}
                ref={this.actionPanelRef}
                onBlur={this.props.onBlur}>
                <AriaDisablingButton
                    data-actionpanelgroup={true}
                    name='deleteCurrentStep'
                    disabled={false}
                    aria-label={this.props.intl.formatMessage({id:'ActionPanel.action.delete'}, stepInfoMessage)}
                    className='ActionPanel__action-buttons'
                    onClick={this.props.onDelete}>
                    <DeleteIcon className='ActionPanel__action-button-svg' />
                </AriaDisablingButton>
                <AriaDisablingButton
                    data-actionpanelgroup={true}
                    name='replaceCurrentStep'
                    disabled={false}
                    aria-label={this.props.intl.formatMessage({id:'ActionPanel.action.replace'}, stepInfoMessage)}
                    className='ActionPanel__action-buttons replace-action-button'
                    onClick={this.props.onReplace}>
                    <ReplaceIcon className='ActionPanel__action-button-svg' />
                </AriaDisablingButton>
                <AriaDisablingButton
                    data-actionpanelgroup={true}
                    name='moveToPreviousStep'
                    disabled={this.props.pressedStepIndex === 0}
                    disabledClassName='ActionPanel__action-buttons--disabled'
                    aria-label={this.props.intl.formatMessage({id:'ActionPanel.action.moveToPreviousStep'}, stepInfoMessage)}
                    className='ActionPanel__action-buttons'
                    onClick={this.props.onMoveToPreviousStep}>
                    <MovePreviousIcon className='ActionPanel__action-button-svg' />
                </AriaDisablingButton>
                <AriaDisablingButton
                    data-actionpanelgroup={true}
                    name='moveToNextStep'
                    disabled={this.props.pressedStepIndex === this.props.program.length-1}
                    disabledClassName='ActionPanel__action-buttons--disabled'
                    aria-label={this.props.intl.formatMessage({id:'ActionPanel.action.moveToNextStep'}, stepInfoMessage)}
                    className='ActionPanel__action-buttons'
                    onClick={this.props.onMoveToNextStep}>
                    <MoveNextIcon className='ActionPanel__action-button-svg' />
                </AriaDisablingButton>
            </div>
        )
    }

    componentDidMount() {
        const element = this.actionPanelRef.current;
        if (element && element.scrollIntoView) {
            element.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'nearest' });
            if (this.props.focusedOptionName != null) {
                const optionButtonRef = document.querySelector(`[name="${this.props.focusedOptionName}"]`);
                if(optionButtonRef) {
                    optionButtonRef.focus();
                }
            }
        }
    }
}

export default injectIntl(ActionPanel);
