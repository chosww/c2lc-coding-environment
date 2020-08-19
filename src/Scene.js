// @flow

import React from 'react';
import CharacterState from './CharacterState';
import RobotCharacter from './RobotCharacter';
import { injectIntl } from 'react-intl';
import './Scene.scss';

type SceneProps = {
    intl: any,
    numRows: number,
    numColumns: number,
    gridCellWidth: number,
    characterState: CharacterState
};

type SceneState = {
    location: {
        x: number,
        y: number
    },
    directionDegrees: number
};

class Scene extends React.Component<SceneProps, SceneState> {
    constructor(props: SceneProps) {
        super(props);
        this.state = {
            location: {
                x: 0,
                y: 0
            },
            directionDegrees: 90 // 0 is North, 90 is East
        }
    }

    forward(distance: number): Promise<void> {
        this.setState((state) => {
            const directionRadians = C2lcMath.degrees2radians(state.directionDegrees);
            const xOffset = Math.sin(directionRadians) * distance;
            const yOffset = Math.cos(directionRadians) * distance;

            let newX = state.location.x + xOffset;
            let newY = state.location.y - yOffset;
            const xBoundary = parseInt(sceneWidth) / 2;
            const yBoundary = parseInt(sceneHeight) / 2;

            if (Math.abs(newX) >= xBoundary ) {
                // newX and new Y need right formula for moving to left
                newX = xBoundary + distance / 4;
                console.log(newX);
            }

            if (Math.abs(newY) >= yBoundary) {
                newY = yBoundary + distance / 2;
            }

            return {
                location: {
                    x: newX,
                    y: newY
                }
            }
        });

        return Promise.resolve();
    }

    turnLeft(amountDegrees: number): Promise<void> {
        this.setState((state) => {
            return {
                directionDegrees: C2lcMath.wrap(0, 360,
                    state.directionDegrees - amountDegrees)
            };
        });

        return Promise.resolve();
    }

    turnRight(amountDegrees: number): Promise<void> {
        this.setState((state) => {
            return {
                directionDegrees: C2lcMath.wrap(0, 360,
                    state.directionDegrees + amountDegrees)
            };
        });

        return Promise.resolve();
    }

    drawGrid(numRow: number, numColumn: number, width: number) {
        const grid = [];
        let xOffset = parseInt(sceneMinX);
        let yOffset = parseInt(sceneMinY);
        for (let i=1;i < numRow + 1;i++) {
            yOffset = yOffset + width;
            if (i < numRow) {
            grid.push(<line
                className='Scene__grid-line'
                key={`grid-cell-row-${i}`}
                x1={`${xOffset}`}
                y1={`${yOffset}`}
                x2={`${-xOffset}`}
                y2={`${yOffset}`} />);
            }
            grid.push(
                <text
                    className='Scene__grid-label'
                    textAnchor='end'
                    key={`grid-cell-label-${i}`}
                    dominantBaseline='middle'
                    x={`${xOffset * 1.05}`}
                    y={`${yOffset - width / 2}`}>
                    {i}
                </text>
            )
        }
        xOffset = parseInt(sceneMinX);
        yOffset = parseInt(sceneMinY);
        for (let i=1;i < numColumn + 1;i++) {
            xOffset = xOffset + width;
            if (i < numColumn) {
            grid.push(<line
                className='Scene__grid-line'
                key={`grid-cell-column-${i}`}
                x1={`${xOffset}`}
                y1={`${yOffset}`}
                x2={`${xOffset}`}
                y2={`${-yOffset}`} />);
            }
            grid.push(
                <text
                    className='Scene__grid-label'
                    key={`grid-cell-label-${String.fromCharCode(64+i)}`}
                    textAnchor='middle'
                    x={`${xOffset - width / 2}`}
                    y={`${yOffset * 1.05}`}>
                    {String.fromCharCode(64+i)}
                </text>
            )
        }
        return grid;
    }

    render() {
        const width = this.props.numColumns * this.props.gridCellWidth;
        const height = this.props.numRows * this.props.gridCellWidth;
        const minX = -width / 2;
        const minY = -height / 2;

        // Subtract 90 degrees from the character bearing as the character
        // image is drawn upright when it is facing East
        const robotCharacterTransform = `translate(${this.props.characterState.xPos} ${this.props.characterState.yPos}) rotate(${this.props.characterState.directionDegrees - 90} 0 0)`;

        return (
            <div>
                <span
                    className='Scene'
                    role='img'
                    aria-label={this.props.intl.formatMessage({id: 'Scene'})}>
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox={`${sceneMinX} ${sceneMinY} ${sceneWidth} ${sceneHeight}`}>
                        <defs>
                            <clipPath id='Scene'>
                                <rect x={sceneMinX} y={sceneMinY} clipPathUnits="objectBoundingBox" width='750' height='100%' />
                            </clipPath>
                        </defs>
                        {/* Importing scss variable returns string type */}
                        {this.drawGrid(parseInt(numRow), parseInt(numColumn), parseInt(gridCellWidth))}
                        <RobotCharacter robotCharacterTransform={robotCharacterTransform} clipPathId='#Scene'/>
                    </svg>
                </span>
            </div>
        );
    }

    componentDidUpdate() {

    }
}

export default injectIntl(Scene);
