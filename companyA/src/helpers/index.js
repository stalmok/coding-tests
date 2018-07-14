// https://currencylayer.com/documentation#error_codes
export function handleCurrencyApiErrors(response) {
  if (!response.success) {
    // NOTE: // it should be sent to some logging service as well
    throw new Error(response.error.info);
  }

  // make sure to forward the response down the
  // promise chain if there was no error
  return response;
}
