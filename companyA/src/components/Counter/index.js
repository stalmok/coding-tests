import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './counter.css'

class Counter extends Component {
  constructor(props) {
    super(props)

    this.decrease = this.decrease.bind(this)
    this.increase = this.increase.bind(this)
  }

  decrease() {
    const { onChange, counter } = this.props

    if (counter < 1) return

    onChange(counter - 1)
  }

  increase() {
    this.props.onChange(this.props.counter + 1)
  }

  render() {
    return (
      <span>
        <button
          className="decrease"
          onClick={this.decrease}
          aria-label="remove one product from the basket"
        >
          -
        </button>
        <span className="counter">{this.props.counter}</span>
        <button
          className="increase"
          onClick={this.increase}
          aria-label="add one product to the basket"
        >
          +
        </button>
      </span>
    )
  }
}

Counter.defaultProps = {
  counter: 0,
}

Counter.propTypes = {
  counter: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default Counter
