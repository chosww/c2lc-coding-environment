// @flow

import React from 'react';
import { ReactComponent as RobotIcon } from './svg/Robot.svg';
import { ReactComponent as SpaceShipIcon } from './svg/SpaceShip.svg';
import { ReactComponent as RabbitIcon } from './svg/Rabbit.svg';
import './Character.scss';

type CharacterProps = {
    world: string,
    transform: string,
    width: number,
};

export default class Character extends React.Component<CharacterProps, {}> {
    characterRef: any;

    constructor(props: CharacterProps) {
        super(props);
        this.characterRef = React.createRef();
    }

    getThemedCharacter = () => {
        if (this.props.world === 'space') {
            return (
                <SpaceShipIcon
                    className='Character__icon'
                    x={-this.props.width/2}
                    y={-this.props.width/2}
                    width={this.props.width}
                    height={this.props.width} />
            )
        } else if (this.props.world === 'forest') {
            return (
                <RabbitIcon
                    className='Character__icon'
                    x={-this.props.width/2}
                    y={-this.props.width/2}
                    width={this.props.width}
                    height={this.props.width} />
            )
        } else {
            return (
                <RobotIcon
                    className='Character__icon'
                    x={-this.props.width/2}
                    y={-this.props.width/2}
                    width={this.props.width}
                    height={this.props.width} />
            )
        }
    }

    scrollScene() {
        if (this.characterRef.current) {
            const characterBounds = this.characterRef.current.getBoundingClientRect();
            const sceneRef = document.getElementById('scene');
            const sceneBounds = sceneRef.getBoundingClientRect();
            if (characterBounds.left < sceneBounds.left) {
                sceneRef.scrollLeft -= (sceneBounds.left - characterBounds.left + 50);
            }
            else if ((characterBounds.left + characterBounds.width) > (sceneBounds.left + sceneBounds.width)) {
                sceneRef.scrollLeft += (characterBounds.left + characterBounds.width) - (sceneBounds.left + sceneBounds.width) + 50;
            }

            if (characterBounds.top < sceneBounds.top) {
                sceneRef.scrollTop -= (sceneBounds.top - characterBounds.top + 50);
            }
            else if ((characterBounds.top + characterBounds.height) > (sceneBounds.top + sceneBounds.height)) {
                sceneRef.scrollTop += (characterBounds.top + characterBounds.height) - (sceneBounds.top + sceneBounds.height) + 50;
            }
        }
    }

    render() {
        return (
            <g
                ref={this.characterRef}
                className='Character'
                transform={this.props.transform}>
                {this.getThemedCharacter()}
            </g>
        );
    }

    componentDidMount() {
        this.scrollScene();
    }

    componentDidUpdate(prevProps: CharacterProps) {
        if (prevProps.transform !== this.props.transform) {
            this.scrollScene();
        }
    }
}
