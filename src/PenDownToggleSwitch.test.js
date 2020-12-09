// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import PenDownToggleSwitch from './PenDownToggleSwitch';

import { IntlProvider } from 'react-intl';
import messages from './messages.json';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<IntlProvider locale="en" messages={messages["en"]}>
        <PenDownToggleSwitch onChange={() => { }} value={false} />
    </IntlProvider>, div);

    ReactDOM.unmountComponentAtNode(div);
});
