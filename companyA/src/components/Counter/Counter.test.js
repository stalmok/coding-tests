import React from 'react'
import { mount } from 'enzyme'

import Counter from './index'

const selectors = {
  decrease: '.decrease',
  counter: '.counter',
  increase: '.increase',
}

const setup = customProps => {
  const props = {
    onChange: jest.fn(),
    ...customProps,
  }

  const wrapper = mount(<Counter {...props} />)

  return {
    ...props,
    wrapper,
  }
}

it('renders `-` button', () => {
  const { wrapper } = setup()

  expect(wrapper.find(selectors.decrease).text()).toBe('-')
})

it('renders `+` button', () => {
  const { wrapper } = setup()

  expect(wrapper.find(selectors.increase).last().text()).toBe('+')
})

it('renders 0 if `number` is not provided', () => {
  const { wrapper } = setup()

  expect(wrapper.find(selectors.counter).text()).toBe('0')
})

it('renders `number` prop as given', () => {
  const { wrapper } = setup({ counter: 11 })

  expect(wrapper.find('span > span').text()).toBe('11')
})

it('calls `onChage` handler with decreased counter if `-` button is clicked', () => {
  const { wrapper, onChange } = setup({ counter: 1 })

  wrapper.find(selectors.decrease).simulate('click')

  expect(onChange.mock.calls.length).toBe(1)
  expect(onChange.mock.calls[0][0]).toBe(0)
})

it('calls `onChage` handler with increased counter if `+` button is clicked', () => {
  const { wrapper, onChange } = setup({ counter: 1 })

  wrapper.find(selectors.increase).simulate('click')

  expect(onChange.mock.calls.length).toBe(1)
  expect(onChange.mock.calls[0][0]).toBe(2)
})

it('does not call `onChage` handler if `-` button is clicked when counter is zero', () => {
  const { wrapper, onChange } = setup({ counter: 0 })

  wrapper.find(selectors.decrease).simulate('click')

  expect(onChange.mock.calls.length).toBe(0)
})
