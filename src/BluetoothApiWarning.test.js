// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import BluetoothApiWarning from './BluetoothApiWarning';

import { IntlProvider } from 'react-intl';
import messages from './messages.json';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<IntlProvider locale="en" messages={messages["en"]}>
        <BluetoothApiWarning />
    </IntlProvider>, div);
    ReactDOM.unmountComponentAtNode(div);
});
