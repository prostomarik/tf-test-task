import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    routes: [],
    stops: [],
  },

  getters: {
    getNumberOfRoutesById(state) {
      const ids = state.stops.map((stop) => stop.ID)
      const numberOfRoutesById = {}

      ids.forEach((ids) => {
        numberOfRoutesById[ids] = (numberOfRoutesById[ids] || 0) + 1
      })

      return numberOfRoutesById
    },
  },

  mutations: {
    saveRoutes(state, routes) {
      state.routes = routes
    },

    saveStops(state, stops) {
      state.stops = stops
    },
  },

  actions: {
    async initData({ commit }) {
      const routes = await axios
        .get('https://220.transflow.ru/api/public/v1/routes_data?key=012345678abc')
        .then((response) => response.data)

      const stops = routes.map((route) => route.Stops).flat()

      commit('saveRoutes', routes)
      commit('saveStops', stops)
    },
  },
})
