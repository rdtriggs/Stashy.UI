<template>
  <div class="portfolio">
    <div class="row">
      <div class="col-md-4">
        <b-card footer-tag="footer" class="st-card mb-3">
          <h4 class="card-title">Portfolio Value
            <small>USD</small>
          </h4>
          <p class="card-text large">{{ portfolioValue.usd_formatted }}</p>
          <div slot="footer">{{ portfolio.length }} Assets Tracked</div>
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
          <b-table
            responsive
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
            <template slot="price_usd" scope="row">{{row.value | formatCurrency}}</template>
            <template slot="amount" scope="row">{{row.value | formatCurrency}}</template>
            <template slot="value_usd" scope="row">{{row.value | formatCurrency}}</template>
            <template slot="percent_change" scope="row">
              <span v-bind:class="colorizePercent(row.value)">{{row.value | formatPercent(true)}}</span>
            </template>
            <template slot="actions" scope="row">
              <div class="text-right">
                <!-- We use click.stop here to prevent a 'row-clicked' event from also happening -->
                <b-button size="sm" @click.stop="editAsset(row.item,row.index,$event.target)">
                  <i class="fa fa-pencil"></i>
                </b-button>
              </div>
            </template>
          </b-table>
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
          id: null,
          name: null,
          selected: null,
          amount: null,
        },
        currentPage: 1,
        perPage: 10,
        sortBy: 'value_usd',
        sortDesc: true,
        filter: null,
      };
    },
    methods: {
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
        this.$root.$emit('show::modal', 'editAssetModal', button);
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
          asset: { label: 'Asset', sortable: true },
          price_usd: {
            label: 'Price',
            sortable: true,
          },
          amount: {
            label: 'Holdings',
            sortable: true,
          },
          value_usd: {
            label: 'Value',
            sortable: true,
          },
          percent_change: {
            label: '% Change',
            sortable: true,
          },
          actions: {
            label: '',
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
              asset: { id: ticker[0].id, name: ticker[0].name, symbol: ticker[0].symbol },
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
