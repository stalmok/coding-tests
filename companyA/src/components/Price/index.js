import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { format } from 'currency-formatter';

class Price extends Component {
  render() {
    const { amount, currency } = this.props;

    return <span>{format(amount, { code: currency })}</span>;
  }
}

Price.propTypes = {
  amount: PropTypes.number.isRequired,
  currency: PropTypes.string.isRequired,
};

export default Price;
