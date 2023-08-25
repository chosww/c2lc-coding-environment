// @flow

import CustomBackground from './CustomBackground';
import React from 'react';
import { getTileColor, getTileImage, isTransparent } from './TileData';

type CustomBackgroundSceneLayerProps = {
    customBackground: CustomBackground
};

export default class CustomBackgroundSceneLayer extends React.PureComponent<CustomBackgroundSceneLayerProps, {}> {
    render() {
        const tiles = [];

        for (let y = this.props.customBackground.sceneDimensions.getMinY(); y < this.props.customBackground.sceneDimensions.getMaxY() + 1; y++) {
            for (let x = this.props.customBackground.sceneDimensions.getMinX(); x < this.props.customBackground.sceneDimensions.getMaxX() + 1; x++) {
                const tileCode = this.props.customBackground.getTile(x, y);
                if (!isTransparent(tileCode)) {
                    const tileImage = getTileImage(tileCode);
                    if (tileImage == null) {
                        tiles.push(
                            <rect
                                key={`custom-background-tile-${x}-${y}`}
                                x={x - 0.5}
                                y={y - 0.5}
                                width={1}
                                height={1}
                                style={{fill: getTileColor(tileCode)}}
                            />
                        );
                    } else {
                        tiles.push(React.createElement(tileImage,
                            {
                                key: `custom-background-tile-${x}-${y}`,
                                x: x - 0.5,
                                y: y - 0.5,
                                width: 1,
                                height: 1
                            }
                        ));
                    }
                }
            }
        }

        return (
            <React.Fragment>
                {tiles}
            </React.Fragment>
        );
    }
}
