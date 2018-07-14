import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';

import Shop from './Shop';
import Checkout from './Checkout';

const Root = ({ store }) => {
  return (
    <Provider store={store}>
      <Router>
        <div>
          <Route exact path="/" component={Shop} />
          <Route exact path="/checkout" component={Checkout} />
        </div>
      </Router>
    </Provider>
  );
};

Root.propTypes = {
  store: PropTypes.object.isRequired,
};

export default Root;
