// @flow

import * as C2lcMath from './C2lcMath';
import SceneDimensions from './SceneDimensions';

// Character direction is stored as eighths of a turn, as follows:
// N:  0
// NE: 1
// E:  2
// SE: 3
// S:  4
// SW: 5
// W:  6
// NW: 7

type PathSegment = {
    x1: number,
    y1: number,
    x2: number,
    y2: number
};

export default class CharacterState {
    xPos: number; // Positive x is East
    yPos: number; // Positive y is South
    direction: number; // Eighths of a turn, see note above
    path: Array<PathSegment>;
    sceneDimensions: SceneDimensions;

    constructor(xPos: number, yPos: number, direction: number, path: Array<PathSegment>, sceneDimensions: SceneDimensions) {
        this.xPos = xPos;
        this.yPos = yPos;
        this.direction = direction;
        this.path = path;
        this.sceneDimensions = sceneDimensions;
    }

    getDirectionDegrees() {
        return this.direction * 45;
    }

    pathEquals(otherPath: Array<PathSegment>, epsilon: number) {
        if (this.path.length !== otherPath.length) {
            return false;
        }
        for (let i = 0; i < this.path.length; i++) {
            if (!C2lcMath.approxEqual(this.path[i].x1, otherPath[i].x1, epsilon)
                    || !C2lcMath.approxEqual(this.path[i].y1, otherPath[i].y1, epsilon)
                    || !C2lcMath.approxEqual(this.path[i].x2, otherPath[i].x2, epsilon)
                    || !C2lcMath.approxEqual(this.path[i].y2, otherPath[i].y2, epsilon)) {
                return false;
            }
        }
        return true;
    }

    forward(distance: number, drawingEnabled: boolean): CharacterState {
        let xOffset = 0;
        let yOffset = 0;

        switch(this.direction) {
            case 0:
                xOffset = 0;
                yOffset = -distance;
                break;
            case 1:
                xOffset = distance;
                yOffset = -distance;
                break;
            case 2:
                xOffset = distance;
                yOffset = 0;
                break;
            case 3:
                xOffset = distance;
                yOffset = distance;
                break;
            case 4:
                xOffset = 0;
                yOffset = distance;
                break;
            case 5:
                xOffset = -distance;
                yOffset = distance;
                break;
            case 6:
                xOffset = -distance;
                yOffset = 0;
                break;
            case 7:
                xOffset = -distance;
                yOffset = -distance;
                break;
            default:
                throw new Error('CharacterState direction must be an integer in range 0-7 inclusive');
        }

        let newYPos, newXPos = 0;
        let turnSegment = {
            x2: this.xPos,
            y2: this.yPos
        };
        switch(this.sceneDimensions.getBoundsStateX(this.xPos + xOffset)) {
            case 'outOfBoundsBelow':
                newXPos = 1;
                if (yOffset < 0) {
                    turnSegment = {
                        x1: this.xPos,
                        y1: this.yPos,
                        x2: newXPos,
                        y2: this.yPos - 1
                    };
                } else {
                    turnSegment = {
                        x1: this.xPos,
                        y1: this.yPos,
                        x2: newXPos,
                        y2: this.yPos + 1
                    }
                }
                break;
            case 'outOfBoundsAbove':
                newXPos = this.sceneDimensions.getWidth();
                if (yOffset < 0) {
                    turnSegment = {
                        x1: this.xPos,
                        y1: this.yPos,
                        x2: newXPos,
                        y2: this.yPos - 1
                    };
                } else {
                    turnSegment = {
                        x1: this.xPos,
                        y1: this.yPos,
                        x2: newXPos,
                        y2: this.yPos + 1
                    }
                }
                break;
            default:
                newXPos = this.xPos + xOffset;
                break;
        }

        switch(this.sceneDimensions.getBoundsStateY(this.yPos + yOffset)) {
            case 'outOfBoundsBelow':
                newYPos = 1;
                if (xOffset < 0) {
                    turnSegment = {
                        x1: this.xPos,
                        y1: this.yPos,
                        x2: this.xPos - 1,
                        y2: newYPos
                    };
                } else {
                    turnSegment = {
                        x1: this.xPos,
                        y1: this.yPos,
                        x2: this.xPos + 1,
                        y2: newYPos
                    }
                }
                break;
            case 'outOfBoundsAbove':
                newYPos = this.sceneDimensions.getHeight();
                if (xOffset < 0) {
                    turnSegment = {
                        x1: this.xPos,
                        y1: this.yPos,
                        x2: this.xPos - 1,
                        y2: newYPos
                    };
                } else {
                    turnSegment = {
                        x1: this.xPos,
                        y1: this.yPos,
                        x2: this.xPos + 1,
                        y2: newYPos
                    }
                }
                break;
            default:
                newYPos = this.yPos + yOffset;
                break;
        }

        const newPathSegment = {
            x1: turnSegment.x2,
            y1: turnSegment.y2,
            x2: newXPos,
            y2: newYPos
        };
        return new CharacterState(
            newXPos,
            newYPos,
            this.direction,
            drawingEnabled ?
                turnSegment.x1 != null && turnSegment.y1 != null ?
                    this.path.concat([turnSegment], [newPathSegment]) :
                    this.path.concat([newPathSegment]) :
                this.path,
            this.sceneDimensions
        );
    }

    turnLeft(amountEighthsOfTurn: number): CharacterState {
        return new CharacterState(
            this.xPos,
            this.yPos,
            C2lcMath.wrap(0, 8, this.direction - amountEighthsOfTurn),
            this.path,
            this.sceneDimensions
        );
    }

    turnRight(amountEighthsOfTurn: number): CharacterState {
        return new CharacterState(
            this.xPos,
            this.yPos,
            C2lcMath.wrap(0, 8, this.direction + amountEighthsOfTurn),
            this.path,
            this.sceneDimensions
        );
    }

    moveUpPosition(): CharacterState {
        let yPos = 0;
        if (this.sceneDimensions.getBoundsStateY(this.yPos - 1) === 'outOfBoundsBelow') {
            yPos = 1;
        } else {
            yPos = this.yPos - 1;
        }
        return new CharacterState(
            this.xPos,
            yPos,
            this.direction,
            this.path,
            this.sceneDimensions
        );
    }

    moveRightPosition(): CharacterState {
        let xPos = 0;
        if (this.sceneDimensions.getBoundsStateX(this.xPos + 1) === 'outOfBoundsAbove') {
            xPos = this.sceneDimensions.getWidth();
        } else {
            xPos = this.xPos + 1;
        }
        return new CharacterState(
            xPos,
            this.yPos,
            this.direction,
            this.path,
            this.sceneDimensions
        );
    }

    moveDownPosition(): CharacterState {
        let yPos = 0;
        if (this.sceneDimensions.getBoundsStateY(this.yPos + 1) === 'outOfBoundsAbove') {
            yPos = this.sceneDimensions.getHeight();
        } else {
            yPos = this.yPos + 1;
        }
        return new CharacterState(
            this.xPos,
            yPos,
            this.direction,
            this.path,
            this.sceneDimensions
        );
    }

    moveLeftPosition(): CharacterState {
        let xPos = 0;
        if (this.sceneDimensions.getBoundsStateY(this.xPos - 1) === 'outOfBoundsBelow') {
            xPos = 1;
        } else {
            xPos = this.xPos - 1;
        }
        return new CharacterState(
            xPos,
            this.yPos,
            this.direction,
            this.path,
            this.sceneDimensions
        );
    }

    changeXPosition(columnLabel: string): CharacterState {
        let newXPos = this.xPos;
        if (columnLabel <= String.fromCharCode(64 + this.sceneDimensions.getWidth()) && columnLabel >='A') {
            newXPos = columnLabel.charCodeAt(0) - 64;
        } else if (columnLabel <= String.fromCharCode(96 + this.sceneDimensions.getWidth()) && columnLabel >='a') {
            newXPos = columnLabel.charCodeAt(0) - 96;
        }
        return new CharacterState(
            newXPos,
            this.yPos,
            this.direction,
            this.path,
            this.sceneDimensions
        );
    }

    changeYPosition(rowLabel: number): CharacterState {
        let newYPos = this.yPos;
        if (rowLabel <= this.sceneDimensions.getHeight() && rowLabel >= 1) {
            newYPos = rowLabel;
        }
        return new CharacterState(
            this.xPos,
            newYPos,
            this.direction,
            this.path,
            this.sceneDimensions
        );
    }


    getRowLabel(): string {
        return `${this.yPos}`;
    }

    getColumnLabel(): string {
        return String.fromCharCode(64 + this.xPos);
    }
}
