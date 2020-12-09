// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import DashConnectionErrorModal from './DashConnectionErrorModal';

import { IntlProvider } from 'react-intl';
import messages from './messages.json';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<IntlProvider locale="en" messages={messages["en"]}>
        <DashConnectionErrorModal onCancel={() => { }} onRetry={() => { }} show={true} />
    </IntlProvider>, div);
    ReactDOM.unmountComponentAtNode(div);
});
