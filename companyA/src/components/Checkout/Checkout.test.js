import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';

import { view as Checkout } from './index';
import CurrencySelector from '../CurrencySelector';

const setup = customProps => {
  const props = {
    products: [
      { id: 1, name: 'Peas', price: 0.95, units: 'bag', quantity: 1 },
      { id: 2, name: 'Eggs', price: 2.1, units: 'dozen', quantity: 2 },
    ],
    totalPrice: 5.15,
    ...customProps,
  };

  // disable CurrencySelector's remote API call
  CurrencySelector.prototype.componentDidMount = jest.fn();

  const wrapper = mount(<MemoryRouter><Checkout {...props} /></MemoryRouter>);

  return {
    ...props,
    wrapper,
  };
};

it('renders <EmptyBasket /> if no products are given', () => {
  const { wrapper } = setup({ products: [] });

  expect(wrapper.find('EmptyBasket').length).toBe(1);
});

it('renders the list of products with prices', () => {
  const { wrapper, products } = setup();

  expect(wrapper.find('ul').length).toBe(1);
  expect(wrapper.find('li.checkout__item').length).toBe(2);
  expect(wrapper.find('li Price').first().prop('amount')).toBe(
    products[0].price
  );
  expect(wrapper.find('li Price').last().prop('amount')).toBe(
    products[1].price
  );
});

it('renders <TotalPrice /> with correct props', () => {
  const totalPrice = 2.32;
  const { wrapper } = setup({ totalPrice });

  expect(wrapper.find('TotalPrice').length).toBe(1);
  expect(wrapper.find('TotalPrice').prop('amount')).toBe(totalPrice);
});

it('renders <LinkBack />', () => {
  const { wrapper } = setup();

  expect(wrapper.find('LinkBack').length).toBe(1);
});
