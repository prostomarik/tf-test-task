<template>
  <div id="map"></div>
</template>

<script>
import L from 'leaflet'

export default {
  name: 'TheMap',

  data() {
    return {
      mapOptions: {
        center: L.latLng(37.0902, -95.7129),
        zoom: 4,
      },
      mapInstance: null,
      layerControlInstance: null,
    }
  },

  mounted() {
    this.initMap()
  },

  methods: {
    initMap() {
      const pointsForJson = [
        [5.58611, 43.296665],
        [5.614466, 43.190604],
        [5.565922, 43.254726],
        [5.376992, 43.302967],
      ]

      const map = L.map('map', this.mapOptions)

      pointsForJson.forEach(function (lngLat) {
        L.marker([lngLat[1], lngLat[0]]).addTo(map)
      })
      const polyline = L.polyline(pointsForJson.map((lngLat) => [lngLat[1], lngLat[0]])).addTo(map)

      const tile = L.tileLayer(`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`, {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map)

      map.fitBounds(polyline.getBounds())

      this.layerControlInstance = L.control
        .layers({
          OpenStreetMap: tile,
        })
        .addTo(map)

      this.mapInstance = map
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
