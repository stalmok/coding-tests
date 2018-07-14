import fetch from 'jest-fetch-mock';

import * as api from './index';

global.fetch = fetch;

describe('fetchCurrencies', () => {
  it('returns correct object of currencies', () => {
    const responseCurrencies = {
      AED: 'United Arab Emirates Dirham',
      AFN: 'Afghan Afghani',
    };

    fetch.mockResponseOnce(
      JSON.stringify({
        success: true,
        currencies: responseCurrencies,
      })
    );

    api.fetchCurrencies().then(currencies => {
      expect(currencies).toEqual(responseCurrencies);
    });
  });
});

describe('convertCurrency', () => {
  it('returns converted price', () => {
    const rate = 0.78249;

    fetch.mockResponseOnce(
      JSON.stringify({
        success: true,
        quotes: {
          USDGBP: rate,
        },
      })
    );

    // convert 1 USD to GBP
    api.convertCurrency(1, 'GBP').then(price => {
      expect(price).toBe(0.78249);
    });
  });
});
