<template>
  <div id="app">
    <b-navbar toggleable type="inverse" toggle-breakpoint="md" class="pl-5 pr-5">
      <b-nav-toggle target="nav_collapse"></b-nav-toggle>
      <b-navbar-brand to="/"><img src="./assets/stashy.svg" height="30" alt="stashy"></b-navbar-brand>
      <b-collapse is-nav id="nav_collapse">
        <b-nav is-nav-bar>
          <b-nav-item to="/portfolio">Portfolio</b-nav-item>
          <b-nav-item to="/settings">Settings</b-nav-item>
        </b-nav>
      </b-collapse>
    </b-navbar>
    <div class="container">
      <router-view></router-view>
    </div>
  </div>
</template>

<style lang="scss">
  @import './assets/scss/main.scss';
</style>

<script>
  import { mapActions } from 'vuex';

  export default {
    name: 'app',
    data() {
      return {
        tickerInterval: null,
      };
    },
    methods: {
      load() {
        Promise.all([this.loadTickers(), this.loadAssets(), this.loadPrices()]).then(() => {
          // todo
        });
      },
      ...mapActions([
        'loadTickers',
        'loadPrices',
        'loadAssets',
        'updatePrices',
      ]),
    },
    mounted() {
      this.load();
      this.tickerInterval = setInterval(() => {
        this.updatePrices();
      }, 300000);
    },
    beforeDestroy() {
      clearInterval(this.tickerInterval);
    },
  };
</script>
