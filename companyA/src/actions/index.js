export function updateQuantity(id, quantity) {
  return {
    type: 'UPDATE_QUANTITY',
    id,
    quantity,
  };
}
