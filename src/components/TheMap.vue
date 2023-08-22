<template>
  <div id="map"></div>
</template>

<script>
import L from 'leaflet'
import { mapState } from 'vuex'

import eventBus from '@/eventBus'

export default {
  name: 'TheMap',

  data() {
    return {
      mapOptions: {
        center: L.latLng(37.0902, -95.7129),
        zoom: 4,
      },
      map: null,
      layerControl: null,

      routesLayer: {},
    }
  },

  computed: {
    ...mapState({
      routes: (state) => state.routes,
      stops: (state) => state.stops,
    }),
  },

  mounted() {
    eventBus.$on('show-route', this.openRoute)

    this.initMap()

    this.addRoutesToMap()
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

    addRoutesToMap() {
      this.routes.forEach((route) => {
        // некоторые маршруты не имеют Points
        if (route.Points) {
          const points = route.Points.map((point) => [point.Lat, point.Lon])
          this.routesLayer[route.ID] = {
            route: L.polyline(points).bindTooltip(route.Name),
            stops: {},
          }

          route.Stops.forEach((stop) => {
            // ids с бэка для остановок повторяются
            if (!this.routesLayer[route.ID].stops[stop.ID]) {
              this.routesLayer[route.ID].stops[stop.ID] = L.marker([stop.Lat, stop.Lon], {
                icon: L.icon({
                  iconUrl: stop.Forward
                    ? require('../assets/forward-true.svg')
                    : require('../assets/forward-false.svg'),
                  iconSize: [26, 26],
                  iconAnchor: [5, 26],
                }),
              }).bindTooltip(stop.Name)
            }
          })
        }
      })

      const routesLayerGroup = Object.values(this.routesLayer).map((value) => value.route)
      const stopsLayerGroup = []

      Object.values(this.routesLayer).forEach((value) => {
        Object.values(value.stops).forEach((stop) => {
          stopsLayerGroup.push(stop)
        })
      })

      const routesFeatureGroup = L.featureGroup(routesLayerGroup)
        .addTo(this.map)
        .on('click', this.zoomToFeature)
      L.featureGroup(stopsLayerGroup).addTo(this.map)

      this.map.fitBounds(routesFeatureGroup.getBounds())
    },

    openRoute(layerId) {
      if (!this.routesLayer[layerId]) {
        return
      }

      Object.entries(this.routesLayer).forEach(([id, value]) => {
        if (Number(id) !== layerId) {
          this.map.removeLayer(value.route)
        }
      })

      Object.values(this.routesLayer).forEach((value) => {
        Object.values(value.stops).forEach((stop) => {
          this.map.removeLayer(stop)
        })
      })

      this.map.fitBounds(this.routesLayer[layerId].route.getBounds())
    },

    zoomToFeature(e) {
      Object.values(this.routesLayer).forEach((value) => {
        this.map.removeLayer(value.route)
      })

      this.map.addLayer(e.layer)

      Object.values(this.routesLayer).forEach((value) => {
        Object.values(value.stops).forEach((stop) => {
          this.map.removeLayer(stop)
        })
      })

      this.map.fitBounds(e.layer.getBounds())
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
