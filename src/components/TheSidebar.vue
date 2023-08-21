<template>
  <div class="sidebar">
    <div class="sidebar__buttons">
      <button type="button" @click="activeBtn = 'routes'" :class="{ active: activeBtn === 'routes' }">
        Маршруты
      </button>
      <button type="button" @click="activeBtn = 'stops'" :class="{ active: activeBtn === 'stops' }">
        Остановки
      </button>
    </div>

    <ag-grid-vue class="sidebar__table ag-theme-alpine" :columnDefs="columnDefs" :rowData="rowData" />
  </div>
</template>

<script>
import axios from 'axios'
import { AgGridVue } from 'ag-grid-vue'

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
          valueGetter: (params) => this.numberOfRoutesById[params.data.ID],
        },
        {
          field: 'Forward',
          headerName: 'Направление',
          valueGetter: (params) => (params.data.Forward ? 'Прямое' : 'Обратное'),
        },
      ],

      routes: [],
      stops: [],

      numberOfRoutesById: [],

      activeBtn: 'routes',
    }
  },

  mounted() {
    this.initTable()
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

  methods: {
    async initTable() {
      this.routes = await axios
        .get('https://220.transflow.ru/api/public/v1/routes_data?key=012345678abc')
        .then((response) => response.data)

      this.stops = this.routes.map((route) => route.Stops).flat()

      const ids = this.stops.map((stop) => stop.ID)
      ids.forEach((ids) => {
        this.numberOfRoutesById[ids] = (this.numberOfRoutesById[ids] || 0) + 1
      })

      this.columnDefs = this.columnsForRoutes
      this.rowData = this.routes
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
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 20px;
    margin-bottom: 20px;

    .active {
      background-color: grey;
    }
  }

  &__table {
    width: 100%;
    height: calc(100% - 40px);
  }
}
</style>
