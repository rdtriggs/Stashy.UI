<template>
  <div>
    <div class="layout-padding">
      <div class="row gutter wrap">
        <div class="width-1of1 gt-md-width-1of2 gt-bg-width-1of4">
          <div class="st-card-summary">
            <div class="card-title">Summary</div>
            <div class="card-content">
              <ul>
                <li>
                  <h3>{{ portfolioAssetCount }}</h3>
                  <p>Assets</p>
                </li>
                <li class="money">
                  <h3>{{ portfolioValueUsd }}</h3>
                  <p>USD Value</p>
                </li>
                <li class="wallet">
                  <h3>{{ portfolioValueBtc }}</h3>
                  <p>BTC Value</p>
                </li>
              </ul>
              <hr>
              <div class="last-update">Last updated {{ tickerLastUpdate }}</div>
            </div>
          </div>
        </div>
      </div>
      <q-data-table :data="tableData" :config="tableConfig" :columns="tableColumns" class="st-data-table">
        <template slot="selection" scope="selection">
          <button class="primary clear" @click="editAsset(selection)">
            <i>edit</i>
          </button>
          <button class="primary clear" @click="deleteAsset(selection)">
            <i>delete</i>
          </button>
        </template>
      </q-data-table>
      <div class="usage">Data provided by <a href="https://coinmarketcap.com/" target="_blank">CoinMarketCap</a></div>
    </div>
    <button class="secondary circular absolute-bottom-right" @click="$refs.assetModal.open()"
            style="right: 18px; bottom: 18px;">
      <i>add</i>
    </button>
    <q-modal ref="assetModal" class="st-modal" @close="resetAssetModal()">
      <div class="modal-header" v-if="asset.edit">
        Edit Asset
      </div>
      <div class="modal-header" v-else>
        Add Asset
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label>Asset</label>
          <q-select type="list" v-model="asset.id" :options="assetOptions" @input="checkAsset()"></q-select>
        </div>
        <div class="form-group">
          <label>Amount</label>
          <q-numeric v-model="asset.amount" :min="0"></q-numeric>
          <small v-if="asset.edit">To remove an asset from your portfolio, set the amount to &quot;0&quot;.</small>
        </div>
      </div>
      <div class="modal-buttons row">
        <button class="negative clear" @click="$refs.assetModal.close()">Cancel</button>
        <button class="primary" @click="addAsset()">Save</button>
      </div>
    </q-modal>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import moment from 'moment'
  import { formatCurrency, formatPercent } from '../../core/utils'

  export default {
    data () {
      return {
        asset: {
          id: null,
          amount: null,
          edit: false
        },
        tableCache: [],
        tableConfig: {
          rowHeight: '50px',
          title: 'Portfolio',
          columnPicker: true,
          bodyStyle: {
            maxHeight: '500px'
          },
          responsive: true,
          selection: 'single'
        },
        tableColumns: [
          {
            label: 'Name',
            field: 'name',
            width: 'auto',
            filter: true,
            sort: true
          },
          {
            label: 'USD Price',
            field: 'price_usd',
            width: 'auto',
            sort: true,
            format (value, row) {
              return formatCurrency(value)
            }
          },
          {
            label: 'BTC Price',
            field: 'price_btc',
            width: 'auto',
            sort: true,
            format (value, row) {
              return formatCurrency(value)
            }
          },
          {
            label: '% Change',
            field: 'percent_change',
            width: 'auto',
            sort: true,
            format (value, row) {
              return formatPercent(value)
            }
          },
          {
            label: 'Amount',
            field: 'amount',
            width: 'auto',
            sort: true,
            format (value, row) {
              return formatCurrency(value)
            }
          },
          {
            label: 'USD Value',
            field: 'value_usd',
            width: 'auto',
            sort: true,
            format (value, row) {
              return formatCurrency(value)
            }
          },
          {
            label: 'BTC Value',
            field: 'value_btc',
            width: 'auto',
            sort: true,
            format (value, row) {
              return formatCurrency(value)
            }
          }
        ]
      }
    },
    methods: {
      addAsset () {
        if (this.$data.asset.id === null || this.$data.asset.id === '' || this.$data.asset.amount === null || isNaN(this.$data.asset.amount)) {
          alert('wtf')
          return
        }
        this.save({id: this.$data.asset.id, amount: this.$data.asset.amount})
        this.$refs.assetModal.close()
        this.resetAssetModal()
      },
      editAsset (selection) {
        if (selection.rows.length !== 1) {
          return
        }

        let asset = this.assets.filter(e => e.id === selection.rows[0].data.id)

        if (asset.length === 0) {
          return
        }

        this.$data.asset.id = asset[0].id
        this.$data.asset.amount = asset[0].amount
        this.$data.asset.edit = true
        this.$refs.assetModal.open()
      },
      deleteAsset (selection) {
        if (selection.rows.length !== 1) {
          return
        }

        let asset = this.assets.filter(e => e.id === selection.rows[0].data.id)

        if (asset.length === 0) {
          return
        }

        // this will remove the asset
        this.save({id: asset[0].id, amount: 0})
      },
      checkAsset () {
        let asset = this.assets.filter(e => e.id === this.$data.asset.id)

        if (asset.length > 0) {
          this.$data.asset.edit = true

          if (this.$data.asset.amount === null || this.$data.asset.amount.length === 0) {
            this.$data.asset.amount = asset[0].amount
          }
        }
      },
      resetAssetModal () {
        this.$data.asset.id = null
        this.$data.asset.amount = null
        this.$data.asset.edit = false
      },
      ...mapActions({
        load: 'loadAssets',
        save: 'addAsset'
      })
    },
    computed: {
      assetOptions () {
        let options = []

        if (this.tickers !== undefined) {
          for (let i = 0; i < this.tickers.length; i++) {
            options.push({
              value: this.tickers[i].id,
              label: this.tickers[i].name
            })
          }

          // sort the array alphabetically
          options.sort(function (a, b) {
            return a.value.localeCompare(b.value)
          })
        }

        return options
      },
      tableData () {
        if (this.assets !== undefined && this.tickers !== undefined) {
          let updated = []

          for (let i = 0; i < this.assets.length; i++) {
            let ticker = this.tickers.filter(item => item.id === this.assets[i].id)
            if (ticker.length === 0) {
              continue
            }

            // tag updated record
            updated.push({id: ticker[0].id})

            let assetIndex = this.$data.tableCache.findIndex(item => item.id === this.assets[i].id)
            let assetMap = {
              id: ticker[0].id,
              name: ticker[0].name,
              price_usd: ticker[0].price_usd,
              price_btc: ticker[0].price_btc,
              amount: this.assets[i].amount,
              value_usd: ticker[0].price_usd * this.assets[i].amount,
              value_btc: ticker[0].price_btc * this.assets[i].amount,
              percent_change: ticker[0].percent_change_24h
            }

            if (assetIndex !== -1) {
              this.$data.tableCache[assetIndex] = assetMap
            }
            else {
              this.$data.tableCache.push(assetMap)
            }
          }

          if (updated.length < this.$data.tableCache.length) {
            this.$data.tableCache = this._.intersectionBy(this.$data.tableCache, updated, 'id')
          }

          this.$data.tableCache = Object.assign([], this.$data.tableCache)
        }

        return this.$data.tableCache
      },
      portfolioAssetCount () {
        return this.assets.length
      },
      portfolioValueUsd () {
        let value = 0

        if (this.assets !== undefined && this.tickers !== undefined) {
          for (let i = 0; i < this.assets.length; i++) {
            let ticker = this.tickers.filter(e => e.id === this.assets[i].id)
            if (ticker.length === 0) {
              continue
            }

            value += ticker[0].price_usd * this.assets[i].amount
          }
        }

        return formatCurrency(value)
      },
      portfolioValueBtc () {
        let value = 0

        if (this.assets !== undefined && this.tickers !== undefined) {
          for (let i = 0; i < this.assets.length; i++) {
            let ticker = this.tickers.filter(e => e.id === this.assets[i].id)
            if (ticker.length === 0) {
              continue
            }

            value += ticker[0].price_btc * this.assets[i].amount
          }
        }

        return formatCurrency(value)
      },
      tickerLastUpdate () {
        let value = 'forever ago'

        if (this.cached !== undefined) {
          value = moment(this.cached).fromNow()
        }

        return value
      },
      ...mapState({
        tickers: state => state.core.tickers.tickers,
        cached: state => state.core.tickers.cached,
        assets: state => state.portfolio.assets
      })
    }
  }
</script>
