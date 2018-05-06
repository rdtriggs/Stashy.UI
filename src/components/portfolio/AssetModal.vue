<template>
  <b-modal no-close-on-backdrop no-auto-focus id="addAssetModal" title="Add Asset" @ok="submitForm"
           @hidden="resetForm" v-model="modalShow">
    <form @submit.stop.prevent="submit">
      <b-form-fieldset label="Select an asset">
        <multiselect id="assetSelect" v-model="asset.selected" :options="tickers"
                     :custom-label="assetNameAndSymbol" placeholder="Select an asset" label="name" track-by="id"
                     :maxHeight="225"></multiselect>
      </b-form-fieldset>
      <b-form-fieldset label="Enter your holdings">
        <b-form-input type="text" id="assetAmount" placeholder="e.g. 1.27" v-model="asset.amount"></b-form-input>
      </b-form-fieldset>
    </form>
  </b-modal>
</template>

<script>
  import Multiselect from 'vue-multiselect';
  import EventBus from '../../event-bus';

  export default {
    name: 'portfolio-asset-modal',
    components: { Multiselect },
    data() {
      return {
        asset: {
          id: null,
          name: null,
          selected: null,
          amount: null,
        },
        modalShow: false,
      };
    },
    props: {
      tickers: {},
    },
    methods: {
      assetNameAndSymbol({ name, symbol }) {
        return `${name} — [${symbol}]`;
      },
      resetForm() {
        this.asset.id = null;
        this.asset.name = null;
        this.asset.selected = null;
        this.asset.amount = null;
      },
      submitForm(e) {
        if (!this.asset.selected || !this.asset.amount) {
          return e.cancel();
        }
        EventBus.$emit('add-asset', {
          id: this.asset.selected.id,
          amount: Number.parseFloat(this.asset.amount.replace(/,/g, '')),
        });
        return true;
      },
    },
    mounted() {
      EventBus.$on('open-asset-modal', () => {
        this.modalShow = true;
      });
    },
  };
</script>
