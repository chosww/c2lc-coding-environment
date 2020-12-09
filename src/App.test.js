// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// TODO: Figure out how to mock/replace AudioBuffer, calls to `new Player` in the `AudioManager` fail otherwise.
it.skip('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});
