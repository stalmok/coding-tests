import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import _find from 'lodash/find';

import './checkout.css';
import Price from '../Price';
import Divider from '../Divider';
import TotalPrice from './TotalPrice';
import { defaultCurrency } from '../../config';

function LinkBack() {
  return <Link to="/" className="checkout__back">Go back to the Shop</Link>;
}

function EmptyBasket() {
  return (
    <div className="checkout">
      <h1>Your Shopping Basket is empty.</h1>
      <LinkBack />
    </div>
  );
}

function Checkout({ products, totalPrice }) {
  if (products.length === 0) return <EmptyBasket />;

  return (
    <div className="checkout">
      <h1>Order Summary</h1>
      <ul>
        {products.map(({ id, name, quantity, price }) =>
          <li key={id} className="checkout__item">
            <div>{name} x {quantity}</div>
            <Price amount={price} currency={defaultCurrency} />
          </li>
        )}
      </ul>

      <Divider />
      <TotalPrice amount={totalPrice} />
      <LinkBack />
    </div>
  );
}

Checkout.defaultProps = {
  products: [],
};

Checkout.propTypes = {
  products: PropTypes.array.isRequired,
  totalPrice: PropTypes.number.isRequired,
};

export const view = Checkout;

const mapStateToProps = ({ products: originalProducts, selectedProducts }) => {
  const products = selectedProducts.map(product => {
    const originalProduct = _find(originalProducts, { id: product.id });

    return {
      ...originalProduct,
      ...product,
      price: originalProduct.price * product.quantity,
    };
  });

  const totalPrice = products.reduce((total, { price }) => total + price, 0);

  return { products, totalPrice };
};

export default connect(mapStateToProps)(Checkout);
