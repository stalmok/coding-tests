export const defaultCurrency = 'USD';

// NOTE: requests to this API endpoint should be proxied
// through the back-end to keep the credentials private
export const apiLayerKey = 'f6ad7c9462e051965ee2d36bb26abe42';

export const currenciesListURL = `http://apilayer.net/api/list?access_key=${apiLayerKey}`;

export const currencyLiveURL = toCurrency =>
  `http://apilayer.net/api/live?currencies=${toCurrency}&access_key=${apiLayerKey}`;
