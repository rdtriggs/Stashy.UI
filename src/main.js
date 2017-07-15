// === DEFAULT / CUSTOM STYLE ===
// WARNING! always comment out ONE of the two require() calls below.
// 1. use next line to activate CUSTOM STYLE (./src/themes)
require(`./themes/app.${__THEME}.styl`)
// 2. or, use next line to activate DEFAULT QUASAR STYLE
// require(`quasar/dist/quasar.${__THEME}.css`)
// ==============================

import Vue from 'vue'
import axios from 'axios'
import lodash from 'lodash'
import VueLodash from 'vue-lodash/dist/vue-lodash.min'
import VueAxios from 'vue-axios'
import Quasar from 'quasar'
import localforage from 'localforage'
require('localforage-startswith')
import router from './router'
import store from './store'

// register plugins
Vue.use(VueAxios, axios)
Vue.use(VueLodash, lodash)

localforage.config({
  name: 'stashy'
})

// Install Quasar Framework
Vue.use(Quasar)

Quasar.start(() => {
  /* eslint-disable no-new */
  new Vue({
    el: '#q-app',
    store,
    router,
    render: h => h(require('./app/App.vue'))
  })
})
