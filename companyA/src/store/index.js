import { createStore } from 'redux';

import reducers from '../reducers';
import { fetchProducts } from '../api';

const initialData = {
  products: fetchProducts(),
};

const store = createStore(
  reducers,
  initialData,
  // enable Redux DevTools Extension (https://github.com/zalmoxisus/redux-devtools-extension)
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
