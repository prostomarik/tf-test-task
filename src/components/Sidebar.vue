<template>
  <div class="sidebar">
    <div class="sidebar__buttons">
      <v-btn-toggle v-model="activeBtn" mandatory>
        <v-btn value="routes">Маршруты</v-btn>
        <v-btn value="stops">Остановки</v-btn>
      </v-btn-toggle>
    </div>

    <div class="sidebar__table">
      <ag-grid-vue
        class="ag-theme-alpine"
        style="width: 100%; height: 100%"
        :columnDefs="columnDefs"
        :rowData="rowData"
        rowSelection="single"
        :getContextMenuItems="getContextMenuItem"
        @selection-changed="selectRow"
        @grid-ready="onGridReady"
        @model-updated="modelUpdated"
      />
    </div>
  </div>
</template>

<script>
// подключил 'ag-grid-enterprise' чтобы была возможность использовать Context Menu,
// можно было иным способом, но решил не тратить на это время, для тестового задания вполне подходит
import 'ag-grid-enterprise'
import { AgGridVue } from 'ag-grid-vue'
import { mapGetters, mapState } from 'vuex'

import { eventBus } from '@/main'

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Sidebar',

  components: { AgGridVue },

  data() {
    return {
      columnsForRoutes: [
        { field: 'Name', headerName: 'Имя', suppressMenu: true },
        {
          field: 'Stops',
          headerName: 'Кол-во остановок',
          suppressMenu: true,
          valueGetter: (params) => params.data.Stops?.length,
        },
      ],
      columnsForStops: [
        { field: 'Name', headerName: 'Имя', suppressMenu: true },
        {
          field: 'ID',
          headerName: 'Кол-во маршрутов',
          suppressMenu: true,
          valueGetter: (params) => this.getNumberOfRoutesById[params.data.ID],
        },
        {
          field: 'Forward',
          headerName: 'Направление',
          suppressMenu: true,
          valueGetter: (params) => (params.data.Forward ? 'Прямое' : 'Обратное'),
        },
      ],

      columnDefs: [],
      rowData: [],

      activeBtn: '',

      paramsApi: null,
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
    activeBtn(type) {
      let selectedRows = []
      if (this.paramsApi) {
        selectedRows = this.paramsApi.getSelectedRows()
      }

      if (type === 'routes') {
        if (selectedRows.length) {
          eventBus.$emit('hide-object', {
            selectedRow: selectedRows[0],
            type: 'stops',
          })
        }

        this.columnDefs = this.columnsForRoutes
        this.rowData = this.routes
      } else if (type === 'stops') {
        if (selectedRows.length) {
          eventBus.$emit('hide-object', {
            selectedRow: selectedRows[0],
            type: 'routes',
          })
        }

        this.columnDefs = this.columnsForStops
        this.rowData = this.stops
      }
    },
  },

  mounted() {
    this.activeBtn = 'routes'
  },

  methods: {
    onGridReady(params) {
      this.paramsApi = params.api

      this.paramsApi.sizeColumnsToFit()
      window.onresize = () => {
        this.paramsApi.sizeColumnsToFit()
      }
    },

    modelUpdated(params) {
      params.api.sizeColumnsToFit()
    },

    selectRow(params) {
      const selectedRow = params.api.getSelectedRows()[0]
      eventBus.$emit('show-object', { selectedRow, type: this.activeBtn })
    },

    getContextMenuItem(params) {
      if (!params.node || this.activeBtn === 'stops') {
        return
      }

      return [
        {
          name: 'Подробно',
          action: () => {
            this.$router.push({
              name: 'RouteData',
              params: { id: params.node.data.ID },
            })
          },
        },
      ]
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
