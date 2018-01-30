export default {
  refreshPortfolio(tickers, prices, assets) {
    const portfolio = [];
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

        portfolio.push({
          id: ticker[0].id,
          asset: { id: ticker[0].id, name: ticker[0].name, symbol: ticker[0].symbol },
          // price: currencyPrice,
          price_usd: price[0].price_usd,
          price_btc: price[0].price_btc,
          price_eth: price[0].price_eth,
          price_ltc: price[0].price_ltc,
          amount: assets[i].amount,
          // value: currencyValue,
          value_usd: price[0].price_usd * assets[i].amount,
          value_btc: price[0].price_btc * assets[i].amount,
          value_eth: price[0].price_eth * assets[i].amount,
          value_ltc: price[0].price_ltc * assets[i].amount,
          percent_change: price[0].percent_change_24h,
        });
      }
    }
    return portfolio;
  },
};
