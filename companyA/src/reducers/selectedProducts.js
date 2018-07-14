import _some from 'lodash/some'

const selectedProducts = (state = [], { type, id, quantity: newQuantity }) => {
  switch (type) {
    case 'UPDATE_QUANTITY':
      // insert if it doesn't exist yet
      if (!_some(state, { id })) return [...state, { id, quantity: 1 }]

      // remove if quantity goes down to zero.
      // i.e. product is not selected anymore
      if (newQuantity === 0) return state.filter(product => product.id !== id)

      return state.map(
        product =>
          product.id === id ? { ...product, quantity: newQuantity } : product
      )
    default:
      return state
  }
}

export default selectedProducts
