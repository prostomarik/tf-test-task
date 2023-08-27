<template>
  <div class="sidebar">
    <div class="sidebar__buttons">
      <v-btn-toggle v-model="activeBtn" mandatory>
        <v-btn value="routes">Маршруты</v-btn>
        <v-btn value="stops">Остановки</v-btn>
      </v-btn-toggle>
    </div>

    <ag-grid-vue
      v-if="activeBtn === 'routes'"
      class="sidebar__table ag-theme-alpine"
      :columnDefs="columnsForRoutes"
      rowSelection="single"
      :rowData="routes"
      :allowContextMenuWithControlKey="true"
      :getContextMenuItems="getContextMenuItem"
      @selection-changed="selectRow"
    />

    <ag-grid-vue
      v-else-if="activeBtn === 'stops'"
      class="sidebar__table ag-theme-alpine"
      :columnDefs="columnsForStops"
      rowSelection="single"
      :rowData="stops"
      @selection-changed="selectRow"
    />
  </div>
</template>

<script>
import 'ag-grid-enterprise'
import { AgGridVue } from 'ag-grid-vue'
import { mapGetters, mapState } from 'vuex'

import eventBus from '@/eventBus'

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Sidebar',

  components: { AgGridVue },

  data() {
    return {
      columnsForRoutes: [
        { field: 'Name', headerName: 'Имя' },
        {
          field: 'Stops',
          headerName: 'Кол-во остановок',
          valueGetter: (params) => params.data.Stops?.length,
        },
      ],
      columnsForStops: [
        { field: 'Name', headerName: 'Имя' },
        {
          field: 'ID',
          headerName: 'Кол-во маршрутов',
          valueGetter: (params) => this.getNumberOfRoutesById[params.data.ID],
        },
        {
          field: 'Forward',
          headerName: 'Направление',
          valueGetter: (params) => (params.data.Forward ? 'Прямое' : 'Обратное'),
        },
      ],

      activeBtn: 'routes',
    }
  },

  computed: {
    ...mapState({
      routes: (state) => state.routes,
      stops: (state) => state.stops,
    }),
    ...mapGetters(['getNumberOfRoutesById']),
  },

  methods: {
    selectRow(params) {
      const selectedRow = params.api.getSelectedRows()[0]
      eventBus.$emit('show-route', { selectedRow, type: this.activeBtn })
    },

    getContextMenuItem(params) {
      return [
        {
          name: 'Подробно',
          action: () => {
            this.openAboutItemPage(params.node.data)
          },
        },
      ]
    },

    openAboutItemPage(item) {
      this.$router.push({
        name: 'RouteData',
        params: { id: item.ID },
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~ag-grid-community/styles/ag-grid.css';
@import '~ag-grid-community/styles/ag-theme-alpine.css';

.sidebar {
  width: 25%;
  padding: 20px;

  &__buttons {
    text-align: center;
    margin-bottom: 20px;
  }

  &__table {
    width: 100%;
    height: calc(100vh - 108px);
  }
}
</style>
