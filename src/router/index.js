import Vue from 'vue';
import Router from 'vue-router';

// containers
import Full from '@/containers/Full';

// views
// import Dashboard from '@/components/Dashboard';
import Portfolio from '@/views/Portfolio';
// import Settings from '@/views/Settings';
import Error404 from '@/views/errors/Error404';

Vue.use(Router);

export default new Router({
  linkActiveClass: 'open active',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: '/',
      redirect: '/portfolio',
      name: 'Home',
      component: Full,
      children: [
        {
          path: 'portfolio',
          name: 'Portfolio',
          component: Portfolio,
        },
      ],
    },
    {
      path: '*',
      component: Error404,
    },
  ],
});
