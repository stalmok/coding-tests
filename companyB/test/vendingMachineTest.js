/* global beforeEach, describe, it */

import chai from 'chai'
import spies from 'chai-spies'
import VendingMachine from '../src/VendingMachine'

chai.use(spies)

const {expect} = chai

const products = [
  {name: 'Snickers', price: 100, amount: 5},
  {name: 'Bounty', price: 120, amount: 0},
  {name: 'Milky Way', price: 199, amount: 1}
]

export const coins = [
  {value: 2, amount: 10},
  {value: 1, amount: 5},
  {value: 5, amount: 10},
  {value: 10, amount: 10},
  {value: 20, amount: 10},
  {value: 50, amount: 10},
  {value: 100, amount: 2},
  {value: 200, amount: 1}
]

const hardware = {
  dispenseProduct (product) {},
  dispenseMoney (money) {}
}

const automat = new VendingMachine(hardware, products, coins)

describe('Vending Machine', () => {
  beforeEach(() => {
    automat.reload(products, coins)
    automat._reset()
  })

  describe('reload()', () => {
    it('should replace old products with the new ones', () => {
      const newProducts = [{name: 'Snickers', price: 100, amount: 5}]
      automat.reload(newProducts, coins)

      expect(newProducts).to.deep.equal(automat.getProducts())
    })

    it('should replace old coins with the new ones', () => {
      const newCoins = [{value: 1, amount: 1}]
      automat.reload(products, newCoins)

      expect(newCoins).to.deep.equal(automat.getCoins())
    })
  })

  describe('getProducts()', () => {
    it('should return an array of all loaded products', () => {
      expect(products).to.deep.equal(automat.getProducts())
    })
  })

  describe('getCoins()', () => {
    it('should return an array of all loaded coins', () => {
      expect(coins).to.deep.equal(automat.getCoins())
    })
  })

  describe('selectProduct()', () => {
    it('should throw if trying to select non existing product', () => {
      expect(automat.selectProduct.bind(automat, 'Non existing Product'))
        .to.throw('This product does not exist')
    })

    it('should throw if product is not available', () => {
      expect(automat.selectProduct.bind(automat, 'Bounty'))
        .to.throw('This product is not available at the moment')
    })
  })

  describe('amountLeftToPay()', () => {
    it('should return the difference between the product price and already paid amount', () => {
      automat.selectProduct('Snickers')
      automat.pay(10)

      expect(automat.amountLeftToPay()).to.deep.equal(90)
    })
  })

  describe('pay()', () => {
    it('should deduct paid amount from total price', () => {
      automat.selectProduct('Snickers')
      automat.pay(10)

      expect(automat.amountLeftToPay()).to.equal(90)
    })

    it('should return money if trying to pay without selecting the product first', () => {
      const spy = chai.spy.on(automat, '_returnMoney')

      automat.pay(10)

      expect(spy).to.have.been.called.with(10)
    })

    it('should return true if paid in full', () => {
      automat.selectProduct('Snickers')

      expect(automat.pay(100)).to.be.true
    })

    it('should keep the product amount info updated', () => {
      automat.selectProduct('Snickers')

      automat.pay(100)

      expect(automat.getProducts()[0].amount).to.equal(products[0].amount - 1)
    })

    it('should throw if given coin is not valid', () => {
      automat.selectProduct('Snickers')

      expect(automat.pay.bind(automat, 3)).to.throw('Unrecognizable money')
    })

    it('should throw if machine will not have enough money to return', () => {
      automat.reload([
        {name: 'Flying Car', price: 5, amount: 1}
      ], [
        {value: 1, amount: 1}
      ])

      automat.selectProduct('Flying Car')

      expect(automat.pay.bind(automat, 200)).to.throw('Insufficient funds')
    })

    // or maybe it's better to sell it and give more change than needed?
    it('should throw if machine will not have the right amount of change to return', () => {
      automat.reload([
        {name: 'Flying Car', price: 199, amount: 1}
      ], [
        {value: 1, amount: 0},
        {value: 2, amount: 1}
      ])

      automat.selectProduct('Flying Car')

      // pay 200, machine doesn't have 1's for a change, but enough funds in total
      expect(automat.pay.bind(automat, 200)).to.throw('The change is not available')
    })
  })

  describe('cancel()', () => {
    it('should return money and reset state', () => {
      const spy = chai.spy.on(automat, '_returnMoney')

      automat.selectProduct('Snickers')
      automat.pay(10)
      automat.cancel()

      expect(spy).to.have.been.called.with(10)
      expect(automat._selectedProduct).to.be.null
      expect(automat._amountPaid).to.equal(0)
    })
  })

  // ================================================================================================
  // Private methods
  describe('_returnPaidAmount()', () => {
    it('should return all the paid money', () => {
      const spy = chai.spy.on(automat, '_returnMoney')

      automat.selectProduct('Snickers')
      automat.pay(10)
      automat._returnPaidAmount()

      expect(spy).to.have.been.called.with(10)
    })
  })

  describe('_returnChange()', () => {
    it('should return pending change', () => {
      const spy = chai.spy.on(automat, '_returnMoney')

      automat.selectProduct('Snickers')
      automat._amountPaid = 110
      automat._returnChange()

      expect(spy).to.have.been.called.with(10)
    })
  })

  describe('_returnProduct()', () => {
    it('should use `hardware` to return currently selected product', () => {
      const spy = chai.spy.on(automat._hardware, 'dispenseProduct')

      automat.selectProduct('Snickers')
      automat._returnProduct()

      expect(spy).to.have.been.called.with(automat._selectedProduct)
    })
  })

  describe('_returnMoney()', () => {
    it('should use `hardware` to return given amount of money in coins', () => {
      const spy = chai.spy.on(automat._hardware, 'dispenseMoney')

      automat._returnMoney(100)

      expect(spy).to.have.been.called.with([{value: 100, amount: 1}])
    })

    it('should throw if no amount is given', () => {
      expect(automat._returnMoney.bind(automat)).to.throw('Missing parameter: amount')
    })
  })

  describe('_isPaidInFull()', () => {
    it('should return true if the product is paid in full', () => {
      automat.selectProduct('Snickers')
      automat._amountPaid = 100

      expect(automat._isPaidInFull()).to.be.true
    })

    it('should return false if the product is not paid in full', () => {
      automat.selectProduct('Snickers')
      automat.pay(50)

      expect(automat._isPaidInFull()).to.be.false
    })
  })

  describe('_pendingChange()', () => {
    it('should return correct amount of money to be returned to the buyer', () => {
      automat.selectProduct('Snickers')
      automat._amountPaid = 110

      expect(automat._pendingChange()).to.equal(10)
    })
  })

  describe('_isProductSelected()', () => {
    it('should return true if product is selected', () => {
      automat.selectProduct('Snickers')

      expect(automat._isProductSelected()).to.be.true
    })

    it('should return false if product is not selected', () => {
      expect(automat._isProductSelected()).to.be.false
    })
  })

  describe('_reduceProductAmount()', () => {
    it('should reduce by one the amount of currently selected product', () => {
      automat.selectProduct('Snickers')
      automat._reduceProductAmount()

      expect(automat.getProducts()[0].amount).to.equal(4)
    })
  })

  describe('_reduceCoinAmount()', () => {
    it('should reduce the amount of coins of given value by given amount', () => {
      automat._reduceCoinAmount(2, 10)

      expect(automat.getCoins()[0].amount).to.equal(0)
    })
  })

  describe('_chooseCoins()', () => {
    it('should convert correctly prefering higher value coins', () => {
      expect(automat._chooseCoins(1)).to.deep.equal([{value: 1, amount: 1}])
      expect(automat._chooseCoins(2)).to.deep.equal([{value: 2, amount: 1}])
      expect(automat._chooseCoins(3)).to.deep.equal([{value: 2, amount: 1}, {value: 1, amount: 1}])
      expect(automat._chooseCoins(101)).to.deep.equal([{value: 100, amount: 1}, {value: 1, amount: 1}])
      expect(automat._chooseCoins(13)).to.deep.equal([
        {value: 10, amount: 1}, {value: 2, amount: 1}, {value: 1, amount: 1}
      ])
    })

    it('should convert correctly when higher value coins are missing', () => {
      expect(automat._chooseCoins(401)).to.deep.equal([
        {value: 200, amount: 1}, {value: 100, amount: 2}, {value: 1, amount: 1}
      ])
    })

    it('should keep the coin amounts updated', () => {
      // return both 100s
      for (let i = 0; i < 2; i++) {
        automat.selectProduct('Snickers')
        automat.pay(200)
      }

      automat.selectProduct('Snickers')

      expect(automat._chooseCoins(100)).to.deep.equal([{value: 50, amount: 2}])
    })
  })

  describe('_isThereEnoughFunds()', () => {
    it('should return true if automat has enough money', () => {
      expect(automat._isThereEnoughFunds(10)).to.be.true
    })

    it('should return false if automat does not have enough money', () => {
      expect(automat._isThereEnoughFunds(10000)).to.be.false
    })
  })

  describe('_canGiveChange()', () => {
    it('should return true if automat can give change', () => {
      automat.reload(products, [{value: 1, amount: 1}])

      expect(automat._canGiveChange(1)).to.be.true
    })

    it('should return false if automat can not give change', () => {
      automat.reload(products, [{value: 1, amount: 0}])

      expect(automat._canGiveChange(1)).to.be.false
    })
  })
})
