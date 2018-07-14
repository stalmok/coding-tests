import React from 'react';
import { mount } from 'enzyme';

import CurrencySelector from './index';
import * as api from '../../api';
import { defaultCurrency } from '../../config';

const setup = customProps => {
  const props = {
    onChange: jest.fn(),
    ...customProps,
  };

  // componentDidMount fetches currencies from remote API
  // we'll test it separately, so let's disable this here
  CurrencySelector.prototype.componentDidMount = jest.fn();

  const wrapper = mount(<CurrencySelector {...props} />);

  const currencies = [
    { value: 'GBP', label: 'British Pound Sterling' },
    { value: 'USD', label: 'United States Dollar' },
  ];

  wrapper.setState({ currencies });

  return {
    ...props,
    currencies,
    wrapper,
  };
};

it('renders a select with all correct props', () => {
  const { wrapper, currencies } = setup();

  const select = wrapper.find('Select');

  expect(select.prop('value')).toBe(defaultCurrency);
  expect(select.prop('options')).toBe(currencies);
  expect(select.prop('onChange')).toBe(wrapper.instance().handleChange);
  expect(select.prop('clearable')).toBe(false);
});

it('changes currency in state when new currency is selected', () => {
  const { wrapper, currencies } = setup();

  wrapper.instance().handleChange({ value: currencies[0].value });

  expect(wrapper.state('selectedCurrency')).toBe(currencies[0].value);
});

it('calls onChange with the new value if new currency is selected', () => {
  const { wrapper, currencies, onChange } = setup();

  wrapper.instance().handleChange({ value: currencies[0].value });

  expect(onChange.mock.calls.length).toBe(1);
  expect(onChange.mock.calls[0][0]).toBe(currencies[0].value);
});

it('renders <Error /> if fetchingError is set in state', () => {
  const { wrapper } = setup();

  wrapper.setState({ fetchingError: true });

  expect(wrapper.find('Error').length).toBe(1);
});

it('getCurrencies calls api.fetchCurrencies and sets the state after', () => {
  const currencies = {
    AED: 'United Arab Emirates Dirham',
    AFN: 'Afghan Afghani',
  };

  const { wrapper } = setup();

  api.fetchCurrencies = () => Promise.resolve(currencies);

  wrapper.instance().getCurrencies().then(() => {
    expect(wrapper.state('currencies')).toEqual([
      { value: 'AED', label: currencies['AED'] },
      { value: 'AFN', label: currencies['AFN'] },
    ]);
  });
});

it('getCurrencies sets fetchingError in state if api.fetchCurrencies throws an error', () => {
  const { wrapper } = setup();

  api.fetchCurrencies = () => Promise.reject('error');

  wrapper.instance().getCurrencies().then(() => {
    expect(wrapper.state('fetchingError')).toBe('error');
  });
});
