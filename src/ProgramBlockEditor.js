// @flow

import { Button, Col, Container, Image, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import * as ProgramUtils from './ProgramUtils';
import type {Program, SelectedCommand} from './types';
import React from 'react';
import arrowLeft from 'material-design-icons/navigation/svg/production/ic_arrow_back_48px.svg';
import arrowRight from 'material-design-icons/navigation/svg/production/ic_arrow_forward_48px.svg';
import arrowUp from 'material-design-icons/navigation/svg/production/ic_arrow_upward_48px.svg';
import addIcon from 'material-design-icons/content/svg/production/ic_add_24px.svg';
import deleteIcon from 'material-design-icons/content/svg/production/ic_clear_24px.svg';
import emptyBlockIcon from 'material-design-icons/toggle/svg/production/ic_check_box_outline_blank_48px.svg';

type ProgramBlockEditorProps = {
    program: Program,
    selectedCommand: SelectedCommand,
    onFunction: (func: ?string) => void,
    onChange: (Program) => void
};

type ProgramBlockEditorState = {
    addBlockActive: boolean,
    deleteBlockActive: boolean
}

export default class ProgramBlockEditor extends React.Component<ProgramBlockEditorProps, ProgramBlockEditorState> {
    counter: number;
    constructor(props: ProgramBlockEditorProps) {
        super(props);
        this.state = {
            addBlockActive: false,
            deleteBlockActive: false,
            customProgramPosition: {}
        }
    }

    handleClickAdd = () => {
        this.props.onFunction(this.props.selectedCommand ?
            this.props.selectedCommand.func === 'add' ? null : 'add' :
            'add'
        );
    };

    handleClickDelete = () => {
        this.props.onFunction(this.props.selectedCommand ?
            this.props.selectedCommand.func === 'delete' ? null : 'delete' :
            'delete'
        );
    };

    handleClickStep = (index: number) => {
        if (this.props.selectedCommand) {
            if (this.props.selectedCommand.func === 'add') {
                this.props.onChange(ProgramUtils.insert(this.props.program,
                    index, 'none', 'none'));
                this.props.onFunction(null);
            } else if (this.props.selectedCommand.func === 'delete') {
                this.props.onChange(ProgramUtils.deleteStep(this.props.program, index));
                this.props.onFunction(null);
            } else if (this.props.selectedCommand.command) {
                this.props.onChange(ProgramUtils.overwrite(this.props.program,
                    index, this.props.selectedCommand.command, 'none'));
                this.props.onFunction(null);
            } else if (this.props.selectedCommand.program) {
                console.log(this.props.savedProgramList[this.props.selectedCommand.program]);
                this.handleCustomProgramIndex(index, this.props.savedProgramList[this.props.selectedCommand.program].length);
                this.props.onChange(ProgramUtils.shift(this.props.program,
                    index, this.props.savedProgramList[this.props.selectedCommand.program], 'none'));
                this.props.onFunction(null);
            }
        }
    };

    handleCustomProgramIndex = (start: number, programLength: number) => {
        let currentCustomProgramPositions = this.state.customProgramPosition;
        const end = start + programLength;

        for(let i=start;i<end;i++) {
            currentCustomProgramPositions[i] = {
                name : this.props.selectedCommand.program,
                start,
                end
            }
        }

        this.setState((state) => {
            return {
                customProgramPosition : currentCustomProgramPositions
            }
        });
    };

    componentDidUpdate() {
        console.log(this.state.customProgramPosition);
    }

    render() {
        return (
            <Container>
                <Row className='justify-content-end'>
                    <Col>
                        <Button
                            key='addButton'
                            aria-label={this.state.addBlockActive ? 'deactivate add a program to the sequence mode' : 'activate add a program to the sequence mode'}
                            variant={this.props.selectedCommand ?
                                this.props.selectedCommand.func === 'add' ? 'outline-primary' : 'light' :
                                'light'}
                            onClick={this.handleClickAdd}>
                            <Image src={addIcon} />
                        </Button>
                    </Col>
                    <Col>
                        <Button
                            key='deleteButton'
                            aria-label={this.state.deleteBlockActive ? 'deactivate delete a program from the sequence mode' : 'activate delete a program from the sequence mode'}
                            variant={this.props.selectedCommand ?
                                this.props.selectedCommand.func === 'delete' ? 'outline-primary' : 'light' :
                                'light'}
                            onClick={this.handleClickDelete}>
                            <Image src={deleteIcon} />
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {this.props.program.map((item, programStepNumber)=> {
                            switch(item) {
                                case 'forward': return (
                                    <Row
                                        key={`${programStepNumber}-forward`}
                                        className='justify-content-center'>
                                        <OverlayTrigger
                                            key={`${programStepNumber}-forward`}
                                            placement={'right'}
                                            overlay={this.state.customProgramPosition[programStepNumber] ? <Tooltip>{this.state.customProgramPosition[programStepNumber].name}</Tooltip> : <Tooltip>Forward</Tooltip> }
                                        >
                                            <Button
                                                variant={this.state.customProgramPosition[programStepNumber] ? 'warning' : 'primary'}
                                                aria-label={this.state.addBlockActive ? `Forward button. Press to add an empty command block after this` : this.state.deleteBlockActive ? `Forward button. Press to delete this command` : 'Forward button'}
                                                onClick={()=>{this.handleClickStep(programStepNumber)}}>
                                                <Image src={arrowUp} />
                                        </Button>
                                        </OverlayTrigger>
                                    </Row>);
                                case 'left': return (
                                    <Row
                                        key={`${programStepNumber}-left`}
                                        className='justify-content-center'>
                                        <OverlayTrigger
                                            key={`${programStepNumber}-forward`}
                                            placement={'right'}
                                            overlay={this.state.customProgramPosition[programStepNumber] ? <Tooltip>{this.state.customProgramPosition[programStepNumber].name}</Tooltip> : <Tooltip>Left</Tooltip> }
                                        >
                                        <Button
                                            variant={this.state.customProgramPosition[programStepNumber]? 'warning' : 'primary'}
                                            aria-label={this.state.addBlockActive ? `Left button. Press to add an empty command block after this` : this.state.deleteBlockActive ? `Left button. Press to delete this command` : 'Left button'}
                                            onClick={()=>{this.handleClickStep(programStepNumber)}}>
                                            <Image src={arrowLeft} />
                                        </Button>
                                        </OverlayTrigger>
                                    </Row>);
                                case 'right': return (
                                    <Row
                                        key={`${programStepNumber}-right`}
                                        className='justify-content-center'>
                                        <OverlayTrigger
                                            key={`${programStepNumber}-forward`}
                                            placement={'right'}
                                            overlay={this.state.customProgramPosition[programStepNumber] ? <Tooltip>{this.state.customProgramPosition[programStepNumber].name}</Tooltip> : <Tooltip>Right</Tooltip> }
                                        >
                                        <Button
                                            variant={this.state.customProgramPosition[programStepNumber]? 'warning' : 'primary'}
                                            aria-label={this.state.addBlockActive ? `Right button. Press to add an empty command block after this` : this.state.deleteBlockActive ? `Right button. Press to delete this command` : 'Right button'}
                                            onClick={()=>{this.handleClickStep(programStepNumber)}}>
                                            <Image src={arrowRight} />
                                        </Button>
                                        </OverlayTrigger>
                                    </Row>);
                                case 'none': return (
                                    <Row
                                        key={`${programStepNumber}-none`}
                                        className='justify-content-center'>
                                        <Button
                                            aria-label={this.state.addBlockActive ? `Empty blcok button. Press to add an empty command block after this` : this.state.deleteBlockActive ? `Empty block button. Press to delete this command` : 'Empty block button'}
                                            onClick={()=>{this.handleClickStep(programStepNumber)}}>
                                            <Image src={emptyBlockIcon} />
                                        </Button>
                                    </Row>);
                                default: return;
                            }
                        })}
                    </Col>
                </Row>
            </Container>
        );
    }
}
