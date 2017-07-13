<template>
  <div>
    <div class="layout-padding">
      <div class="row gutter wrap">
        <div class="width-1of1 gt-md-width-1of3">
          <div class="st-card-value">
            <div class="card-content">
              <span>{{ portfolioValueUsd }}</span><br>
              Total USD Value
            </div>
          </div>
        </div>
        <div class="width-1of1 gt-md-width-1of3">
          <div class="st-card-value">
            <div class="card-content">
              <span>{{ portfolioValueBtc }}</span><br>
              Total BTC Value
            </div>
          </div>
        </div>
      </div>
      <q-data-table :data="tableData" :config="tableConfig" :columns="tableColumns" class="st-data-table">
        <template slot="selection" scope="selection">
          <button class="primary clear" @click="edit(selection)">
            <i>edit</i>
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
          <q-select type="list" v-model="asset.id" :options="assetOptions" @input="check()"></q-select>
        </div>
        <div class="form-group">
          <label>Amount</label>
          <q-numeric v-model="asset.amount" :min="0"></q-numeric>
          <small v-if="asset.edit">To remove an asset from your portfolio, set the amount to &quot;0&quot;.</small>
        </div>
      </div>
      <div class="modal-buttons row">
        <button class="negative clear" @click="$refs.assetModal.close()">Cancel</button>
        <button class="primary" @click="add()">Save</button>
      </div>
    </q-modal>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import { formatLongCurrency, formatStandardCurrency, formatShortCurrency } from '../../core/utils'

  export default {
    data () {
      return {
        asset: {
          id: null,
          amount: null,
          edit: false
        },
        tableConfig: {
          rowHeight: '50px',
          title: 'Portfolio',
          columnPicker: true,
          bodyStyle: {
            maxHeight: '500px'
          },
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
              return formatLongCurrency(value, true)
            }
          },
          {
            label: 'BTC Price',
            field: 'price_btc',
            width: 'auto',
            sort: true,
            format (value, row) {
              return formatLongCurrency(value)
            }
          },
          {
            label: '% Change',
            field: 'percent_change',
            width: 'auto',
            sort: true,
            format (value, row) {
              return formatStandardCurrency(value)
            }
          },
          {
            label: 'Amount',
            field: 'amount',
            width: 'auto',
            sort: true,
            format (value, row) {
              return formatLongCurrency(value)
            }
          },
          {
            label: 'USD Value',
            field: 'value_usd',
            width: 'auto',
            sort: true,
            format (value, row) {
              return formatShortCurrency(value, true)
            }
          },
          {
            label: 'BTC Value',
            field: 'value_btc',
            width: 'auto',
            sort: true,
            format (value, row) {
              return formatLongCurrency(value)
            }
          }
        ]
      }
    },
    methods: {
      add () {
        if (this.$data.asset.id === null || this.$data.asset.id === '' || this.$data.asset.amount === null || isNaN(this.$data.asset.amount)) {
          alert('wtf')
          return
        }
        this.addAsset({id: this.$data.asset.id, amount: this.$data.asset.amount})
        this.$refs.assetModal.close()
        this.resetAssetModal()
      },
      edit (selection) {
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
      check () {
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
      ...mapActions([
        'loadAssets',
        'addAsset'
      ])
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
        let data = []

        if (this.assets !== undefined && this.tickers !== undefined) {
          for (let i = 0; i < this.assets.length; i++) {
            let ticker = this.tickers.filter(e => e.id === this.assets[i].id)
            if (ticker.length === 0) {
              continue
            }

            data.push({
              id: ticker[0].id,
              name: ticker[0].name,
              price_usd: ticker[0].price_usd,
              price_btc: ticker[0].price_btc,
              amount: this.assets[i].amount,
              value_usd: ticker[0].price_usd * this.assets[i].amount,
              value_btc: ticker[0].price_btc * this.assets[i].amount,
              percent_change: ticker[0].percent_change_24h
            })
          }
        }

        return data
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

        return formatShortCurrency(value, true)
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

        return formatStandardCurrency(value)
      },
      ...mapState({
        tickers: state => state.core.tickers.tickers,
        portfolio: state => state.core.portfolio,
        assets: state => state.portfolio.assets
      })
    }
  }
</script>
