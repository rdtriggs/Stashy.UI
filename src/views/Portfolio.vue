<template>
  <div class="portfolio">
    <!--<b-button size="sm" v-on:click="seedData();">Seed Data</b-button>-->
    <ValueCard v-bind:portfolio="portfolio"></ValueCard>
    <AssetCard v-for="(item, index) in portfolio.assets" v-bind:item="item" v-bind:index="index"
               v-bind:key="item.id"></AssetCard>
  </div>
</template>

<script>
  import ValueCard from '../components/portfolio/ValueCard';
  import AssetCard from '../components/portfolio/AssetCard';
  import { formatCurrency } from '../utils';

  export default {
    name: 'portfolio',
    components: { ValueCard, AssetCard },
    data() {
      return {
        page: {
          title: '0.00',
          separator: '·',
        },
      };
    },
    head() {
      return {
        title: {
          inner: this.portfolio.value === undefined ? '0.00' : formatCurrency(this.portfolio.value, false, 'fiat'),
          separator: this.page.separator,
        },
      };
    },
    computed: {
      portfolio() {
        return this.$store.state.portfolio.portfolio;
      },
    },
    methods: {
      seedData() {
        this.$store.dispatch('addAsset', { id: 'neo', amount: 5100 });
        this.$store.dispatch('addAsset', { id: 'ethereum', amount: 233 });
        this.$store.dispatch('addAsset', { id: 'omisego', amount: 3772 });
        this.$store.dispatch('addAsset', { id: 'gas', amount: 2008 });
        this.$store.dispatch('addAsset', { id: 'chainlink', amount: 80000 });
        this.$store.dispatch('addAsset', { id: 'maker', amount: 36.82 });
        this.$store.dispatch('addAsset', { id: 'iota', amount: 15903 });
        this.$store.dispatch('addAsset', { id: 'bitcoin', amount: 3.165 });
        this.$store.dispatch('addAsset', { id: 'elastos', amount: 505 });
        this.$store.dispatch('addAsset', { id: 'ontology', amount: 826 });
        this.$store.dispatch('addAsset', { id: 'aphelion', amount: 10000 });
        this.$store.dispatch('addAsset', { id: 'effect-ai', amount: 13170 });
        this.$store.dispatch('addAsset', { id: 'switcheo', amount: 20000 });
        this.$store.dispatch('addAsset', { id: 'trinity-network-credit', amount: 5000 });
      },
    },
    mounted() {
      const self = this;
      this.$nextTick(() => {
        self.$emit('updateHead');
      });
    },
  };
</script>
