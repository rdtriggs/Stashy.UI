import Vue from 'vue';
import Router from 'vue-router';
// import Dashboard from '@/components/Dashboard';
import Portfolio from '@/components/Portfolio';
import Settings from '@/components/Settings';
import Error404 from '@/components/Error404';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      // component: Dashboard,
      redirect: 'portfolio',
    },
    {
      path: '/portfolio',
      component: Portfolio,
    },
    {
      path: '/settings',
      component: Settings,
    },
    {
      path: '*',
      component: Error404,
    },
  ],
});
