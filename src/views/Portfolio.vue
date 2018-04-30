<template>
  <div>
    <b-button size="sm" v-on:click="seedData();">Seed Data</b-button>
    <b-card-group columns>
      <AssetCard v-for="(item, index) in portfolio" v-bind:item="item" v-bind:index="index"
                 v-bind:key="item.id"></AssetCard>
    </b-card-group>
  </div>
</template>

<script>
  import AssetCard from '../components/AssetCard';

  export default {
    name: 'portfolio',
    components: { AssetCard },
    data() {
      return {
        page: {
          title: '$0.00',
          separator: '·',
        },
      };
    },
    head: {
      title() {
        return {
          inner: this.page.title,
          separator: this.page.separator,
        };
      },
    },
    computed: {
      portfolio() {
        return this.$store.state.portfolio.portfolio;
      },
    },
    methods: {
      seedData() {
        this.$store.dispatch('addAsset', { id: 'neo', amount: 5050 });
        this.$store.dispatch('addAsset', { id: 'ethereum', amount: 233 });
        this.$store.dispatch('addAsset', { id: 'omisego', amount: 3772 });
        this.$store.dispatch('addAsset', { id: 'gas', amount: 2008 });
        this.$store.dispatch('addAsset', { id: 'chainlink', amount: 80000 });
        this.$store.dispatch('addAsset', { id: 'maker', amount: 36.82 });
        this.$store.dispatch('addAsset', { id: 'iota', amount: 15903 });
        this.$store.dispatch('addAsset', { id: 'bitcoin', amount: 3.165 });
        this.$store.dispatch('addAsset', { id: 'elastos', amount: 505 });
        this.$store.dispatch('addAsset', { id: 'ontology', amount: 826 });
      },
    },
  };
</script>


<!--
<template>
  <div class="portfolio">
    <div class="row">
      <div class="col-md-4">
        <b-card footer-tag="footer" class="st-card mb-3">
          <h4 class="card-title">Portfolio Value
            <small>{{ currentCurrency.code }}</small>
          </h4>
          <p class="card-text large">{{ portfolioValue.value_formatted }}</p>
          <div slot="footer" style="line-height:32px;">
            {{ portfolio.length }} Assets Tracked
            <b-button size="sm" v-on:click="toggleCurrentCurrency();">
              {{ currentCurrency.code }}
            </b-button>
          </div>
        </b-card>
        <b-card class="st-card-green mb-3">
          <h4 class="card-title">Top Gainers
            <small>by %</small>
          </h4>
          <b-list-group>
            <b-list-group-item v-for="item in topList" :key="item.id">
              <img :src="imageUrl(item.id)" v-bind:alt="item.name" class="rounded-circle align-baseline"
                   style="margin-right: 0.75rem;"/>
              <span class="d-inline-block">{{ item.name }}<br>{{ item.percent }}</span>
            </b-list-group-item>
          </b-list-group>
          <div v-if="topList.length == 0">
            <p class="card-text">Sorry, no gainers today.</p>
          </div>
        </b-card>
      </div>
      <div class="col-md-7 ml-md-auto mb-3">
        <allocation-chart :chart-data="assetAllocationData" :options="assetAllocationOptions"
                          :height="300"></allocation-chart>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <div class="table-wrapper mb-3">
          <div class="table-header d-flex">
            <b-form-input v-model="filter" placeholder="Search" class="mr-3"/>
            <b-button v-b-modal="'addAssetModal'"><i class="fa fa-plus"></i></b-button>
          </div>
          <div class="table-responsive">
            <b-table
              show-empty
              empty-text="No assets found"
              :items="tableItems"
              :fields="tableFields"
              :current-page="currentPage"
              :per-page="perPage"
              :filter="filter"
              :sort-by.sync="sortBy"
              :sort-desc.sync="sortDesc"
              @filtered="onFiltered"
            >
              <template slot="asset" scope="row">
                <img :src="imageUrl(row.item.id)" v-bind:alt="row.value.name"
                     class="rounded-circle d-none d-md-inline align-baseline" style="margin-right: 0.75rem;"/>
                <span class="d-inline-block">{{row.value.name}}<br>{{row.value.symbol}}</span>
              </template>
              <template slot="price" scope="row">{{row.value | formatCurrency}}</template>
              <template slot="amount" scope="row">{{row.value | formatCurrency}}</template>
              <template slot="value" scope="row">{{row.value | formatCurrency}}</template>
              <template slot="percent_change" scope="row">
                <span v-bind:class="colorizePercent(row.value)">{{row.value | formatPercent(true)}}</span>
              </template>
              <template slot="actions" scope="row">
                <div class="text-right">
                  &lt;!&ndash; We use click.stop here to prevent a 'row-clicked' event from also happening &ndash;&gt;
                  <b-button size="sm" @click.stop="editAsset(row.item,row.index,$event.target)">
                    <i class="fa fa-pencil"></i>
                  </b-button>
                </div>
              </template>
            </b-table>
          </div>
        </div>
        <b-pagination :total-rows="portfolio.length" :per-page="perPage" v-model="currentPage" class="mb-1"/>
      </div>
    </div>
    <hr>
    <p>Data provided by <a href="https://coinmarketcap.com/" target="_blank">CoinMarketCap</a></p>
    <b-modal no-close-on-backdrop no-auto-focus id="addAssetModal" title="Add Asset" @ok="submitAddAssetModal"
             @hidden="resetAsset">
      <form @submit.stop.prevent="submit">
        <b-form-fieldset label="Select an asset">
          <multiselect id="assetSelect" v-model="asset.selected" :options="tickerList" :custom-label="customTickerLabel"
                       placeholder="Select an asset" label="asset.name" track-by="id" :maxHeight="225"></multiselect>
        </b-form-fieldset>
        <b-form-fieldset label="Enter your holdings">
          <b-form-input type="text" id="assetAmount" placeholder="e.g. 1.27" v-model="asset.amount"></b-form-input>
        </b-form-fieldset>
      </form>
    </b-modal>
    <b-modal no-close-on-backdrop id="editAssetModal" title="Edit Asset" @ok="submitEditAssetModal"
             @hidden="resetAsset">
      <form @submit.stop.prevent="submit">
        <strong>{{ asset.name }}</strong>
        <b-form-fieldset label="Enter your holdings">
          <b-form-input type="text" id="assetAmount" placeholder="e.g. 1.27" v-model="asset.amount"></b-form-input>
          <small>To remove this asset, enter "0".</small>
        </b-form-fieldset>
      </form>
    </b-modal>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex';
  import Multiselect from 'vue-multiselect';
  import { formatCurrency, formatPercent, validCurrencies } from '../utils';
  import AllocationChart from './charts/AllocationChart';
  import colors from '../colors';

  export default {
    name: 'portfolio',
    components: {
      AllocationChart,
      Multiselect,
    },
    data() {
      return {
        asset: {
          id: null,
          name: null,
          selected: null,
          amount: null,
        },
        currentPage: 1,
        perPage: 10,
        sortBy: 'value',
        sortDesc: true,
        filter: null,
        currentCurrency: validCurrencies.usd,
      };
    },
    methods: {
      toggleCurrentCurrency() {
        switch (this.currentCurrency) {
          case validCurrencies.btc:
            this.currentCurrency = validCurrencies.usd;
            break;
          case validCurrencies.usd:
          default:
            this.currentCurrency = validCurrencies.btc;
            break;
        }
        return true;
      },
      resetAsset() {
        this.asset.id = null;
        this.asset.name = null;
        this.asset.selected = null;
        this.asset.amount = null;
      },
      editAsset(item, index, button) {
        this.asset.id = item.id;
        this.asset.name = item.asset.name;
        this.asset.amount = item.amount;
        this.$root.$emit('bv::show::modal', 'editAssetModal', button);
      },
      submitEditAssetModal(e) {
        if (!this.asset.id || !this.asset.amount) {
          return e.cancel();
        }
        this.modifyAsset({
          id: this.asset.id,
          amount: Number.parseFloat(this.asset.amount.replace(/,/g, '')),
        });
        return true;
      },
      submitAddAssetModal(e) {
        if (!this.asset.selected || !this.asset.amount) {
          return e.cancel();
        }
        this.modifyAsset({
          id: this.asset.selected.id,
          amount: Number.parseFloat(this.asset.amount.replace(/,/g, '')),
        });
        return true;
      },
      customTickerLabel({ asset }) {
        return `${asset.name} — [${asset.symbol}]`;
      },
      ...mapActions([
        'modifyAsset',
      ]),
      onFiltered(filteredItems) {
        // Trigger pagination to update the number of buttons/pages due to filtering
        this.totalRows = filteredItems.length;
        this.currentPage = 1;
      },
      imageUrl(id) {
        return `../static/icons/${id}.png`;
      },
      colorizePercent(value) {
        if (value > 0) {
          return 'text-success';
        } else if (value < 0) {
          return 'text-danger';
        }
        return '';
      },
    },
    filters: {
      formatCurrency(value, symbol = false, format = 'auto') {
        return formatCurrency(value, symbol, format);
      },
      formatPercent(value, symbol = false) {
        return formatPercent(value, symbol);
      },
    },
    computed: {
      topList() {
        const list = [];
        let tmp = Object.assign([], this.portfolio);
        tmp.sort((a, b) => {
          if (a.percent_change > b.percent_change) return -1;
          if (a.percent_change < b.percent_change) return 1;
          return 0;
        });
        tmp = tmp.slice(0, 3);
        for (let i = 0; i < tmp.length; i += 1) {
          if (tmp[i].percent_change > 0) {
            list.push({
              id: tmp[i].id,
              name: tmp[i].asset.name,
              percent: formatPercent(tmp[i].percent_change, true),
            });
          }
        }
        return list;
      },
      tickerList() {
        const list = [];
        const tmp = Object.assign([], this.tickers);
        tmp.sort((a, b) => {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        });
        for (let i = 0; i < tmp.length; i += 1) {
          list.push({
            id: tmp[i].id,
            asset: { name: tmp[i].name, symbol: tmp[i].symbol },
          });
        }
        return list;
      },
      assetAllocationData() {
        const allocations = {
          labels: [],
          datasets: [{
            backgroundColor: [],
            data: [],
          }],
        };
        const otherAllocations = {
          labels: [],
          data: [],
        };
        for (let i = 0; i < this.portfolio.length; i += 1) {
          const percent = (this.portfolio[i].value / this.portfolioValue.value) * 100;
          if (percent > 1) {
            allocations.labels.push(this.portfolio[i].asset.name);
            allocations.datasets[0].backgroundColor.push(colors[i]);
            allocations.datasets[0].data.push(percent.toFixed(2));
          } else {
            otherAllocations.labels.push(this.portfolio[i].asset.name);
            otherAllocations.data.push(percent);
          }
        }
        if (otherAllocations.data.length > 0) {
          let otherPercent = 0;
          allocations.labels.push('Others');
          allocations.datasets[0].backgroundColor.push(colors[this.portfolio.length + 1]);
          for (let i = 0; i < otherAllocations.data.length; i += 1) {
            otherPercent += otherAllocations.data[i];
          }
          allocations.datasets[0].data.push(otherPercent.toFixed(2));
        }
        return allocations;
      },
      assetAllocationOptions() {
        return {
          legend: { position: 'bottom' },
          tooltips: {
            callbacks: {
              label(tooltipItems, data) {
                return `${data.labels[tooltipItems.index]}: ${data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index]}% of portfolio value`;
              },
            },
          },
        };
      },
      portfolioValue() {
        const value = {
          value: 0,
          value_formatted: null,
          usd: 0,
          usd_formatted: null,
          btc: 0,
          btc_formatted: null,
          eth: 0,
          eth_formatted: null,
          ltc: 0,
          ltc_formatted: null,
        };
        for (let i = 0; i < this.portfolio.length; i += 1) {
          value.usd += this.portfolio[i].value_usd;
          value.btc += this.portfolio[i].value_btc;
          value.eth += this.portfolio[i].value_eth;
          value.ltc += this.portfolio[i].value_ltc;
        }

        switch (this.currentCurrency) {
          case validCurrencies.btc:
            value.value = value.btc;
            value.value_formatted = formatCurrency(value.btc);
            break;
          case validCurrencies.usd:
          default:
            value.value = value.usd;
            value.value_formatted = formatCurrency(value.usd);
            break;
        }

        // hack to set title
        document.title = `${value.value_formatted} · Stashy | Private Cryptocurrency Portfolio Manager`;

        value.usd_formatted = formatCurrency(value.usd);
        value.btc_formatted = formatCurrency(value.btc);
        value.eth_formatted = formatCurrency(value.eth);
        value.ltc_formatted = formatCurrency(value.ltc);
        return value;
      },
      tableItems() {
        return this.portfolio;
      },
      tableFields() {
        return {
          asset: {
            label: 'Asset',
            sortable: true,
          },
          price: {
            label: 'Price',
            sortable: true,
            // eslint-disable-next-line quote-props
            'class': 'text-right',
          },
          amount: {
            label: 'Holdings',
            sortable: true,
            // eslint-disable-next-line quote-props
            'class': 'text-right',
          },
          value: {
            label: 'Value',
            sortable: true,
            // eslint-disable-next-line quote-props
            'class': 'text-right',
          },
          percent_change: {
            label: '% Change',
            sortable: true,
            // eslint-disable-next-line quote-props
            'class': 'text-right',
          },
          actions: {
            label: 'Actions',
            // eslint-disable-next-line quote-props
            'class': 'text-right',
          },
        };
      },
      portfolio() {
        const portfolio = [];
        for (let i = 0; i < this.assets.length; i += 1) {
          const ticker = this.tickers.filter(item => item.id === this.assets[i].id);
          const price = this.prices.filter(item => item.id === this.assets[i].id);
          if (ticker.length !== 0 && price.length !== 0) {
            let currencyPrice = 0;
            let currencyValue = 0;
            switch (this.currentCurrency) {
              case validCurrencies.btc:
                currencyPrice = price[0].price_btc;
                currencyValue = price[0].price_btc * this.assets[i].amount;
                break;
              case validCurrencies.usd:
              default:
                currencyPrice = price[0].price_usd;
                currencyValue = price[0].price_usd * this.assets[i].amount;
                break;
            }

            portfolio.push({
              id: ticker[0].id,
              asset: { id: ticker[0].id, name: ticker[0].name, symbol: ticker[0].symbol },
              price: currencyPrice,
              price_usd: price[0].price_usd,
              price_btc: price[0].price_btc,
              price_eth: price[0].price_eth,
              price_ltc: price[0].price_ltc,
              amount: this.assets[i].amount,
              value: currencyValue,
              value_usd: price[0].price_usd * this.assets[i].amount,
              value_btc: price[0].price_btc * this.assets[i].amount,
              value_eth: price[0].price_eth * this.assets[i].amount,
              value_ltc: price[0].price_ltc * this.assets[i].amount,
              percent_change: price[0].percent_change_24h,
            });
          }
        }
        return portfolio;
      },
      ...mapState({
        tickers: state => state.default.tickers,
        prices: state => state.default.prices,
        assets: state => state.default.assets,
      }),
    },
  };
</script>
-->
