<template>
  <div>
    <div class="flat-card">
      <div class="card-content">
        <b-loading :is-full-page="true" v-model="isLoading" :can-cancel="false"></b-loading>
        <div class="has-text-right" style="padding-bottom: 10px;">
          <b-button type="is-primary" @click="submitForm()">Save All</b-button>
        </div>
        <div>
          <div v-for="item in listData" :key="item.id" class="columns">
            <b-field class="column" label="Nama Kaca">
              <b-input required v-model="item.name" placeholder="Cth. Kusen" />
            </b-field>
            <b-field class="column" label="Deskripsi">
              <b-input v-model="item.description" placeholder="Cth. Ini kusen" />
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
      location: [],
      listData: []
    };
  },
  methods: {
    getList() {
      this.isLoading = true;
      this.axios
        .get(`api/glass`)
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
            .delete(`/api/glass`, {
              params: {
                idGlass: id
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
        this.axios.post("/api/glass/massupdate", data)
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