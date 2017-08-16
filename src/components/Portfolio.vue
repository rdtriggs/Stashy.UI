<template>
  <div class="portfolio">
    <div class="row">
      <div class="col-md-4">
        <b-card title="Portfolio Value" footer-tag="footer" class="st-card mb-3">
          <p class="card-text large">{{ portfolioValue.usd_formatted }}</p>
          <div slot="footer">{{ portfolio.length }} Assets Tracked</div>
        </b-card>
        <b-card title="Top Gainers" class="st-card-green mb-sm-3">
          <b-list-group>
            <b-list-group-item v-for="item in topList" :key="item.id">
              {{ item.name }}
              <br>{{ item.percent }}
            </b-list-group-item>
          </b-list-group>
          <div v-if="topList.length == 0">
            <p class="card-text">Sorry, no tracked assets.</p>
          </div>
        </b-card>
      </div>
      <div class="col-md-7 push-md-1">
        <allocation-chart :chart-data="assetAllocationData" :options="assetAllocationOptions"
                          :height="300"></allocation-chart>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <div class="table-wrapper mb-3">
          <div class="table-header d-flex">
            <b-form-input v-model="filter" placeholder="Search" class="mr-3"/>
            <b-button v-b-modal="'assetModal'">Add Asset</b-button>
          </div>
          <b-table
            striped
            hover
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
            <template slot="asset" scope="row">{{row.value.name}}<br>{{row.value.symbol}}</template>
          </b-table>
        </div>
        <b-pagination :total-rows="portfolio.length" :per-page="perPage" v-model="currentPage"/>
      </div>
    </div>
    <b-modal no-close-on-backdrop no-auto-focus id="assetModal" title="Add Asset" @ok="submitAssetModal"
             @shown="resetAssetModal">
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
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex';
  import Multiselect from 'vue-multiselect';
  import colors from 'nice-color-palettes/100.json';
  import { formatCurrency, formatPercent } from '../utils';
  import AllocationChart from './charts/AllocationChart';

  export default {
    name: 'portfolio',
    components: {
      AllocationChart,
      Multiselect,
    },
    data() {
      return {
        asset: {
          selected: null,
          amount: null,
        },
        currentPage: 1,
        perPage: 5,
        sortBy: 'value_usd',
        sortDesc: false,
        filter: null,
      };
    },
    methods: {
      resetAssetModal() {
        this.asset.selected = null;
        this.asset.amount = null;
      },
      submitAssetModal(e) {
        if (!this.asset.selected || !this.asset.amount) {
          return e.cancel();
        }
        this.modifyAsset({
          id: this.asset.selected.id,
          amount: Number.parseFloat(this.asset.amount),
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
        for (let i = 0; i < this.portfolio.length; i += 1) {
          const percent = (this.portfolio[i].value_usd / this.portfolioValue.usd) * 100;
          allocations.labels.push(this.portfolio[i].asset.name);
          allocations.datasets[0].backgroundColor.push(colors[i][1]);
          allocations.datasets[0].data.push(percent.toFixed(2));
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
        value.usd_formatted = formatCurrency(value.usd, true);
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
          asset: { label: 'Asset', sortable: true },
          price_usd: {
            label: 'Price',
            sortable: true,
            formatter(value) {
              return formatCurrency(value, true);
            },
          },
          amount: {
            label: 'Holdings',
            sortable: true,
            formatter(value) {
              return formatCurrency(value);
            },
          },
          value_usd: {
            label: 'Value',
            sortable: true,
            formatter(value) {
              return formatCurrency(value, true);
            },
          },
          percent_change: {
            label: '% Change',
            sortable: true,
            formatter(value) {
              return formatPercent(value, true);
            },
          },
        };
      },
      portfolio() {
        const portfolio = [];
        for (let i = 0; i < this.assets.length; i += 1) {
          const ticker = this.tickers.filter(item => item.id === this.assets[i].id);
          const price = this.prices.filter(item => item.id === this.assets[i].id);
          if (ticker.length !== 0 && price.length !== 0) {
            portfolio.push({
              id: ticker[0].id,
              asset: { name: ticker[0].name, symbol: ticker[0].symbol },
              price_usd: price[0].price_usd,
              price_btc: price[0].price_btc,
              price_eth: price[0].price_eth,
              price_ltc: price[0].price_ltc,
              amount: this.assets[i].amount,
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
