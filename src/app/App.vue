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
        <div ref="options"></div>
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
  import bus from './bus'

  export default {
    data () {
      return {
        tickerInterval: null
      }
    },
    methods: {
      setToolbarOptions: function (options) {
        if (options === undefined || options.length === 0) {
          return
        }

        for (let i = 0; i < options.length; i++) {
          console.log(options)
        }
      },
      ...mapActions([
        'loadTickers',
        'loadAssets',
        'updateTickers'
      ])
    },
    created: function () {
      bus.$on('set-options', this.setToolbarOptions)
    },
    mounted: function () {
      this.loadTickers()
      this.loadAssets()

      this.tickerInterval = setInterval(function () {
        this.updateTickers()
      }.bind(this), 300000)
    },
    beforeDestroy: function () {
      clearInterval(this.tickerInterval)
      bus.$off('set-options', this.setToolbarOptions)
    }
  }
</script>
