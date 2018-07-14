import inquirer from 'inquirer'
import chalk from 'chalk'

import VendingMachine from './VendingMachine'
import {formatMoney} from './helpers'
import {products, coins, VALID_COINS} from './config'

// mocked hardware API to be injected in to vending machine
const hardware = {
  dispenseProduct (product) {
    console.log(chalk.green(`dispensing product: ${product.name}`))
  },
  dispenseMoney (money) {
    money = money.map(m => `${m.amount}x${formatMoney(m.value)}`).join(', ')
    console.log(chalk.green(`dispensing money: ${money}`))
  }
}
const automat = new VendingMachine(hardware, products, coins)

const cancelOption = {value: 'cancel', name: 'Cancel'}

const handleProductSelection = answers => {
  if (answers.product === 'cancel') {
    automat.cancel()
    return
  }

  automat.selectProduct(answers.product)
  askToPay()
}

const handleProductError = error => {
  console.error(chalk.red(error.message))
  askToPickProduct()
}

const handlePaymentSelection = answers => {
  if (answers.change === 'cancel') {
    automat.cancel()
    return
  }

  if (automat.pay(+answers.change)) {
    console.log('Thank you!')
    askToPickProduct()
  } else {
    askToPay()
  }
}

const handlePaymentError = error => {
  console.error(chalk.red(error.message))
  askToPay()
}

const askToPickProduct = () => {
  let choices = automat.getProducts().map(product => {
    const unavailableMessage = product.amount === 0 ? '(Unavailable at this time)' : ''

    return {
      value: product.name,
      name: `${product.name} (${formatMoney(product.price)}) ${unavailableMessage}`
    }
  })

  choices.push(new inquirer.Separator())
  choices.push(cancelOption)

  inquirer.prompt([{
    type: 'rawlist',
    name: 'product',
    message: 'Please choose the product',
    choices: choices
  }])
  .then(handleProductSelection)
  .catch(handleProductError)
}

const askToPay = () => {
  let choices = VALID_COINS.map(value => {
    const name = formatMoney(value)
    return {value, name}
  })

  choices.push(new inquirer.Separator())
  choices.push(cancelOption)

  const toPay = formatMoney(automat.amountLeftToPay())

  inquirer.prompt([{
    type: 'list',
    name: 'change',
    message: `Please insert the coins. There is ${toPay} left to pay`,
    choices: choices
  }])
  .then(handlePaymentSelection)
  .catch(handlePaymentError)
}

askToPickProduct()
