// eslint-disable-next-line max-len
/* eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor": ["state"] }] */
/* eslint no-shadow: ["error", { "allow": ["state"] }] */
import moment from 'moment';
import stashy from '../../api/stashy';
import * as types from '../mutation-types';
import helpers from '../mutation-helpers';

// initial state
const state = {
  tickers: [],
  prices: [],
  portfolio: [],
  portfolioAssets: [],
  watchlist: [],
  watchlistAssets: [],
};

// getters
const getters = {
  tickers: () => state.tickers,
  prices: () => state.prices,
  portfolio: () => state.portfolio,
  watchlist: () => state.watchlist,
};

// actions
const actions = {
  updateTickers({ commit }) {
    stashy.refreshTickers().then(() => {
      stashy.fetchTickers().then((result) => {
        commit(types.LOAD_TICKERS, result.tickers);
      });
    });
  },
  updatePrices({ commit }) {
    stashy.refreshPrices().then(() => {
      stashy.fetchPrices().then((result) => {
        commit(types.LOAD_PRICES, result.prices);
      });
    });
  },
  loadPortfolio({ dispatch, commit, state }) {
    // eslint-disable-next-line max-len
    Promise.all([stashy.fetchTickers(), stashy.fetchPrices(), stashy.fetchPortfolioAssets()]).then((results) => {
      const tickersResult = results[0];
      commit(types.LOAD_TICKERS, tickersResult !== null ? tickersResult.tickers : [] || []);
      if (tickersResult === null || (tickersResult !== null && moment(tickersResult.cached).add(1, 'minutes').isBefore(moment()))) {
        dispatch('updateTickers');
      }

      const pricesResult = results[1];
      commit(types.LOAD_PRICES, pricesResult !== null ? pricesResult.prices : [] || []);
      if (pricesResult === null || (pricesResult !== null && moment(pricesResult.cached).add(1, 'minutes').isBefore(moment()))) {
        dispatch('updatePrices');
      }

      const assetsResult = results[2];
      commit(types.LOAD_PORTFOLIO_ASSETS, assetsResult || []);
    }).finally(() => {
      // eslint-disable-next-line max-len
      const portfolio = helpers.refreshPortfolio(state.tickers, state.prices, state.portfolioAssets);
      commit(types.LOAD_PORTFOLIO, portfolio || []);
    });
  },
};

// mutations
const mutations = {
  [types.LOAD_PORTFOLIO](state, portfolio) {
    state.portfolio = portfolio;
  },
  [types.LOAD_TICKERS](state, tickers) {
    state.tickers = tickers;
  },
  [types.LOAD_PRICES](state, prices) {
    state.prices = prices;
  },
  [types.LOAD_PORTFOLIO_ASSETS](state, assets) {
    state.portfolioAssets = assets;
  },
  [types.ADD_PORTFOLIO_ASSET](state, asset) {
    const index = state.portfolioAssets.findIndex(e => e.id === asset.id);
    if (index === -1) {
      if (!Number.isNaN(asset.amount) && asset.amount > 0) {
        state.portfolioAssets.push(asset);
      }
    }
  },
  [types.UPDATE_PORTFOLIO_ASSET](state, asset) {
    const index = state.portfolioAssets.findIndex(e => e.id === asset.id);
    if (index !== -1) {
      state.portfolioAssets[index].amount = asset.amount;
    }
  },
  [types.REMOVE_PORTFOLIO_ASSET](state, asset) {
    const index = state.portfolioAssets.findIndex(e => e.id === asset.id);
    if (index !== -1) {
      state.portfolioAssets.splice(index, 1);
    }
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
