import { combineReducers } from 'redux';

import products from './products';
import selectedProducts from './selectedProducts';

export default combineReducers({
  products,
  selectedProducts,
});
