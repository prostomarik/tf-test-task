<template>
  <div id="app">
    <div v-if="loading" class="app__loader">
      <v-progress-circular :size="100" indeterminate />
    </div>

    <router-view v-else />
  </div>
</template>

<script>
export default {
  name: 'App',

  data() {
    return {
      loading: true,
    }
  },

  async mounted() {
    await this.$store.dispatch('initData')
    this.loading = false
  },
}
</script>

<style lang="scss">
body {
  margin: 0;

  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }

  .app__loader {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 100vw;
  }
}
</style>
