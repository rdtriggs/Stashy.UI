import localforage from 'localforage';
import Vue from 'vue';

const KEY_TICKERS = 'tickers';
const KEY_PRICES = 'prices';
const NAMESPACE_ASSETS = 'assets';

// persist tickers to local storage
const saveTickers = tickers => localforage.setItem(KEY_TICKERS, tickers).then(value => value);

// persist prices to local storage
const savePrices = prices => localforage.setItem(KEY_PRICES, prices).then(value => value);

// persist assets to local storage
const saveAssets = (portfolio, assets) => localforage.setItem(`${NAMESPACE_ASSETS}-${portfolio}`, assets).then(value => value);

export default {
  fetchTickers() {
    return localforage.getItem(KEY_TICKERS).then(result => result);
  },
  refreshTickers() {
    return Vue.axios.get('https://api.stashy.net/v2/coin').then((response) => {
      saveTickers(response.data);
    });
  },
  fetchPrices() {
    return localforage.getItem(KEY_PRICES).then(result => result);
  },
  refreshPrices() {
    return Vue.axios.get('https://api.stashy.net/v2/price').then((response) => {
      savePrices(response.data);
    });
  },
  fetchAssets(portfolio) {
    return localforage.getItem(`${NAMESPACE_ASSETS}-${portfolio}`).then(result => result);
  },
  saveAssets(portfolio, assets) {
    saveAssets(portfolio, assets);
  },
};
