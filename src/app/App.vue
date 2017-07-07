<template>
  <div id="q-app">
    <q-layout>
      <div slot="header" class="toolbar">
        <!--<button class="hide-on-drawer-visible" @click="$refs.drawer.open()">
          <i>menu</i>
        </button>-->
        <q-toolbar-title :padding="1">
          <img src="~assets/stashy.svg" alt="stashy">
        </q-toolbar-title>
      </div>
      <!--<q-drawer ref="drawer">
        <div class="toolbar light">
          <q-toolbar-title>
            Navigation
          </q-toolbar-title>
        </div>
        <div class="list no-border platform-delimiter">
          &lt;!&ndash;<q-drawer-link icon="dashboard" :to="{path: '/dashboard', exact: true}">
            Dashboard
          </q-drawer-link>&ndash;&gt;
          <q-drawer-link icon="dashboard" :to="{path: '/portfolio', exact: true}">
            Portfolio
          </q-drawer-link>
          <hr>
          <q-drawer-link icon="settings" :to="{path: '/settings', exact: true}">
            Settings
          </q-drawer-link>
        </div>
      </q-drawer>-->
      <router-view class="layout-view"></router-view>
    </q-layout>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'

  export default {
    data () {
      return {
        tickerInterval: null
      }
    },
    methods: {
      ...mapActions([
        'loadTickers',
        'loadAssets',
        'updateTickers'
      ])
    },
    mounted: function () {
      this.loadTickers()
      this.loadAssets()

      this.tickerInterval = setInterval(function () {
        this.updateTickers()
      }.bind(this), 30000)
    },
    beforeDestroy: function () {
      clearInterval(this.tickerInterval)
    }
  }
</script>
