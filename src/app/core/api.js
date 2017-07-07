import localforage from 'localforage'

const KEY_TICKERS = 'tickers'

export const fetchTickers = () => {
  return localforage.getItem(KEY_TICKERS).then((result) => {
    return result
  }).catch((err) => {
    console.log('An error occurred when trying to fetch tickers', err)
  })
}

export const saveTickers = (tickers) => {
  return localforage.setItem(KEY_TICKERS, tickers).then((value) => {
    return value
  }).catch((err) => {
    console.log('An error occurred when trying to save tickers', err)
  })
}
