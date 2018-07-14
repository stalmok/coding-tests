import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';

import { view as Shop } from './index';

const setup = customProps => {
  const props = {
    products: [
      { id: 1, name: 'Peas', price: 0.95, units: 'bag', quantity: 1 },
      { id: 2, name: 'Eggs', price: 2.1, units: 'dozen', quantity: 0 },
    ],
    totalPrice: 2,
    ...customProps,
    handleQuantityChange: jest.fn(),
  };

  const wrapper = mount(<MemoryRouter><Shop {...props} /></MemoryRouter>);

  return {
    ...props,
    wrapper,
  };
};

it('renders the list of products', () => {
  const { wrapper } = setup();

  expect(wrapper.find('ul.shop__products').length).toBe(1);
  expect(wrapper.find('li.shop__products-item').length).toBe(2);
});

it('renders checkout button with total price', () => {
  const { wrapper } = setup({ totalPrice: 3.05 });

  expect(wrapper.find('button.shop__checkout-button').text()).toBe(
    'Checkout ($3.05)'
  );
});

it('calls handleQuantityChange with product id and new quantity when increase button is clicked', () => {
  const { wrapper, handleQuantityChange } = setup();

  wrapper.find('.increase').first().simulate('click');

  expect(handleQuantityChange.mock.calls.length).toBe(1);
  expect(handleQuantityChange.mock.calls[0][0]).toBe(1); // product id
  expect(handleQuantityChange.mock.calls[0][1]).toBe(2); // quantity
});
