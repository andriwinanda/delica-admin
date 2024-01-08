<template>
  <div>
    <div class="flat-card">
      <div class="card-content">
        <p class="is-size-3 dynamic-title">
          {{ id ? 'Edit ' : 'Create new' }} Lokasi
          <b-button class="is-pulled-right" type="is-secondary" rounded :loading="isLoading"
            @click="submitForm()">Save</b-button>
        </p>
        <br />
        <div class="row">
          <div class="columns">
            <div class="column is-6">
              <form>
                <b-field label="Lokasi">
                  <b-input required v-model="location" placeholder="Cth. Medan" />
                </b-field>
                <b-field label="Deskripsi">
                  <b-input v-model="description" placeholder="Cth. kota tercinta" />
                </b-field>
              </form>
            </div>
            <div class="column is-6 is-align-item-center is-justify-content-center has-text-centered">
              <img src="../../assets/imgs/GraphicInput.svg" alt />
              <p class="is-size-7 has-text-grey">Lokasi digunakan untuk menentukan harga
                pada lokasi yang dipilih</p>
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
      location: "",
      description: ""
    }
  },
  methods: {
    submitForm ()
    {
      let submit
      let data = {
        location: this.location,
        description: this.description
      }
      if ( data.location && data.description )
      {
        this.isLoading = true
        if ( this.id )
        {
          submit = this.axios.put( `/api/location${this.id}`, data )
        } else
        {
          submit = this.axios.post( "/api/location", data )
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
        .get( `api/location/${ this.id }` )
        .then( res =>
        {
          let data = res.data
          this.location = data.location
          this.description = data.description
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
