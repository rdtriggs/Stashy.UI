export default {
  /* eslint-disable no-param-reassign */
  UPDATE_TICKERS(state, data) {
    data = data || { tickers: [] };
    state.tickers = data.tickers;
  },
  UPDATE_PRICES(state, data) {
    data = data || { prices: [] };
    state.prices = data.prices;
  },
  MODIFY_ASSET(state, data) {
    const index = state.assets.findIndex(e => e.id === data.id);

    if (index === -1) {
      if (Number.isNaN(data.amount) || data.amount === 0) {
        return;
      }

      state.assets.push(data);
    } else {
      if (Number.isNaN(data.amount) || data.amount === 0) {
        state.assets.splice(index, 1);

        return;
      }

      state.assets[index].amount = data.amount;
    }
  },
  LOAD_ASSETS(state, data) {
    state.assets = data;
  },
};
