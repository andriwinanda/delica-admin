<template>
  <div>
    <div class="flat-card">
      <div class="card-content">
        <p class="is-size-3 dynamic-title">
          {{ id ? 'Edit ' : 'Create new' }} Series
          <b-button class="is-pulled-right" type="is-secondary" rounded :loading="isLoading"
            @click="submitForm()">Save</b-button>
        </p>
        <br />
        <div class="row">
          <div class="columns">
            <div class="column is-6">
              <form>
                <b-field label="Tipe">
                  <b-input required v-model="type" placeholder="Cth. Sliding Door" />
                </b-field>
                <b-field label="Series tersedia">
                  <b-taginput v-model="availability" type="is-primary" ellipsis placeholder="Cth. 120"
                    aria-close-label="Delete this series">
                  </b-taginput>
                </b-field>
                <b-field label="Jumlah Daun tersedia">
                  <b-taginput v-model="doorLeaves" type="is-primary" ellipsis placeholder="Cth. 4"
                    aria-close-label="Delete this series">
                  </b-taginput>
                </b-field>
              </form>
            </div>
            <div class="column is-6 is-align-item-center is-justify-content-center has-text-centered">
              <img src="../../assets/imgs/GraphicInput.svg" alt />
              <p class="is-size-7 has-text-grey">Tambahkan series dan jumlah daun pintu
                yang bisa digunakan pada kateogi ini</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data ()
  {
    return {
      isLoading: false,
      id: "",
      type: "",
      availability: [],
      doorLeaves: []
    }
  },
  methods: {
    submitForm ()
    {
      let submit
      let data = {
        type: this.type,
        availability: this.availability,
        doorLeaves: this.doorLeaves
      }
      if ( data.type && data.availability.length && data.doorLeaves.length )
      {
        this.isLoading = true
        if ( this.id )
        {
          submit = this.axios.put( `/api/series/${this.id}`, data )
        } else
        {
          submit = this.axios.post( "/api/series", data )
        }
        submit
          .then( res =>
          {
            this.isLoading = false
            this.$router.back()
            this.$buefy.toast.open( {
              duration: 1000,
              message: "Success",
              type: "is-success",
              position: "is-top"
            } )
          } )
          .catch( err =>
          {
            this.isLoading = false
            this.$buefy.toast.open( {
              duration: 1000,
              message: err.response.data.message,
              type: "is-danger",
              position: "is-top"
            } )
          } )

      } else
      {
        this.$buefy.toast.open( "Data can't be null" )
      }
    },
    getItemDetail ()
    {
      this.isLoading = true
      this.axios
        .get( `api/series/${ this.id }` )
        .then( res =>
        {
          let data = res.data
          this.type = data.type
          this.availability = data.availability
          this.doorLeaves = data.doorLeaves
          this.isLoading = false
        } )
        .catch( err =>
        {
          this.isLoading = false
        } )
    }
  },
  created ()
  {
    let id = this.$route.params.id
    if ( id )
    {
      this.id = id
      this.getItemDetail()
    }
  }
}
</script>
