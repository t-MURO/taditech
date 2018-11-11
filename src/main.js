import '@babel/polyfill'
import Vue from 'vue';
import './plugins/vuetify'
import App from './App.vue';
import router from './router';
import store from './store';
import localStorage from 'vue-localstorage';
import errorHandling from './mixins/errorHandling';

Vue.use(localStorage, {
  name: 'ls',
  bind: true
})

Vue.mixin(errorHandling);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
