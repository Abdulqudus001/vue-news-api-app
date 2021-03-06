import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/saved-news',
    name: 'SavedNews',
    component: () => import(/* webpackChunkName: "SavedNews" */ '../views/Saved.vue'),
  },
  {
    path: '/sources',
    name: 'Sources',
    component: () => import(/* webpackChunkName: "SavedNews" */ '../views/Sources.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
