import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import store from './store/store'
import vuetify from '@/plugins/vuetify'

import HomeView from '@/views/HomeView.vue'
import RouteDataView from '@/views/RouteDataView.vue'

Vue.config.productionTip = false

Vue.use(VueRouter)
const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', name: 'Home', component: HomeView },
    {
      path: '/route/:id',
      name: 'RouteData',
      component: RouteDataView,
      props: true,
    },
  ],
})

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app')
