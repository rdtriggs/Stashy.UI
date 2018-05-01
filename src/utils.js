import numeral from 'numeral';

export const formatCurrency = (value, symbol = false, format = 'auto') => {
  let template = '';

  switch (format) {
    case 'auto':
      if (value >= 100000) {
        template = '0,0';
      } else if (value >= 10000) {
        template = '0,0[.][00]';
      } else if (value >= 0.001) {
        template = '0,0[.][000]';
      } else if (value >= 0.00001) {
        template = '0,0.000[000]';
      } else {
        template = '0,0.000[00000]';
      }
      break;
    case 'fiat':
      template = '0,0.00';
      break;
    case 'standard':
      template = '0,0.000';
      break;
    case 'long':
      template = '0,0[.][00000000]';
      break;
    case 'short':
      template = '0,0[.][000]';
      break;
    default:
      // send to numeral as-is
      break;
  }

  if (symbol === true) {
    template = `$ ${template}`;
  }

  let ret = numeral(value).format(template);

  // fix for incorrect stringification of a number
  if (ret === 'NaN') {
    ret = symbol === true ? '$ ' : '';

    if (value < 0.0000001) {
      ret += `0.0000000${(value * 100000000).toFixed(0)}`;
    } else {
      ret = '0.00000001';
    }
  }

  return ret;
};

export const formatPercent = (value, symbol = false) => {
  const format = '0,0.00';
  let ret = numeral(value).format(format);

  // fix for incorrect stringification of a number
  if (ret === 'NaN') {
    ret = numeral(0).format(format);
  }

  if (symbol === true) {
    ret = `${ret}%`;
  }

  return ret;
};

export const validCurrencies = {
  usd: {
    name: 'Dollar',
    code: 'USD',
    symbol: '$',
  },
  btc: {
    name: 'Bitcoin',
    code: 'BTC',
    symbol: '₿',
  },
  eth: {
    name: 'Ethereum',
    code: 'ETH',
    symbol: 'Ξ',
  },
};
