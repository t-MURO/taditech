import Vue from 'vue';
import Router from 'vue-router';
import NewReleases from './views/NewReleases.vue';
import About from './views/About.vue';
import Playlists from './views/Playlists.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'NewReleases',
      component: NewReleases,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      // component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
      component: About, 
    },
    {
      path: '/playlists',
      name: 'playlists',
      component: Playlists
    }
  ],
});
