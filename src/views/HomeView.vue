<template>
  <div class="home-view">
    <div v-if="loading" class="home-view__loader">
      <v-progress-circular :size="100" indeterminate />
    </div>

    <template v-else>
      <TheSidebar />
      <TheMap />
    </template>
  </div>
</template>

<script>
import axios from 'axios'

import TheMap from '@/components/TheMap.vue'
import TheSidebar from '@/components/TheSidebar.vue'

export default {
  name: 'HomeView',

  components: { TheSidebar, TheMap },

  data() {
    return {
      loading: true,
    }
  },

  async mounted() {
    await this.initData()
    this.loading = false
  },

  methods: {
    async initData() {
      const routes = await axios
        .get('https://220.transflow.ru/api/public/v1/routes_data?key=012345678abc')
        .then((response) => response.data)

      const stops = routes.map((route) => route.Stops).flat()

      this.$store.commit('saveRoutes', routes)
      this.$store.commit('saveStops', stops)
    },
  },
}
</script>

<style scoped lang="scss">
.home-view {
  width: 100%;
  height: 100vh;

  display: flex;
  flex-direction: row;

  &__loader {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
  }
}
</style>
