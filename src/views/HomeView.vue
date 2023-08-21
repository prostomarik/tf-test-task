<template>
  <div class="home-view">
    <TheSidebar />
    <TheMap />
  </div>
</template>

<script>
import TheMap from '@/components/TheMap.vue'
import TheSidebar from '@/components/TheSidebar.vue'

export default {
  name: 'HomeView',

  components: { TheSidebar, TheMap },
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
