<template>
  <div>
    <b-button size="sm" v-on:click="seedData();">Seed Data</b-button>
    <div class="portfolio">
      <AssetCard v-for="(item, index) in portfolio" v-bind:item="item" v-bind:index="index"
                 v-bind:key="item.id"></AssetCard>
    </div>
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
