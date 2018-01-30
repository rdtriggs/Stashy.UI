import Vue from 'vue';
import moment from 'moment';
import { fetchTickers, fetchPrices, saveTickers, savePrices, fetchAssets, saveAsset, deleteAsset } from '../api';

export const updateTickers = ({ commit }) => {
  Vue.axios.get('https://api.stashy.net/v1/ticker').then((response) => {
    if (!response.data.tickers) {
      return;
    }

    commit('UPDATE_TICKERS', response.data);
    saveTickers(response.data);
  });
};

export const updatePrices = ({ commit }) => {
  Vue.axios.get('https://api.stashy.net/v1/ticker/prices').then((response) => {
    if (!response.data.prices) {
      return;
    }

    commit('UPDATE_PRICES', response.data);
    savePrices(response.data);
  });
};

export const loadTickers = ({ state, commit }) => {
  if (!state.tickers || Object.keys(state.tickers).length === 0) {
    fetchTickers().then((result) => {
      commit('UPDATE_TICKERS', result);
      if (result === null || (result !== null && moment(result.cached).add(1, 'minutes').isBefore(moment()))) {
        updateTickers({ commit });
      }

      return true;
    });
  }

  return false;
};

export const loadPrices = ({ state, commit }) => {
  if (!state.prices || Object.keys(state.prices).length === 0) {
    fetchPrices().then((result) => {
      commit('UPDATE_PRICES', result);
      if (result === null || (result !== null && moment(result.cached).add(1, 'minutes').isBefore(moment()))) {
        updatePrices({ commit });
      }

      return true;
    });
  }

  return false;
};

export const modifyAsset = ({ commit }, asset) => {
  commit('MODIFY_ASSET', asset);
  if (!Number.isNaN(asset.amount) && asset.amount > 0) {
    saveAsset(asset);
  } else {
    deleteAsset(asset);
  }
};

export const loadAssets = ({ state, commit }) => {
  if (!state.assets || Object.keys(state.assets).length === 0) {
    fetchAssets().then((result) => {
      if (result !== null) {
        commit('LOAD_ASSETS', result);
      }
    });
  }
};

