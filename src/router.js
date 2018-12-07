import Vue from 'vue';
import Router from 'vue-router';
import NewReleases from './views/NewReleases.vue';
import Playlists from './views/Playlists.vue';
import Login from './views/Login.vue';
import Index from './views/Index';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index,
    },
    {
      path: '/new-releases',
      name: 'new-releases',
      component: NewReleases,
    },
    {
      path: '/playlists',
      name: 'playlists',
      component: Playlists
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
  ],
});
