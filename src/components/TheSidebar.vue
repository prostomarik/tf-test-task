<template>
  <div class="sidebar">
    <div class="sidebar__buttons">
      <v-btn-toggle v-model="activeBtn" mandatory>
        <v-btn value="routes">Маршруты</v-btn>
        <v-btn value="stops">Остановки</v-btn>
      </v-btn-toggle>
    </div>

    <ag-grid-vue
      class="sidebar__table ag-theme-alpine"
      :columnDefs="columnDefs"
      rowSelection="single"
      :rowData="rowData"
      @selection-changed="onSelectionChanged"
    />
  </div>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue'
import { mapState, mapGetters } from 'vuex'

import eventBus from '@/eventBus'

export default {
  name: 'TheSidebar',

  components: { AgGridVue },

  data() {
    return {
      columnDefs: [],
      rowData: [],

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

  watch: {
    activeBtn(value) {
      if (value === 'stops') {
        this.columnDefs = this.columnsForStops
        this.rowData = this.stops
      } else {
        this.columnDefs = this.columnsForRoutes
        this.rowData = this.routes
      }
    },
  },

  mounted() {
    this.columnDefs = this.columnsForRoutes
    this.rowData = this.routes
  },

  methods: {
    onSelectionChanged(params) {
      const selectedRow = params.api.getSelectedRows()[0]
      console.log(selectedRow)
      eventBus.$emit('show-route', { id: selectedRow.ID, type: this.activeBtn })
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
