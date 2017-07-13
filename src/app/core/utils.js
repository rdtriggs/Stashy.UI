import numeral from 'numeral'

export const formatLongCurrency = (value, showSymbol) => {
  let format = '0,0[.][00000000]'

  if (showSymbol !== undefined && showSymbol === true) {
    format = '$ ' + format
  }

  return numeral(value).format(format)
}

export const formatStandardCurrency = (value, showSymbol) => {
  let format = '0,0.00'

  if (showSymbol !== undefined && showSymbol === true) {
    format = '$ ' + format
  }

  return numeral(value).format(format)
}

export const formatShortCurrency = (value, showSymbol) => {
  let format = '0,0'

  if (showSymbol !== undefined && showSymbol === true) {
    format = '$ ' + format
  }

  return numeral(value).format(format)
}
