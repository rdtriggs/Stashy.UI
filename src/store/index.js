import Vue from 'vue';
import Vuex from 'vuex';
import * as vuex from '../vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: vuex,
  strict: process.env.NODE_ENV !== 'production',
});
