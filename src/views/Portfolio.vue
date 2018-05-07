<template>
  <div class="portfolio">
    <!--<b-button size="sm" v-on:click="seedData();">Seed Data</b-button>-->
    <ValueCard v-bind:portfolio="portfolio"></ValueCard>
    <AssetCard v-for="(item, index) in portfolio.assets" v-bind:item="item" v-bind:index="index"
               v-bind:key="item.id" v-bind:tickers="tickers"></AssetCard>
    <AssetModal v-bind:tickers="tickers"></AssetModal>
  </div>
</template>

<script>
  import ValueCard from '../components/portfolio/ValueCard';
  import AssetCard from '../components/portfolio/AssetCard';
  import AssetModal from '../components/portfolio/AssetModal';
  import EventBus from '../event-bus';
  import { formatCurrency } from '../utils';

  export default {
    name: 'portfolio',
    components: { ValueCard, AssetCard, AssetModal },
    head() {
      return {
        title: {
          inner: this.portfolio.value === undefined ? '0.00' : formatCurrency(this.portfolio.value, false, 'fiat'),
          separator: '·',
        },
      };
    },
    computed: {
      portfolio() {
        return this.$store.state.portfolio.portfolio;
      },
      tickers() {
        return this.$store.state.portfolio.tickers;
      },
    },
    mounted() {
      const self = this;
      EventBus.$on('add-asset', (asset) => {
        this.$store.dispatch('addAsset', asset);
      });
      EventBus.$on('remove-asset', (id) => {
        this.$store.dispatch('removeAsset', id);
      });
      EventBus.$on('portfolio-updated', () => {
        self.$emit('updateHead');
      });
    },
  };
</script>
