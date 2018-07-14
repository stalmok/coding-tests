import reducer from './products'

it('should return the initial state', () => {
  expect(reducer(undefined, {})).toEqual([])
})
