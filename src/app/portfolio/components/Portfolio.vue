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
      <table class="st-table responsive">
        <thead>
        <tr>
          <th>Name</th>
          <th>USD Price</th>
          <th>BTC Price</th>
          <th>% Change</th>
          <th>Amount</th>
          <th>USD Value</th>
          <th>BTC Value</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in portfolioMap">
          <td data-th="Name"><a @click="edit(item.id)">{{ item.name }}</a></td>
          <td data-th="USD Price">{{ item.price_usd }}</td>
          <td data-th="BTC Price">{{ item.price_btc }}</td>
          <td data-th="% Change">{{ item.percent_change }}</td>
          <td data-th="Amount">{{ item.amount }}</td>
          <td data-th="USD Value">{{ item.value_usd }}</td>
          <td data-th="BTC Value">{{ item.value_btc }}</td>
        </tr>
        <tr v-if="portfolioMap.length === 0">
          <td colspan="7" class="text-center">No assets found. <a @click.prevent="$refs.assetModal.open()">Add one</a>
            to get started.
          </td>
        </tr>
        </tbody>
      </table>
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
          <q-select type="list" v-model="asset.id" :options="assetOptions"></q-select>
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
  import numeral from 'numeral'

  export default {
    data () {
      return {
        asset: {
          id: null,
          amount: null,
          edit: false
        }
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
      edit (id) {
        let asset = this.assets.filter(e => e.id === id)

        if (asset.length === 0) {
          return
        }

        this.$data.asset.id = asset[0].id
        this.$data.asset.amount = asset[0].amount
        this.$data.asset.edit = true
        this.$refs.assetModal.open()
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
      portfolioMap () {
        let map = []

        if (this.assets !== undefined && this.tickers !== undefined) {
          for (let i = 0; i < this.assets.length; i++) {
            let ticker = this.tickers.filter(e => e.id === this.assets[i].id)
            if (ticker.length === 0) {
              continue
            }

            map.push({
              id: ticker[0].id,
              name: ticker[0].name,
              price_usd: numeral(ticker[0].price_usd).format('$ 0,0[.][00000000]'),
              price_btc: numeral(ticker[0].price_btc).format('0,0[.][00000000]'),
              amount: numeral(this.assets[i].amount).format('0,0[.][00000000]'),
              value_usd: numeral(ticker[0].price_usd * this.assets[i].amount).format('$ 0,0'),
              value_btc: numeral(ticker[0].price_btc * this.assets[i].amount).format('0,0[.][00000000]'),
              percent_change: numeral(ticker[0].percent_change_24h).format('0,0.00')
            })
          }
        }

        return map
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

        return numeral(value).format('$ 0,0')
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

        return numeral(value).format('0,0.00')
      },
      ...mapState({
        tickers: state => state.core.tickers.tickers,
        portfolio: state => state.core.portfolio,
        assets: state => state.portfolio.assets
      })
    }
  }
</script>
