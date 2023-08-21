<template>
  <div id="map"></div>
</template>

<script>
import L from 'leaflet'

import { mapState } from 'vuex'

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
    }
  },

  computed: {
    ...mapState({
      routes: (state) => state.routes,
      stops: (state) => state.stops,
    }),
  },

  mounted() {
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

      this.layerControl = L.control
        .layers({
          OpenStreetMap: tile,
        })
        .addTo(this.map)
    },

    addRoutesToMap() {
      this.routes.forEach((route) => {
        if (route.Points) {
          const points = route.Points.map((point) => [point.Lat, point.Lon])

          L.polyline(points).bindTooltip(route.Name).addTo(this.map)
        }

        route.Stops.forEach((stop) => {
          L.marker([stop.Lat, stop.Lon], {
            icon: L.icon({
              iconUrl: stop.Forward
                ? require('../assets/forward-true.svg')
                : require('../assets/forward-false.svg'),
              iconSize: [26, 26],
              iconAnchor: [5, 26],
            }),
          })
            .bindTooltip(stop.Name)
            .addTo(this.map)
        })
      })
    },
  },

  destroyed() {
    if (this.mapInstance) {
      this.mapInstance.remove()
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
