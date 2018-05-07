<template>
  <router-view></router-view>
</template>

<style lang="scss">
  @import '../assets/scss/style';
</style>

<script>
  export default {
    name: 'app',
    data() {
      return {
        tickerInterval: null,
      };
    },
    created() {
      this.$store.dispatch('loadPortfolio');
    },
    mounted() {
      this.tickerInterval = setInterval(() => {
        this.$store.dispatch('updatePrices');
      }, 300000);
    },
    beforeDestroy() {
      clearInterval(this.tickerInterval);
    },
  };
</script>
