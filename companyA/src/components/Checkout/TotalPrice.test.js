import React from 'react';
import { mount } from 'enzyme';

import TotalPrice from './TotalPrice';
import CurrencySelector from '../CurrencySelector';
import * as api from '../../api';
import { defaultCurrency } from '../../config';

const setup = customProps => {
  const props = {
    amount: 12.02,
    ...customProps,
  };

  // disable CurrencySelector's remote API call
  CurrencySelector.prototype.componentDidMount = jest.fn();

  const wrapper = mount(<TotalPrice {...props} />);

  return {
    ...props,
    wrapper,
  };
};

it('renders CurrencySelector component with correct props', () => {
  const { wrapper } = setup();

  expect(wrapper.find('CurrencySelector').prop('onChange')).toBe(
    wrapper.instance().updatePrice
  );
});

it('renders total price', () => {
  const { wrapper, amount } = setup();

  expect(wrapper.find('.checkout__total-price').text()).toBe(
    `Total: $${amount}`
  );
});

it('sets correct default state', () => {
  const { wrapper, amount } = setup();

  expect(wrapper.state('currency')).toBe(defaultCurrency);
  expect(wrapper.state('price')).toBe(amount);
});

it('updatePrice calls api.convertCurrency and sets the state after', () => {
  const { wrapper } = setup();

  api.convertCurrency = () => Promise.resolve(2);

  wrapper.instance().updatePrice('GBP').then(() => {
    expect(wrapper.state('currency')).toBe('GBP');
    expect(wrapper.state('price')).toBe(2);
  });
});

it('updatePrice sets fetchingError in state if api.convertCurrency throws an error', () => {
  const { wrapper } = setup();

  api.convertCurrency = () => Promise.reject('error');

  wrapper.instance().updatePrice().then(() => {
    expect(wrapper.state('fetchingError')).toBe('error');
  });
});

it('renders <Error /> if fetchingError is set in state', () => {
  const { wrapper } = setup();

  wrapper.setState({ fetchingError: true });

  expect(wrapper.find('Error').length).toBe(1);
});
