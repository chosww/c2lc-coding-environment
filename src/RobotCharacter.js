// @flow

import React from 'react';
import { ReactComponent as RobotIcon } from './svg/Robot.svg';
import { sceneMinX, sceneMinY, characterRadius, characterWidth, characterHeight } from './RobotCharacter.scss'
import './RobotCharacter.scss';

type RobotCharacterProps = {
    robotCharacterTransform: string,
    width: number
};

export default class RobotCharacter extends React.Component<RobotCharacterProps, {}> {
    render() {
        const characterRadius = this.props.width / 2;
        const characterWidth = this.props.width * 0.75;
        return (
            <g
                transform={this.props.robotCharacterTransform}
                clipPath={`url(${this.props.clipPathId})`}
            >
                <defs>
                    <clipPath id='Scene'>
                        <rect x={sceneMinX} y={sceneMinY} width='80%' height='100%' />
                    </clipPath>
                </defs>
                <RobotIcon
                    className='RobotCharacter'
                    x={`${-characterWidth/2}`}
                    y={`${-characterWidth/2}`}
                    width={`${characterWidth}`}
                    height={`${characterWidth}`} />
                <circle className='RobotCharacter__container' r={`${characterRadius}`} />
            </g>
        );
    }
}
