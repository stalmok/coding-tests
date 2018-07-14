import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Price from '../Price';
import CurrencySelector from '../CurrencySelector';
import Error from '../Error';
import { convertCurrency } from '../../api';
import { defaultCurrency } from '../../config';

class TotalPrice extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currency: defaultCurrency,
      price: props.amount,
      fetchingError: null,
    };

    this.updatePrice = this.updatePrice.bind(this);
  }

  updatePrice(currency) {
    // always convert from original amount
    return convertCurrency(this.props.amount, currency)
      .then(price => {
        this.setState({ currency, price });
      })
      .catch(error => {
        this.setState({
          fetchingError: error,
        });
      });
  }

  render() {
    const { price, currency, fetchingError } = this.state;

    return (
      <div>
        <div className="checkout__total">
          <CurrencySelector onChange={this.updatePrice} />

          <span className="checkout__total-price">
            Total: <Price amount={price} currency={currency} />
          </span>
        </div>

        {fetchingError &&
          <Error message="Failed to convert the price, try later" />}
      </div>
    );
  }
}

TotalPrice.propTypes = {
  amount: PropTypes.number.isRequired,
};

export default TotalPrice;
