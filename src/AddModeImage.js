// @flow

import * as React from 'react';
import { injectIntl } from 'react-intl';
import type {IntlShape} from 'react-intl';

import { ReactComponent as AddIcon } from './svg/Add.svg';

type AddModeImageProps = {
    className: string,
    intl: IntlShape
};

class AddModeImage extends React.Component<AddModeImageProps, {}> {
    render() {
        return (
            <span role='img'
                  aria-label={this.props.intl.formatMessage({id: 'ProgramBlockEditor.editorAction.add'})}
                  className={this.props.className}>
                <AddIcon/>
            </span>
        );
    }
}

export default injectIntl(AddModeImage);
