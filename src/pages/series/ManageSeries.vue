<template>
  <div>
    <div class="flat-card">
      <div class="card-content">
        <b-table :data="listData" :loading="isLoading" :hoverable="true" :sticky-header="true">
          <template slot="empty" v-if="!isLoading">
            <p class="dynamic-subtitle has-text-centered" style="padding: 10px">No data available in table</p>
          </template>

          <template slot-scope="props">
            <b-table-column label="Nama Kategori">{{ props.row.type }}</b-table-column>
            <b-table-column label="Series Tersedia" class="is-capitalized">
              <span v-for="(item, idx) in props.row.availability" :key="item">{{ item }}{{ idx <
                props.row.availability.length - 1 ? ', ' : '' }}</span>
            </b-table-column>
            <b-table-column label="Jumlah Daun Tersedia" class="is-capitalized">
              <span v-for="(item, idx) in props.row.doorLeaves" :key="item">{{ item }} Daun{{ idx <
                props.row.doorLeaves.length - 1 ? ', ' : '' }}</span>
            </b-table-column>
            <b-table-column label="Action" centered style="min-width: 80px">
              <div class="buttons has-addons is-centered">
                <b-button type="is-success" size="is-small" icon-left="pencil"
                  @click="$router.push(`/series/edit/${props.row.idSeries}`)"></b-button>
                <b-button type="is-danger" size="is-small" icon-left="delete"
                  @click="deleteItem(props.row.idSeries)"></b-button>
              </div>
            </b-table-column>
          </template>
        </b-table>
        <b-button class="floating-btn" type="is-primary" size="is-medium" icon-right="plus"
          @click="$router.push('/series/create')" rounded />
      </div>
    </div>
  </div>
</template>
<script>
import { getToken } from "../../localstorage-helper";
export default {
  data() {
    return {
      isLoading: false,
      listData: []
    };
  },
  methods: {
    getList() {
      this.isLoading = true;
      this.axios
        .get(`api/series`)
        .then(res => {
          let data = res.data;
          this.listData = data;
          this.isLoading = false;
        })
        .catch(err => {
          this.isLoading = false;
        });
    },

    deleteItem(id) {
      this.$buefy.dialog.confirm({
        title: "Deleting",
        message:
          "Are you sure you want to <b>delete</b> this item? This action cannot be undone.",
        confirmText: "Delete",
        type: "is-danger",
        hasIcon: true,
        onConfirm: () => {
          this.isLoading = true;
          this.axios
            .delete(`/api/series/${id}`)
            .then(res => {
              this.$buefy.toast.open("Item deleted!");
              this.isLoading = false;
              this.listData = [];
              this.getList();
            })
            .catch(err => {
              this.isLoading = false;
              this.$buefy.toast.open({
                message: err.response.data.message || 'Error',
                type: 'is-danger'
              });
            });
        }
      });
    }
  },
  created() {
    this.getList();
  }
};
</script>