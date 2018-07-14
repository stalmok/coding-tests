import accounting from 'accounting'

import {currencySymbol} from './config'

// vending machine is currency agnostic
// so we need to deal with ourselves
accounting.settings.currency.symbol = currencySymbol

export const formatMoney = centum => {
  return accounting.formatMoney(centum / 100)
}
