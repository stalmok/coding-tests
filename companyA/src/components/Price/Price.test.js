import React from 'react';
import { mount } from 'enzyme';

import Price from './index';

const setup = props => {
  const wrapper = mount(<Price {...props} />);

  return {
    ...props,
    wrapper,
  };
};

it('renders given number formatted in GBP', () => {
  const { wrapper } = setup({ amount: 1, currency: 'GBP' });

  expect(wrapper.find('span').text()).toBe('£1.00');
});

it('renders given number formatted in EUR', () => {
  const { wrapper } = setup({ amount: 2, currency: 'EUR' });

  expect(wrapper.find('span').text()).toBe('2,00 €');
});
