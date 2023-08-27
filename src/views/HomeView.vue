<template>
  <div class="home-view">
    <Sidebar />
    <LeafletMap />
  </div>
</template>

<script>
import LeafletMap from '@/components/LeafletMap.vue'
import Sidebar from '@/components/Sidebar.vue'

export default {
  name: 'HomeView',

  components: { Sidebar, LeafletMap },
}
</script>

<style scoped lang="scss">
.home-view {
  width: 100%;
  height: 100vh;

  display: flex;
  flex-direction: row;
}
</style>
