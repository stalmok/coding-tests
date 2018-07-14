import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _find from 'lodash/find';

import './shop.css';
import Counter from '../Counter';
import Price from '../Price';
import { defaultCurrency } from '../../config';
import { updateQuantity } from '../../actions';

class Shop extends Component {
  render() {
    const { products, totalPrice, handleQuantityChange } = this.props;

    return (
      <div className="shop">
        <ul className="shop__products">
          {products.map(({ id, name, price, units, quantity }) =>
            <li key={id} className="shop__products-item">
              <div>
                {name}{' '}
                (<Price amount={price} currency={defaultCurrency} /> / {units})
              </div>
              <Counter
                counter={quantity}
                onChange={handleQuantityChange.bind(null, id)}
              />
            </li>
          )}
        </ul>

        <Link to="/checkout">
          <button className="shop__checkout-button">
            Checkout (<Price amount={totalPrice} currency={defaultCurrency} />)
          </button>
        </Link>
      </div>
    );
  }
}

export const view = Shop;

const mapStateToProps = ({ products, selectedProducts }) => {
  const productsWithQuantity = products.map(product => {
    const selectedProduct = _find(selectedProducts, { id: product.id });

    return {
      ...product,
      quantity: (selectedProduct || {}).quantity,
    };
  });

  return {
    products: productsWithQuantity,
    totalPrice: productsWithQuantity.reduce(
      (counter, { price, quantity = 0 }) => {
        return counter + quantity * price;
      },
      0
    ),
  };
};

const mapDispatchToProps = dispatch => {
  return {
    handleQuantityChange: (id, quantity) => {
      dispatch(updateQuantity(id, quantity));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Shop);
