import Vue from 'vue';
import VueSkeletonLoader from 'skeleton-loader-vue';
import VueToast from 'vue-toast-notification';
import axios from '@/plugins/axios';
import App from './App.vue';
import router from './router';
import '@/assets/styles/main.css';
import 'vue-toast-notification/dist/theme-sugar.css';

Vue.config.productionTip = false;
Vue.prototype.$axios = axios;
Vue.use(VueToast, {
  position: 'top-right',
});

Vue.component('skeleton-loader', VueSkeletonLoader);

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
