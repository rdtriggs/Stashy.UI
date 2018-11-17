export default {
  refreshPortfolio(tickers, prices, assets) {
    const portfolio = { value: 0, value_usd: 0, value_btc: 0, assets: [] };
    for (let i = 0; i < assets.length; i += 1) {
      const ticker = tickers.filter(item => item.id === assets[i].id);
      const price = prices.filter(item => item.id === assets[i].id);
      if (ticker.length !== 0 && price.length !== 0) {
        // let currencyPrice = 0;
        // let currencyValue = 0;
        // switch (this.currentCurrency) {
        //   case validCurrencies.btc:
        //     currencyPrice = price[0].price_btc;
        //     currencyValue = price[0].price_btc * this.assets[i].amount;
        //     break;
        //   case validCurrencies.usd:
        //   default:
        //     currencyPrice = price[0].price_usd;
        //     currencyValue = price[0].price_usd * this.assets[i].amount;
        //     break;
        // }

        portfolio.value += price[0].current_price * assets[i].amount;

        portfolio.assets.push({
          id: ticker[0].id,
          asset: { id: ticker[0].id, name: ticker[0].name, symbol: ticker[0].symbol },
          // price: currencyPrice,
          price_usd: price[0].current_price,
          amount: assets[i].amount,
          // value: currencyValue,
          value_usd: price[0].current_price * assets[i].amount,
          percent_change: price[0].percent_change,
        });
      }
    }
    return portfolio;
  },
};
