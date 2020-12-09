// @flow

import * as C2lcMath from './C2lcMath';

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

    constructor(xPos: number, yPos: number, direction: number, path: Array<PathSegment>) {
        this.xPos = xPos;
        this.yPos = yPos;
        this.direction = direction;
        this.path = path;
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

        const newPathSegment = {
            x1: this.xPos,
            y1: this.yPos,
            x2: this.xPos + xOffset,
            y2: this.yPos + yOffset
        };
        return new CharacterState(
            this.xPos + xOffset,
            this.yPos + yOffset,
            this.direction,
            drawingEnabled ?
                this.path.concat([newPathSegment]) :
                this.path
        );
    }

    turnLeft(amountEighthsOfTurn: number): CharacterState {
        return new CharacterState(
            this.xPos,
            this.yPos,
            C2lcMath.wrap(0, 8, this.direction - amountEighthsOfTurn),
            this.path
        );
    }

    turnRight(amountEighthsOfTurn: number): CharacterState {
        return new CharacterState(
            this.xPos,
            this.yPos,
            C2lcMath.wrap(0, 8, this.direction + amountEighthsOfTurn),
            this.path
        );
    }
}
