import localforage from 'localforage';
import Vue from 'vue';

const KEY_TICKERS = 'tickers';
const KEY_PRICES = 'prices';
const NAMESPACE_ASSET = 'ASSET-';

/*
export const fetchTickers = () => localforage.getItem(KEY_TICKERS).then(result => result);

export const fetchPrices = () => localforage.getItem(KEY_PRICES).then(result => result);

export const saveTickers = tickers =>
  localforage.setItem(KEY_TICKERS, tickers).then(value => value);

export const savePrices = tickers => localforage.setItem(KEY_PRICES, tickers).then(value => value);

export const fetchPortfolioAssets = () => localforage.startsWith(NAMESPACE_ASSET).then((result) => {
  const assets = [];
  if (result !== null) {
    Object.keys(result).forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(result, key)) {
        assets.push(result[key]);
      }
    });
  }
  return assets;
});

export const saveAsset = asset => localforage.setItem(NAMESPACE_ASSET + asset.id, asset)
  .then(value => value);

export const deleteAsset = asset => localforage.removeItem(NAMESPACE_ASSET + asset.id);
*/

// persist tickers to local storage
const saveTickers = tickers => localforage.setItem(KEY_TICKERS, tickers).then(value => value);

// persist prices to local storage
const savePrices = prices => localforage.setItem(KEY_PRICES, prices).then(value => value);

export default {
  fetchTickers() {
    return localforage.getItem(KEY_TICKERS).then(result => result);
  },
  refreshTickers() {
    return Vue.axios.get('https://api.stashy.net/v1/ticker').then((response) => {
      if (!response.data.tickers) {
        return;
      }
      saveTickers(response.data);
    });
  },
  fetchPrices() {
    return localforage.getItem(KEY_PRICES).then(result => result);
  },
  refreshPrices() {
    return Vue.axios.get('https://api.stashy.net/v1/ticker/prices').then((response) => {
      if (!response.data.prices) {
        return;
      }
      savePrices(response.data);
    });
  },
  fetchPortfolioAssets() {
    return localforage.startsWith(NAMESPACE_ASSET).then((result) => {
      const assets = [];
      if (result !== null) {
        Object.keys(result).forEach((key) => {
          if (Object.prototype.hasOwnProperty.call(result, key)) {
            assets.push(result[key]);
          }
        });
      }
      return assets;
    });
  },
};
