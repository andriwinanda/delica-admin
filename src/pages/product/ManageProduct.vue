<template>
  <div>
    <div class="flat-card">
      <div class="card-content">
        <b-table :data="listData" :loading="isLoading" :hoverable="true" :sticky-header="true">
          <template slot="empty" v-if="!isLoading">
            <p class="dynamic-subtitle has-text-centered" style="padding: 10px">No data available in table</p>
          </template>

          <template slot-scope="props">
            <b-table-column label="Tipe" sortable field="type">{{ props.row.type }}</b-table-column>
            <b-table-column label="Series" sortable field="series">{{ props.row.series }}</b-table-column>
            <b-table-column label="Jumlah Daun" sortable field="doorLeaves">{{ props.row.doorLeaves }}</b-table-column>
            <b-table-column label="Deskripsi">{{ props.row.description || '-' }}</b-table-column>
            <b-table-column label="Action" centered style="min-width: 80px">
              <div class="buttons has-addons is-centered">
                <b-button type="is-success" size="is-small" icon-left="pencil"
                  @click="$router.push(`/product/edit/${props.row.idProduct}`)"></b-button>
                <b-button type="is-danger" size="is-small" icon-left="delete"
                  @click="deleteItem(props.row.idProduct)"></b-button>
              </div>
            </b-table-column>
          </template>
        </b-table>
        <b-button class="floating-btn" type="is-primary" size="is-medium" icon-right="plus"
          @click="$router.push('/product/create')" rounded />
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
        .get(`api/product`)
        .then(res => {
          let data = res.data;
          
          data.sort((a, b) => {
            if (a.series > b.series) { return -1; }
            if (a.series < b.series) { return 1; }
            return 0;
          })
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
            .delete(`/api/product/${id}`)
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