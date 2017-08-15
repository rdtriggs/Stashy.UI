import localforage from 'localforage';

const KEY_TICKERS = 'tickers';
const KEY_PRICES = 'prices';
const NAMESPACE_ASSET = 'ASSET-';

export const fetchTickers = () => localforage.getItem(KEY_TICKERS).then(result => result);

export const fetchPrices = () => localforage.getItem(KEY_PRICES).then(result => result);

export const saveTickers = tickers =>
  localforage.setItem(KEY_TICKERS, tickers).then(value => value);

export const savePrices = tickers => localforage.setItem(KEY_PRICES, tickers).then(value => value);

export const fetchAssets = () => localforage.startsWith(NAMESPACE_ASSET).then((result) => {
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
