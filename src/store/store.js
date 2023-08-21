import Vue from 'vue'
import Vuex from 'vuex'

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

      // TODO: simplify
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
})
