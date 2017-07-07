import Vue from 'vue'
import VueRouter from 'vue-router'
import { routes as core } from '../app/core'
// import { routes as dashboard } from '../app/dashboard'
import { routes as portfolio } from '../app/portfolio'
import { routes as settings } from '../app/settings'

Vue.use(VueRouter)

export default new VueRouter({
  /*
   * NOTE! VueRouter "history" mode DOESN'T works for Cordova builds,
   * it is only to be used only for websites.
   *
   * If you decide to go with "history" mode, please also open /config/index.js
   * and set "build.publicPath" to something other than an empty string.
   * Example: '/' instead of current ''
   *
   * If switching back to core "hash" mode, don't forget to set the
   * build publicPath back to '' so Cordova builds work again.
   */
  mode: 'hash',
  routes: [
    // ...dashboard,
    ...portfolio,
    ...settings,
    ...core
  ]
})
