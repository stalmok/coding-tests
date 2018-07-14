import React from 'react';
import ReactDOM from 'react-dom';

import Root from './Root';

const createFakeStore = fakeData => ({
  getState() {
    return fakeData;
  },

  subscribe() {},
  dispatch() {},
});

it('renders without crashing', () => {
  const div = document.createElement('div');

  ReactDOM.render(<Root store={createFakeStore({ products: [] })} />, div);
});
