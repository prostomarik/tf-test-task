<template>
  <div class="route-data-view">
    <div class="route-data-view__header">
      <v-btn @click="goBack">Закрыть</v-btn>

      <div class="route-data-view__title">Маршрут</div>
    </div>

    <div class="route-data-view__body">
      <div class="route-data-view__left-side">
        <div><b>Название:</b> {{ route.Name }}</div>
        <div><b>Описание:</b> {{ route.Description }}</div>

        <div><b>Кол-во остановок в прямом направлении:</b> {{ forwardTrueStops?.length }}</div>
        <div><b>Кол-во остановок в обратном направлении:</b> {{ forwardFalseStops?.length }}</div>
      </div>

      <div class="route-data-view__right-side">
        <div class="route-data-view__forward-true">
          <b>Cписок остановок в прямом направлении:</b>

          <div v-for="stop in forwardTrueStops" :key="stop.ID">- {{ stop.Name }}</div>
        </div>

        <div class="route-data-view__forward-false" style="">
          <b>Cписок остановок в обратном направлении:</b>

          <div v-for="stop in forwardFalseStops" :key="stop.ID">- {{ stop.Name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'RouteDataView',

  data() {
    return {
      route: {},
    }
  },

  computed: {
    ...mapState({
      routes: (state) => state.routes,
      stops: (state) => state.stops,
    }),

    forwardTrueStops() {
      return this.route.Stops?.filter((stops) => stops.Forward === true)
    },

    forwardFalseStops() {
      return this.route.Stops?.filter((stops) => stops.Forward === false)
    },
  },

  mounted() {
    this.route = this.routes.find((route) => {
      let idFromRouteParams = this.$route.params.id
      idFromRouteParams =
        typeof idFromRouteParams === 'string' ? Number(idFromRouteParams) : idFromRouteParams

      return route.ID === idFromRouteParams
    })
  },

  methods: {
    goBack() {
      this.$router.push({ name: 'Home' })
    },
  },
}
</script>

<style lang="scss" scoped>
.route-data-view {
  &__header {
    padding: 20px 20px 0 20px;
    width: 100%;
    display: flex;
    flex-direction: row;
    gap: 20px;
  }

  &__title {
    font-size: 25px;
    font-weight: bold;
  }

  &__body {
    padding: 20px;
    width: 100%;
    display: flex;
    flex-direction: row;
  }

  &__left-side {
    width: 50%;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__right-side {
    width: 50%;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  &__forward-true {
    background: blue;
    color: white;
    padding: 10px 20px;
  }

  &__forward-false {
    background: red;
    color: white;
    padding: 10px 20px;
  }
}
</style>
