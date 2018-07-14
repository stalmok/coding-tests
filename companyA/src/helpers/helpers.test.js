import { handleCurrencyApiErrors } from './index';

describe('handleCurrencyApiErrors', () => {
  it('throws new error if the response is not successful', () => {
    expect(() => {
      handleCurrencyApiErrors({ success: false, error: { info: 'test' } });
    }).toThrowError('test');
  });

  it('returns original response if response was successful', () => {
    const response = { success: true };

    expect(handleCurrencyApiErrors(response)).toEqual(response);
  });
});
