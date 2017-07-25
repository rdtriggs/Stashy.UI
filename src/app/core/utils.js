import numeral from 'numeral'

export const formatCurrency = (value, format = 'determinant', symbol = false) => {
  switch (format) {
    case 'determinant':
      if (value >= 100000) {
        format = '0,0'
      }
      else if (value >= 10000) {
        format = '0,0[.][00]'
      }
      else if (value >= 0.001) {
        format = '0,0[.][000]'
      }
      else if (value >= 0.00001) {
        format = '0,0.000[000]'
      }
      else {
        format = '0,0.000[00000]'
      }
      break
    case 'standard':
      format = '0,0.000'
      break
    case 'long':
      format = '0,0[.][00000000]'
      break
    case 'short':
      format = '0,0[.][000]'
      break
    default:
      // send to numeral as-is
      break
  }

  if (symbol === true) {
    format = '$ ' + format
  }

  let ret = numeral(value).format(format)

  // fix for incorrect stringification of a number
  if (ret === 'NaN') {
    ret = symbol === true ? '$ ' : ''

    if (value < 0.0000001) {
      ret += '0.0000000' + (value * 100000000).toFixed(0)
    }
    else {
      ret = '0.00000001'
    }
  }

  return ret
}

export const formatPercent = (value, symbol = false) => {
  let format = '0,0.00'

  let ret = numeral(value).format(format)

  // fix for incorrect stringification of a number
  if (ret === 'NaN') {
    ret = numeral(0).format(format)
  }

  if (symbol === true) {
    ret = ret + '%'
  }

  return ret
}
