// @flow

import { injectIntl, FormattedMessage } from 'react-intl';
import * as ProgramUtils from './ProgramUtils';
import type {Program} from './types';
import React from 'react';
import ConfirmDeleteAllModal from './ConfirmDeleteAllModal';
import AddNode from './AddNode';
import ActionPanel from './ActionPanel';
import AriaDisablingButton from './AriaDisablingButton';
import AudioManager from './AudioManager';
import FocusTrapManager from './FocusTrapManager';
import CommandBlock from './CommandBlock';
import classNames from 'classnames';
import ToggleSwitch from './ToggleSwitch';
import { ReactComponent as AddIcon } from './svg/Add.svg';
import { ReactComponent as PlayIcon } from './svg/Play.svg';
import { ReactComponent as PauseIcon } from './svg/Pause.svg';
import { ReactComponent as DeleteAllIcon } from './svg/DeleteAll.svg';
import './ProgramBlockEditor.scss';

// TODO: Send focus to Delete toggle button on close of Delete All confirmation dialog

type ProgramBlockEditorProps = {
    intl: any,
    activeProgramStepNum: ?number,
    actionPanelStepIndex: ?number,
    editingDisabled: boolean,
    interpreterIsRunning: boolean,
    pausedProgramStepNum: ?number,
    program: Program,
    selectedAction: ?string,
    isDraggingCommand: boolean,
    runButtonDisabled: boolean,
    audioManager: AudioManager,
    focusTrapManager: FocusTrapManager,
    setPausedProgramStepNum: (index: number) => void,
    onClickRunButton: () => void,
    onChangeProgram: (Program) => void,
    onChangeActionPanelStepIndex: (index: ?number) => void
};

type ProgramBlockEditorState = {
    showConfirmDeleteAll: boolean,
    focusedActionPanelOptionName: ?string,
    replaceIsActive: boolean,
    addNodeExpandedMode: boolean
};

class ProgramBlockEditor extends React.Component<ProgramBlockEditorProps, ProgramBlockEditorState> {
    commandBlockRefs: Map<number, HTMLElement>;
    addNodeRefs: Map<number, HTMLElement>;
    focusCommandBlockIndex: ?number;
    scrollToAddNodeIndex: ?number;

    constructor(props: ProgramBlockEditorProps) {
        super(props);
        this.commandBlockRefs = new Map();
        this.addNodeRefs = new Map();
        this.focusCommandBlockIndex = null;
        this.scrollToAddNodeIndex = null;
        this.state = {
            showConfirmDeleteAll : false,
            focusedActionPanelOptionName: null,
            replaceIsActive: false,
            addNodeExpandedMode : false
        }
    }

    commandIsSelected() {
        return this.props.selectedAction != null;
    }

    insertSelectedCommandIntoProgram(index: number) {
        if (this.props.selectedAction) {
            if (this.props.pausedProgramStepNum != null && index <= this.props.pausedProgramStepNum) {
                this.props.setPausedProgramStepNum(this.props.pausedProgramStepNum + 1);
            }
            this.focusCommandBlockIndex = index;
            this.scrollToAddNodeIndex = index + 1;
            this.props.onChangeProgram(ProgramUtils.insert(this.props.program,
                index, this.props.selectedAction, 'none'));
        }
    }

    programStepIsActive(programStepNumber: number) {
        if (this.props.interpreterIsRunning && this.props.activeProgramStepNum != null) {
            return (this.props.activeProgramStepNum) === programStepNumber;
        } else {
            return false;
        }
    }

    setCommandBlockRef = (programStepNumber: number, element: ?HTMLElement) => {
        if (element) {
            this.commandBlockRefs.set(programStepNumber, element);
        } else {
            this.commandBlockRefs.delete(programStepNumber);
        }
    }

    setAddNodeRef(programStepNumber: number, element: ?HTMLElement) {
        if (element) {
            this.addNodeRefs.set(programStepNumber, element);
        }
    }

    // Handlers

    handleChangeAddNodeExpandedMode = (isAddNodeExpandedMode: boolean) => {
        this.setState({
            addNodeExpandedMode: isAddNodeExpandedMode
        });
    };

    handleClickDelete = (index: number) => {
        this.props.audioManager.playSound('delete');
        if (this.props.pausedProgramStepNum != null && index <= this.props.pausedProgramStepNum) {
            this.props.setPausedProgramStepNum(this.props.pausedProgramStepNum - 1);
        }
        this.props.onChangeProgram(ProgramUtils.deleteStep(this.props.program, index));
        this.handleCloseActionPanelFocusTrap();
    };

    handleClickDeleteAll = () => {
        this.props.audioManager.playSound('deleteAll');
        this.setState({
            showConfirmDeleteAll : true
        });
    };

    handleCancelDeleteAll = () => {
        this.setState({
            showConfirmDeleteAll : false
        });
    };

    handleConfirmDeleteAll = () => {
        this.props.onChangeProgram([]);
        this.setState({
            showConfirmDeleteAll : false
        });
    };

    handleMoveToPreviousStep = (index: number) => {
        this.props.audioManager.playSound('moveToPrevious');
        if (this.props.program[index - 1] != null) {
            const previousStepIndex = index - 1;
            this.setState({
                focusedActionPanelOptionName: 'moveToPreviousStep'
            });
            this.props.onChangeActionPanelStepIndex(previousStepIndex)
            this.props.onChangeProgram(
                ProgramUtils.swapPosition(
                    this.props.program,
                    index,
                    previousStepIndex
                )
            );
        }
    };

    handleMoveToNextStep = (index: number) => {
        this.props.audioManager.playSound('moveToNext');
        if (this.props.program[index + 1] != null) {
            const nextStepIndex = index + 1;
            this.setState({
                focusedActionPanelOptionName: 'moveToNextStep'
            });
            this.props.onChangeActionPanelStepIndex(nextStepIndex);
            this.props.onChangeProgram(
                ProgramUtils.swapPosition(
                    this.props.program,
                    index,
                    nextStepIndex
                )
            );
        }
    };

    handleSetReplaceIsActive = (booleanValue: boolean) => {
        this.setState({
            replaceIsActive: booleanValue
        });
    };

    handleReplaceStep = (index: number) => {
        this.props.audioManager.playSound('replace');
        if (this.props.selectedAction) {
            if (this.props.program[index] !== this.props.selectedAction) {
                this.props.onChangeProgram(ProgramUtils.overwrite(this.props.program,
                        index, this.props.selectedAction, 'none'));
                this.handleSetReplaceIsActive(false);
                this.focusCommandBlockIndex = index;
                this.scrollToAddNodeIndex = index + 1;
            } else {
                this.handleSetReplaceIsActive(true);
            }
        } else {
            this.handleSetReplaceIsActive(true);
        }
    };

    handleClickStep = (e: SyntheticEvent<HTMLButtonElement>) => {
        const index = parseInt(e.currentTarget.dataset.stepnumber, 10);
        // Open or close the ActionPanel
        if (this.props.actionPanelStepIndex === index) {
            // The ActionPanel is already open for this program step, close it
            this.setState({
                focusedActionPanelOptionName: null
            });
            this.props.onChangeActionPanelStepIndex(null);
        } else {
            // Otherwise, open it
            this.props.onChangeActionPanelStepIndex(index);
        }
    };

    handleCloseActionPanelFocusTrap = () => {
        this.setState({
            focusedActionPanelOptionName: null
        });
        this.props.onChangeActionPanelStepIndex(null);
    };

    handleCloseReplaceFocusTrap = () => {
        this.handleSetReplaceIsActive(false);
    };

    handleClickAddNode = (stepNumber: number) => {
        this.props.audioManager.playSound('add');
        this.insertSelectedCommandIntoProgram(stepNumber);
    };

    handleDropCommand = (stepNumber: number) => {
        this.insertSelectedCommandIntoProgram(stepNumber);
    };

    // Rendering

    makeProgramBlock(programStepNumber: number, command: string) {
        const active = this.programStepIsActive(programStepNumber);
        const paused = this.props.pausedProgramStepNum === programStepNumber;
        const hasActionPanelControl = this.props.actionPanelStepIndex === programStepNumber;
        const classes = classNames(
            'ProgramBlockEditor__program-block',
            active && 'ProgramBlockEditor__program-block--active',
            hasActionPanelControl && 'ProgramBlockEditor__program-block--pressed',
            paused && 'ProgramBlockEditor__program-block--paused'
        );
        let ariaLabel = this.props.intl.formatMessage(
            { id: `ProgramBlockEditor.command.${command}` },
            { index: programStepNumber + 1 }
        );

        return (
            <CommandBlock
                commandName={command}
                ref={ (element) => this.setCommandBlockRef(programStepNumber, element) }
                key={`${programStepNumber}-${command}`}
                data-stepnumber={programStepNumber}
                data-command={command}
                data-actionpanelgroup={true}
                className={classes}
                aria-label={ariaLabel}
                aria-controls={hasActionPanelControl ? 'ActionPanel' : undefined}
                aria-expanded={hasActionPanelControl}
                disabled={this.props.editingDisabled}
                onClick={this.handleClickStep}
            />
        );
    }

    makeAddNodeAriaLabel(programStepNumber: number, isEndOfProgramAddNode: boolean) {
        if (this.commandIsSelected()) {
            if (isEndOfProgramAddNode) {
                return this.props.intl.formatMessage(
                    { id: 'ProgramBlockEditor.lastBlock' },
                    { command: this.props.selectedAction }
                );
            } else if (programStepNumber === 0) {
                // The add node before the start of the program
                return this.props.intl.formatMessage(
                    { id: 'ProgramBlockEditor.beginningBlock' },
                    { command: this.props.selectedAction }
                );
            } else {
                return this.props.intl.formatMessage(
                    { id: 'ProgramBlockEditor.betweenBlocks' },
                    {
                        command: this.props.selectedAction,
                        prevCommand: `${programStepNumber}, ${this.props.program[programStepNumber-1]}`,
                        postCommand: `${programStepNumber+1}, ${this.props.program[programStepNumber]}`
                    }
                );
            }
        } else {
            return this.props.intl.formatMessage(
                { id: 'ProgramBlockEditor.blocks.noCommandSelected'}
            );
        }
    }

    makeProgramBlockSection(programStepNumber: number, command: string) {
        return (
            <React.Fragment key={programStepNumber}>
                <div className='ProgramBlockEditor__program-block-connector'/>
                <AddNode
                    aria-label={this.makeAddNodeAriaLabel(programStepNumber, false)}
                    ref={ (element) => this.setAddNodeRef(programStepNumber, element) }
                    expandedMode={this.state.addNodeExpandedMode}
                    isDraggingCommand={this.props.isDraggingCommand}
                    programStepNumber={programStepNumber}
                    disabled={
                        this.props.editingDisabled ||
                        (!this.commandIsSelected() && !this.props.isDraggingCommand)}
                    onClick={this.handleClickAddNode}
                    onDrop={this.handleDropCommand}
                />
                <div className='ProgramBlockEditor__program-block-connector' />
                <div className='ProgramBlockEditor__program-block-with-panel'>
                    {this.props.actionPanelStepIndex === programStepNumber &&
                        <div className='ProgramBlockEditor__action-panel-container-outer'>
                            <div className='ProgramBlockEditor__action-panel-container-inner'>
                                <ActionPanel
                                    focusedOptionName={this.state.focusedActionPanelOptionName}
                                    selectedCommandName={this.props.selectedAction}
                                    program={this.props.program}
                                    pressedStepIndex={programStepNumber}
                                    onDelete={this.handleClickDelete}
                                    onReplace={this.handleReplaceStep}
                                    onMoveToPreviousStep={this.handleMoveToPreviousStep}
                                    onMoveToNextStep={this.handleMoveToNextStep}/>
                            </div>
                        </div>
                    }
                    {this.makeProgramBlock(programStepNumber, command)}
                </div>
            </React.Fragment>
        );
    }

    makeEndOfProgramAddNodeSection(programStepNumber: number) {
        return (
            <React.Fragment key={programStepNumber}>
                <div className='ProgramBlockEditor__program-block-connector'/>
                <AddNode
                    aria-label={this.makeAddNodeAriaLabel(programStepNumber, true)}
                    ref={ (element) => this.setAddNodeRef(programStepNumber, element) }
                    expandedMode={true}
                    isDraggingCommand={this.props.isDraggingCommand}
                    programStepNumber={programStepNumber}
                    disabled={
                        this.props.editingDisabled ||
                        (!this.commandIsSelected() && !this.props.isDraggingCommand)}
                    onClick={this.handleClickAddNode}
                    onDrop={this.handleDropCommand}
                />
            </React.Fragment>
        )
    }

    render() {
        const contents = this.props.program.map((command, stepNumber) => {
            return this.makeProgramBlockSection(stepNumber, command);
        });

        contents.push(this.makeEndOfProgramAddNodeSection(this.props.program.length));

        return (
            <div className='ProgramBlockEditor__container'>
                <div className='ProgramBlockEditor__header'>
                    <h2 className='ProgramBlockEditor__heading'>
                        <FormattedMessage id='ProgramBlockEditor.programHeading' />
                    </h2>
                    <div className='ProgramBlockEditor__options'>
                        <ToggleSwitch
                            ariaLabel={this.props.intl.formatMessage({id:'ProgramBlockEditor.toggleAddNodeExpandMode'})}
                            value={this.state.addNodeExpandedMode}
                            onChange={this.handleChangeAddNodeExpandedMode}
                            contentsTrue={<AddIcon />}
                            contentsFalse={<AddIcon />}
                            className='ProgramBlockEditor__add-node-toggle-switch'
                        />
                        <span className='ProgramBlockEditor__program-deleteAll'>
                            <AriaDisablingButton
                                aria-label={this.props.intl.formatMessage({id:'ProgramBlockEditor.program.deleteAll'})}
                                className='ProgramBlockEditor__program-deleteAll-button'
                                disabledClassName='ProgramBlockEditor__program-deleteAll-button--disabled'
                                disabled={this.props.editingDisabled}
                                onClick={this.handleClickDeleteAll}
                                key='deleteButton'
                            >
                                <DeleteAllIcon className='ProgramBlockEditor__program-deleteAll-button-svg'/>
                            </AriaDisablingButton>
                        </span>
                    </div>
                </div>
                <div className='ProgramBlockEditor__program-sequence-scroll-container' id='programSequenceContainer'>
                    <div className='ProgramBlockEditor__program-sequence'>
                        <div className='ProgramBlockEditor__start-indicator'>
                            {this.props.intl.formatMessage({id:'ProgramBlockEditor.startIndicator'})}
                        </div>
                        {contents}
                    </div>
                </div>
                <div className='ProgramBlockEditor__footer'>
                    <div className='ProgramBlockEditor__run'>
                        <AriaDisablingButton
                            aria-label={
                                this.props.interpreterIsRunning ?
                                this.props.intl.formatMessage({id:'PlayButton.pause'}) :
                                this.props.intl.formatMessage({id:'PlayButton.run'})}
                            className='ProgramBlockEditor__run-button'
                            disabledClassName='ProgramBlockEditor__run-button--disabled'
                            disabled={this.props.runButtonDisabled}
                            onClick={this.props.onClickRunButton}
                        >
                            {this.props.interpreterIsRunning ?
                                <PauseIcon className='ProgramBlockEditor__play-svg' /> :
                                <PlayIcon className='ProgramBlockEditor__play-svg' />
                            }
                        </AriaDisablingButton>
                    </div>
                </div>
                <ConfirmDeleteAllModal
                    show={this.state.showConfirmDeleteAll}
                    onCancel={this.handleCancelDeleteAll}
                    onConfirm={this.handleConfirmDeleteAll}/>
            </div>
        );
    }

    componentDidUpdate() {
        if (this.scrollToAddNodeIndex != null) {
            let element = this.addNodeRefs.get(this.scrollToAddNodeIndex);
            if (element && element.scrollIntoView) {
                element.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'nearest' });
            }
            this.scrollToAddNodeIndex = null;
        }
        if (this.focusCommandBlockIndex != null) {
            let element = this.commandBlockRefs.get(this.focusCommandBlockIndex);
            if (element) {
                element.focus();
            }
            this.focusCommandBlockIndex = null;
        }
        if (this.props.activeProgramStepNum != null) {
            let element = this.commandBlockRefs.get(this.props.activeProgramStepNum);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
            }
        }
        if (this.props.actionPanelStepIndex != null) {
            if (this.state.replaceIsActive) {
                this.props.focusTrapManager.setFocusTrap(
                    this.handleCloseReplaceFocusTrap,
                    ['.replace-action-button', '.App__command-palette-command button'],
                    '.replace-action-button'
                );
            } else {
                this.props.focusTrapManager.setFocusTrap(
                    this.handleCloseActionPanelFocusTrap,
                    ['.ProgramBlockEditor__program-block--pressed', '.ActionPanel__panel button'],
                    '.ProgramBlockEditor__program-block--pressed'
                );
            }
        } else {
            this.props.focusTrapManager.unsetFocusTrap();
        }
    }
}

export default injectIntl(ProgramBlockEditor);
