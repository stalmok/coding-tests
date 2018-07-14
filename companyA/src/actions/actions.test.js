import { updateQuantity } from './index';

it('updateQuantity creates an action to update product quantity', () => {
  const id = 1;
  const quantity = 1;

  const expectedAction = {
    type: 'UPDATE_QUANTITY',
    id,
    quantity,
  };

  expect(updateQuantity(id, quantity)).toEqual(expectedAction);
});
