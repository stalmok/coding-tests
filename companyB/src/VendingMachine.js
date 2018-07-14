import {VALID_COINS} from './config'

const mandatory = name => {
  throw new Error(`Missing parameter: ${name}`)
}

export default class {

  /**
   * @param {Object} hardware
   * @param {array=[]} products
   * @param {array=[]} coins
   */
  constructor (hardware, products = [], coins = []) {
    this._hardware = hardware
    this._selectedProduct = null
    this._amountPaid = 0

    this.reload(products, coins)
  }

  /**
   * Load products and coins
   *
   * @param {array} products
   * @param {array} coins
   */
  reload (products, coins) {
    this._products = new Map()
    this._coins = new Map()

    // make shallow copies to make sure we're in control of the state
    products.forEach(p => this._products.set(p.name, Object.assign({}, p)))
    coins.forEach(c => this._coins.set(c.value, Object.assign({}, c)))
  }

  /**
   * Return all loaded products
   *
   * @return {array}
   */
  getProducts () {
    return Array.from(this._products.values())
  }

  /**
   * Return all loaded coins
   *
   * @return {array}
   */
  getCoins () {
    return Array.from(this._coins.values())
  }

  /**
   * Select the product
   *
   * @param {string} name Product name
   */
  selectProduct (name) {
    if (!this._products.has(name)) {
      throw new Error('This product does not exist')
    }

    const product = this._products.get(name)

    if (product.amount <= 0) {
      throw new Error('This product is not available at the moment')
    }

    this._selectedProduct = product
  }

  /**
   * Pay for the product.
   * Allowed values: 1, 2, 5, 10, 20, 50, 100, 200
   *
   * @param {int} [amount=0] Change in cents
   * @return {boolean} amount left to pay
   */
  pay (amount = 0) {
    if (!VALID_COINS.includes(amount)) {
      throw new Error('Unrecognizable money')
    }

    // trying to pay without selecting the product first
    if (!this._isProductSelected()) {
      this._returnMoney(amount)
      this._reset()
      return
    }

    this._amountPaid += amount

    if (this._isPaidInFull()) {
      if (!this._isThereEnoughFunds(this._pendingChange())) {
        throw new Error('Insufficient funds')
      }

      if (!this._canGiveChange(this._pendingChange())) {
        throw new Error('The change is not available')
      }

      this._returnProduct()
      this._reduceProductAmount()
      this._returnChange()
      this._reset()

      return true
    }

    return false
  }

  /**
   * Amount left to pay
   *
   * @return {int}
   */
  amountLeftToPay () {
    return this._selectedProduct.price - this._amountPaid
  }

  /**
   * Cancel the purchase
   */
  cancel () {
    this._returnMoney(this._amountPaid)
    this._reset()
  }

  /**
   * Reset state
   */
  _reset () {
    this._selectedProduct = null
    this._amountPaid = 0
  }

  /**
   * Return paid amount to the buyer
   */
  _returnPaidAmount () {
    this._returnMoney(this._amountPaid)
  }

  /**
   * Return overpaid money
   */
  _returnChange () {
    this._returnMoney(this._pendingChange())
  }

  /**
   * Return product to the buyer
   */
  _returnProduct () {
    this._hardware.dispenseProduct(this._selectedProduct)
  }

  /**
   * Dispense money from vending machine
   *
   * @param {int} amount
   */
  _returnMoney (amount = mandatory('amount')) {
    if (amount <= 0) return

    const coins = this._chooseCoins(amount)

    this._hardware.dispenseMoney(coins)
  }

  /**
   * Determines if the product is fully paid
   */
  _isPaidInFull () {
    return this.amountLeftToPay() <= 0
  }

  /**
   * Returns the amount of money we need to return to the buyer
   */
  _pendingChange () {
    return this._isPaidInFull() ? -this.amountLeftToPay() : 0
  }

  /**
   * Tells if any product is currently selected
   */
  _isProductSelected () {
    return this._selectedProduct !== null
  }

  /**
   * Reduce the amount of available products (currently selected) by one
   */
  _reduceProductAmount () {
    const product = this._products.get(this._selectedProduct.name)
    product.amount--
  }

  /**
   * Reduce the amount of available products (currently selected) by one
   */
  _reduceCoinAmount (value, amount = 1) {
    const coin = this._coins.get(value)
    coin.amount -= amount
  }

  /**
   * Convert full amount to the array of coins that match that amount
   * Prefer larger value coins
   * Ex.: 100 => [{value: 100, amount: 1}], 104 => [{value: 100: amount: 1, value: 2, amount: 2}]
   */
  _chooseCoins (amount = mandatory('amount')) {
    let result = []

    // sort by biggest value - that's where we want to start
    const availableCoins = Array.from(this._coins.values()).sort((a, b) => b.value - a.value)

    for (const coin of availableCoins) {
      if (coin.amount <= 0) continue

      if (amount === coin.value) {
        // coin matches the amount we need, we're done
        result.push({value: coin.value, amount: 1})

        this._reduceCoinAmount(coin.value)

        break
      } else if (amount > coin.value) {
        // found the first highest value coin that is lower than the amount

        // determine the right amount
        let needed = Math.floor(amount / coin.value)

        // use all coins if there aren't enough
        if (needed > coin.amount) {
          needed = coin.amount
        }

        result.push({value: coin.value, amount: needed})

        this._reduceCoinAmount(coin.value, needed)

        amount -= coin.value * needed
      }
    }

    return result
  }

  /**
   * Determines if there are enough funds to pay off the amount
   */
  _isThereEnoughFunds (amount) {
    const coins = Array.from(this._coins.values())
    const availableFunds = coins.reduce((previous, coin) => previous + coin.value * coin.amount, 0)

    return availableFunds >= amount
  }

  /**
   * Determines if there is the right amount of coins to return
   */
  _canGiveChange (amount) {
    const totalChange = this._chooseCoins(amount)
      .reduce((previous, coin) => previous + coin.value * coin.amount, 0)

    return totalChange === amount
  }
}
