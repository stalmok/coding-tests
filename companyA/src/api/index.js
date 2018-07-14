import { handleCurrencyApiErrors } from '../helpers';
import { currenciesListURL, currencyLiveURL } from '../config';

// let's not assume where the data may be coming from
// and abstract the retrieval here
export function fetchProducts() {
  return [
    { id: 1, name: 'Peas', price: 0.95, units: 'bag' },
    { id: 2, name: 'Eggs', price: 2.1, units: 'dozen' },
    { id: 3, name: 'Milk', price: 1.3, units: 'bottle' },
    { id: 4, name: 'Beans', price: 0.73, units: 'can' },
  ];
}

export function fetchCurrencies() {
  // NOTE: ideally we would want to cache this list
  return fetch(currenciesListURL)
    .then(response => response.json())
    .then(handleCurrencyApiErrors)
    .then(({ currencies }) => currencies);
}

export function convertCurrency(amount, currency) {
  return fetch(currencyLiveURL(currency))
    .then(response => response.json())
    .then(handleCurrencyApiErrors)
    .then(({ quotes }) => quotes[`USD${currency}`] * amount);
}
