import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './store/store'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import App from './App.vue'
import HomeView from '@/views/HomeView.vue'
import RouteDataView from '@/views/RouteDataView.vue'

Vue.use(VueRouter)
Vue.use(Vuetify)

Vue.config.productionTip = false

export const eventBus = new Vue()
const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '', name: 'Home', component: HomeView },
    {
      path: '/route/:id',
      name: 'RouteData',
      component: RouteDataView,
    },
  ],
})
const vuetify = new Vuetify({})

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app')
