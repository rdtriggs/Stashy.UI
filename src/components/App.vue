<template>
  <router-view></router-view>
</template>

<style lang="scss">
  @import '../assets/scss/style';
</style>

<script>
  export default {
    name: 'app',
    // data() {
    //   return {
    //     tickerInterval: null,
    //   };
    // },
    // methods: {
    //   load() {
    //     Promise.all([this.loadTickers(), this.loadAssets(), this.loadPrices()]).then(() => {
    //       // todo
    //     });
    //   },
    //   ...mapActions([
    //     'loadTickers',
    //     'loadPrices',
    //     'loadAssets',
    //     'updatePrices',
    //   ]),
    // },
    // mounted() {
    //   this.load();
    //   this.tickerInterval = setInterval(() => {
    //     this.updatePrices();
    //   }, 300000);
    // },
    // beforeDestroy() {
    //   clearInterval(this.tickerInterval);
    // },
    created() {
      this.$store.dispatch('loadPortfolio');
    },
  };
</script>
