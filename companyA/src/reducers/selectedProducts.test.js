import deepFreeze from 'deep-freeze';

import reducer from './selectedProducts';

it('should return the initial state', () => {
  expect(reducer(undefined, {})).toEqual([]);
});

describe('UPDATE_QUANTITY', () => {
  it('adds product to the state if it did not exist before', () => {
    const stateBefore = [{ id: 1, quantity: 1 }];
    const stateAfter = [{ id: 1, quantity: 1 }, { id: 2, quantity: 1 }];

    deepFreeze(stateBefore);

    expect(
      reducer(stateBefore, {
        type: 'UPDATE_QUANTITY',
        id: 2,
        quantity: 1,
      })
    ).toEqual(stateAfter);
  });

  it('removes product from the state if the given quantity is 0', () => {
    const stateBefore = [{ id: 1, quantity: 1 }, { id: 2, quantity: 1 }];
    const stateAfter = [{ id: 1, quantity: 1 }];

    deepFreeze(stateBefore);

    expect(
      reducer(stateBefore, {
        type: 'UPDATE_QUANTITY',
        id: 2,
        quantity: 0,
      })
    ).toEqual(stateAfter);
  });

  it('updates quantity of the given id', () => {
    const stateBefore = [{ id: 1, quantity: 1 }, { id: 2, quantity: 1 }];
    const stateAfter = [{ id: 1, quantity: 2 }, { id: 2, quantity: 1 }];

    deepFreeze(stateBefore);

    expect(
      reducer(stateBefore, {
        type: 'UPDATE_QUANTITY',
        id: 1,
        quantity: 2,
      })
    ).toEqual(stateAfter);
  });
});
