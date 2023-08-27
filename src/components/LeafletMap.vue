<template>
  <div id="map"></div>
</template>

<script>
import L from 'leaflet'
import { mapState } from 'vuex'

import eventBus from '@/eventBus'

export default {
  name: 'LeafletMap',

  data() {
    return {
      mapOptions: {
        center: L.latLng(37.0902, -95.7129),
        zoom: 4,
      },
      map: null,
      layerControl: null,

      routesLayer: {},
      lastObjectId: null,
    }
  },

  computed: {
    ...mapState({
      routes: (state) => state.routes,
      stops: (state) => state.stops,
    }),
  },

  mounted() {
    eventBus.$on('show-route', this.showObject)

    this.initMap()
    this.initRoutes()
  },

  methods: {
    initMap() {
      this.map = L.map('map', this.mapOptions)

      const tile = L.tileLayer(`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`, {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(this.map)

      this.layerControl = L.control.layers({ OpenStreetMap: tile }).addTo(this.map)
    },

    initRoutes() {
      this.routes.forEach((route) => {
        // некоторые маршруты не имеют Points
        if (route.Points) {
          const forwardTrueRoutePoints = route.Points.filter((point) => point.Forward === true).map(
            (point) => [point.Lat, point.Lon]
          )
          const forwardFalseRoutePoints = route.Points.filter((point) => point.Forward === false).map(
            (point) => [point.Lat, point.Lon]
          )

          this.routesLayer[route.ID] = {
            route: L.featureGroup([
              L.polyline(forwardTrueRoutePoints, { color: 'blue' }).bindTooltip(route.Name),
              L.polyline(forwardFalseRoutePoints, { color: 'red' }).bindTooltip(route.Name),
            ]),
            stops: {},
          }

          route.Stops.forEach((stop) => {
            // многие ids остановок с бэка повторяются
            if (!this.routesLayer[route.ID].stops[stop.ID]) {
              this.routesLayer[route.ID].stops[stop.ID] = L.marker([stop.Lat, stop.Lon], {
                icon: L.icon({
                  iconUrl: stop.Forward
                    ? require('../assets/forward-true.svg')
                    : require('../assets/forward-false.svg'),
                  iconSize: [26, 26],
                }),
              }).bindTooltip(stop.Name)
            }
          })
        }
      })
    },

    showObject(args) {
      const { selectedRow, type } = args
      const { ID } = selectedRow

      if (type === 'routes') {
        if (!this.routesLayer[ID]) {
          return
        }

        if (this.lastObjectId) {
          this.removePreviousObject(this.lastObjectId)
        }

        const route = this.routesLayer[ID].route

        route.addTo(this.map)
        Object.values(this.routesLayer[ID].stops).forEach((stop) => stop.addTo(this.map))
        this.map.fitBounds(route.getBounds())

        this.lastObjectId = ID
      } else if (type === 'stops') {
        const { RouteID } = selectedRow

        const stop = this.routesLayer[RouteID].stops[ID]
        stop.addTo(this.map)

        this.map.setView(stop._latlng, 20)
      }
    },

    removePreviousObject(lastLayerId) {
      this.map.removeLayer(this.routesLayer[lastLayerId].route)

      Object.values(this.routesLayer[lastLayerId].stops).forEach((stop) => {
        this.map.removeLayer(stop)
      })
    },
  },

  beforeDestroy() {
    eventBus.$off('show-route')
  },

  destroyed() {
    if (this.map) {
      this.map.remove()
    }
  },
}
</script>

<style scoped>
@import 'leaflet/dist/leaflet.css';

#map {
  height: 100vh;
  width: 75%;
  overflow: hidden;
}
</style>