import Vue from 'vue';
import VueSkeletonLoader from 'skeleton-loader-vue';
import axios from '@/plugins/axios';
import App from './App.vue';
import router from './router';
import '@/assets/styles/main.css';

Vue.config.productionTip = false;
Vue.prototype.$axios = axios;

Vue.component('skeleton-loader', VueSkeletonLoader);

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
