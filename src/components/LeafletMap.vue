<template>
  <div id="leafletMap"></div>
</template>

<script>
import L from 'leaflet'
import { mapState } from 'vuex'

import { eventBus } from '@/main'

export default {
  name: 'LeafletMap',

  data() {
    return {
      mapOptions: {
        center: L.latLng(37.0902, -95.7129),
        zoom: 4,
      },
      leafletMap: null,
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
    // использую eventBus, чтобы напрямую общаться с компонентом Sidebar, не передавая через родителя
    eventBus.$on('show-object', this.showObject)
    eventBus.$on('hide-object', this.hideObject)

    this.initMap()
    this.initRoutes()
  },

  methods: {
    initMap() {
      this.leafletMap = L.map('leafletMap', this.mapOptions)

      const tile = L.tileLayer(`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`, {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(this.leafletMap)

      this.layerControl = L.control.layers({ OpenStreetMap: tile }).addTo(this.leafletMap)
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

      if (this.lastObjectId) {
        this.hideObject(this.lastObjectId)
      }

      if (type === 'routes') {
        if (!this.routesLayer[ID]) {
          return
        }

        const route = this.routesLayer[ID].route

        route.addTo(this.leafletMap)
        Object.values(this.routesLayer[ID].stops).forEach((stop) => stop.addTo(this.leafletMap))
        this.leafletMap.fitBounds(route.getBounds())
      } else if (type === 'stops') {
        const { RouteID } = selectedRow

        const stop = this.routesLayer[RouteID].stops[ID]
        stop.addTo(this.leafletMap)

        this.leafletMap.setView(stop._latlng, 20)
      }

      this.lastObjectId = { selectedRow, type }
    },

    hideObject(args) {
      const { selectedRow, type } = args
      const { ID } = selectedRow

      if (type === 'routes') {
        this.leafletMap.removeLayer(this.routesLayer[ID].route)

        Object.values(this.routesLayer[ID].stops).forEach((stop) => {
          this.leafletMap.removeLayer(stop)
        })
      } else if (type === 'stops') {
        const stop = this.routesLayer[selectedRow.RouteID].stops[ID]
        this.leafletMap.removeLayer(stop)
      }
    },
  },

  beforeDestroy() {
    eventBus.$off('show-route')
    eventBus.$off('hide-route')
  },
}
</script>

<style scoped>
@import 'leaflet/dist/leaflet.css';

#leafletMap {
  height: 100vh;
  width: 75%;
  overflow: hidden;
}
</style>
