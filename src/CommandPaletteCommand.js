// @flow

import React from 'react';
import CommandBlock from './CommandBlock';
import { injectIntl } from 'react-intl';
import forwardSound from './audio/Move.wav';
import turnLeftSound from './audio/TurnLeft.wav';
import turnRightSound from './audio/TurnRight.wav';

type CommandPaletteCommandProps = {
    audioManager: Object,
    commandName: string,
    intl: any,
    selectedCommandName: ?string,
    onChange: (commandName: ?string) => void,
    onDragStart: (commandName: string) => void,
    onDragEnd: () => void
};

class CommandPaletteCommand extends React.Component<CommandPaletteCommandProps, {}> {
    handleClick = () => {
        //this.props.audioManager.playSound(this.props.commandName);
        if (this.props.commandName === 'forward') {
            const forwardAudio = document.getElementById('forwardSound');
            forwardAudio.src = forwardSound;
            forwardAudio.play();
        }
        this.props.onChange(
            this.props.commandName === this.props.selectedCommandName ? null : this.props.commandName
        );
    };

    handleDragStart = () => {
        this.props.onDragStart(this.props.commandName);
    };

    handleDragEnd = () => {
        this.props.onDragEnd();
    };

    render() {
        const pressed = this.props.commandName === this.props.selectedCommandName;

        const ariaLabel = this.props.intl.formatMessage({
            id: `CommandPaletteCommand.${this.props.commandName}`
        });

        return (
            <CommandBlock
                draggable='true'
                id={`command-block--${this.props.commandName}`}
                onDragStart={this.handleDragStart}
                onDragEnd={this.handleDragEnd}
                commandName={this.props.commandName}
                className={pressed ? 'command-block--pressed' : undefined}
                aria-label={ariaLabel}
                aria-pressed={pressed}
                onClick={this.handleClick}
                disabled={false}>
            </CommandBlock>
        )
    }
}

export default injectIntl(CommandPaletteCommand);
