<template>
  <div>
    <div class="flat-card">
      <div class="card-content">
        <b-loading :is-full-page="true" :active.sync="isLoading" :can-cancel="false"></b-loading>
        <div class="has-text-right" style="padding-bottom: 10px;">
          <b-button type="is-primary" @click="submitForm()">Save All</b-button>
        </div>
        <div>
          <div v-for="item in listData" :key="item.id" class="columns">
            <b-field class="column" label="Nama Material">
              <b-input required v-model="item.name" placeholder="Cth. Kusen" disabled/>
            </b-field>
            <b-field class="column" label="Deskripsi">
              <b-input v-model="item.description" placeholder="Cth. Ini kusen" disabled/>
            </b-field>
            <b-field class="column" v-for="(el, idx) in location" :key="idx" type="is-primary"
              message="Diisi tanpa titik (.) atau koma (,)">
              <template #label>
                Harga <span class="is-capitalized">{{el.location}}</span>
              </template>
              <!-- <input required v-model="item.price[idx]" @keypress="numericChecker($event)"
                placeholder="Cth. Ini kusen" /> -->
              <b-input required v-model="item.price[el.location]" type="number" />

            </b-field>
          </div>

        </div>
        <!-- <b-table :data="listData" :loading="isLoading" :hoverable="true" :sticky-header="true">
          <template slot="empty" v-if="!isLoading">
            <p class="dynamic-subtitle has-text-centered" style="padding: 10px">No data available in table</p>
          </template>

<template slot-scope="props">
            <b-table-column field="name" label="Nama Material" sortable> {{ props.row.name || '-' }}</b-table-column>
            <b-table-column label="Deskripsi">{{ props.row.description || '-' }}</b-table-column>

            <b-table-column label="Action" centered style="min-width: 80px">
              <div class="buttons has-addons is-centered">
                <b-button type="is-success" size="is-small" icon-left="pencil"
                  @click="$router.push(`/material/edit/${props.row.idMaterial}`)"></b-button>
                <b-button type="is-danger" size="is-small" icon-left="delete"
                  @click="deleteItem(props.row.idMaterial)"></b-button>
              </div>
            </b-table-column>
          </template>
</b-table> -->

        <!-- <b-button class="floating-btn" type="is-primary" size="is-medium" icon-right="plus"
          @click="$router.push('/material/create')" rounded /> -->
      </div>
    </div>
  </div>
</template>
<script>
import { sortingByName } from "@/function-helper"
export default {
  data() {
    return {
      isLoading: false,
      location: [],
      listData: []
    };
  },
  methods: {
    getList() {
      this.isLoading = true;
      this.axios
        .get(`api/material`)
        .then(async res => {
          let data = res.data;
          this.listData = await sortingByName(data)
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
            .delete(`/api/material`, {
              params: {
                idMaterial: id
              }
            })
            .then(res => {
              this.$buefy.toast.open("Item deleted!");
              this.isLoading = false;
              this.listData = [];
              this.getList();
            })
            .catch(err => {
              this.isLoading = false;
              this.$buefy.toast.open(err.response.data.message);
            });
        }
      });
    },
    numericChecker(evt) {
      const ev = evt.target.value || window.event.target.value
      // let charCode = ev.which ? ev.which : ev.keyCode
      // if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46) {
      //   ev.preventDefault()
      // } else {
      //   return true
      // }
      if (isNaN(ev)) {
        console.log(ev)
        return false
      } else return true
    },
    submitForm() {
      this.isLoading = true
      let errorMsg = ''
      const listData = this.listData
      const data = []
      for (let i in listData) {
        const item = {
          id: listData[i].idMaterial,
          name: listData[i].name,
          description: listData[i].description,
          price: {}
        }
        this.location.map(el => {
          item.price[el.idLocation] = Number(listData[i].price[el.location])
        })
        data.push(item)
      }
      // const price = {}
      // this.price.map(el => {
      //   price[el.id] = Number(el.price)
      // })
      // let data = {
      //   name: this.name,
      //   description: this.description,
      //   price: price
      // }
      // if (!data.name) errorMsg = 'Please input name'
      if (errorMsg) {
        this.$buefy.toast.open(errorMsg)
      } else {
        this.axios.post("/api/material/massupdate", data)
          .then(res => {
            this.isLoading = false
            this.$router.back()
            this.$buefy.toast.open({
              duration: 1000,
              message: "Success",
              type: "is-success",
              position: "is-top"
            })
          })
          .catch(err => {
            this.isLoading = false
            this.$buefy.toast.open({
              duration: 1000,
              message: err.response.data.message,
              type: "is-danger",
              position: "is-top"
            })
          })
      }




    },
    getLocation ()
    {
      this.isLoading = true
      this.axios
        .get( `api/location` )
        .then( res =>
        {
          this.location = res.data
          this.location.map( el =>
          {
            this.price.push( {
              id: el.idLocation,
              name: el.location
            } )
          } )
          this.isLoading = false
        } )
        .catch( err =>
        {
          this.isLoading = false
        } )
    }
  },
  created() {
    this.getList();
    this.getLocation()
  }
};
</script>