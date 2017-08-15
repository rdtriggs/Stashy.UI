// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import BootstrapVue from 'bootstrap-vue/dist/bootstrap-vue.esm';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'bootstrap/dist/css/bootstrap.css';
import localforage from 'localforage';
import App from './App';
import store from './store';
import router from './router';

require('localforage-startswith');

Vue.use(BootstrapVue);
Vue.use(VueAxios, axios);
Vue.config.productionTip = false;

localforage.config({
  name: 'stashy',
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App },
});
