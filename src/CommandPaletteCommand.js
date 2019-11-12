// @flow

import React from 'react';
import type {SelectedCommand} from './types';
import { Button, Col, Image, OverlayTrigger, Tooltip } from 'react-bootstrap';

type CommandPaletteCommandProps = {
    type: string,
    commandName: string,
    icon: any,
    selectedCommandName: SelectedCommand,
    onChange: (commandName: string) => void
};

export default class CommandPaletteCommand extends React.Component<CommandPaletteCommandProps, {}> {
    handleClick = () => {
        if (this.props.type === 'movements' && this.props.selectedCommandName !== null ) {
            this.props.onChange(this.props.selectedCommandName.command === this.props.commandName ? null : this.props.commandName, 'movements');
        } else if (this.props.type === 'programs' && this.props.selectedCommandName !== null) {
            this.props.onChange(this.props.selectedCommandName.program === this.props.commandName ? null : this.props.commandName, 'programs');
        } else {
            this.props.onChange(this.props.commandName, this.props.type);
        }
    }

    render() {
        return (
            <Col>
                <OverlayTrigger
                    placement={'right'}
                    overlay={<Tooltip>{this.props.commandName}</Tooltip>}
                >
                    <Button
                        variant={this.props.selectedCommandName ?
                            this.props.selectedCommandName.command === this.props.commandName ? 'outline-primary' : 'light' :
                            'light'}
                        //aria-label={this.state.selected ? `${} activated` : `${item} inactive`}
                        onClick={this.handleClick}>
                        <Image src={this.props.icon}/>
                    </Button>
                </OverlayTrigger>
            </Col>
        )
    }
}
