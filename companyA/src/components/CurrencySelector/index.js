import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

import Error from '../Error';
import { defaultCurrency } from '../../config';
import { fetchCurrencies } from '../../api';

class CurrencySelector extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currencies: [],
      selectedCurrency: defaultCurrency,
      fetchingError: null,
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.getCurrencies();
  }

  getCurrencies() {
    return fetchCurrencies()
      .then(currencies =>
        this.setState({
          currencies: Object.keys(currencies).map(currency => ({
            value: currency,
            label: currencies[currency],
          })),
        })
      )
      .catch(error => {
        this.setState({
          fetchingError: error,
        });
      });
  }

  handleChange({ value }) {
    this.setState({ selectedCurrency: value });

    this.props.onChange(value);
  }

  render() {
    const { selectedCurrency, currencies, fetchingError } = this.state;

    if (fetchingError) {
      return <Error message="Failed to fetch the list of currencies" />;
    }

    return (
      <Select
        value={selectedCurrency}
        options={currencies}
        onChange={this.handleChange}
        clearable={false}
      />
    );
  }
}

CurrencySelector.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default CurrencySelector;
