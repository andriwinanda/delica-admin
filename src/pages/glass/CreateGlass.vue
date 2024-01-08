<template>
  <div>
    <div class="flat-card">
      <div class="card-content">
        <p class="is-size-3 dynamic-title">
          {{ id ? 'Edit ' : 'Create new' }} Kaca
          <b-button class="is-pulled-right" type="is-secondary" rounded :loading="isLoading"
            @click="submitForm()">Save</b-button>
        </p>
        <br />
        <div class="row">
          <div class="columns">
            <div class="column is-6">
              <form>
                <b-field label="Jenis Kaca">
                  <b-input required v-model="name" placeholder="Cth. Kusen" />
                </b-field>
                <b-field label="Deskripsi">
                  <b-input v-model="description" placeholder="Cth. Ini kusen" />
                </b-field>

                <b-field v-for="(item, idx) in price" :key="idx" :label="`Harga ${item.name}`" type="is-primary" message="Diisi tanpa titik (.) atau koma (,)">
                  <b-input required v-model="price[idx].price" type="number" placeholder="Cth. Ini kusen" />
                </b-field>

              </form>
            </div>
            <div class="column is-6 is-align-item-center is-justify-content-center has-text-centered">
              <img src="../../assets/imgs/GraphicInput.svg" alt />
              <p class="is-size-7 has-text-grey">Harga setiap daerah berbeda
                silahkan isi harga dengan benar</p>
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
      location: [],
      id: "",
      name: "",
      description: "",
      price: []
    }
  },
  methods: {
    submitForm ()
    {
      let submit
      const price = {}
      this.price.map( el =>
      {
        price[ el.id ] = Number( el.price )
      } )
      let data = {
        name: this.name,
        description: this.description,
        price: price
      }
      if ( data.name )
      {
        this.isLoading = true
        if ( this.id )
        {
          submit = this.axios.put( `/api/glass/${this.id}`, data )
        } else
        {
          submit = this.axios.post( "/api/glass", data )
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
        .get( `api/glass/${ this.id }` )
        .then( res =>
        {
          let data = res.data
          this.name = data.name
          this.description = data.description
          if ( this.location.length )
          {
            Object.keys( data.price ).map( el =>
            {
              const idx = this.price.findIndex( item => item.name === el )
              this.price[ idx ].price = data.price[ el ]
            } )
          }
          this.isLoading = false
        } )
        .catch( err =>
        {
          this.isLoading = false
        } )
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
  created ()
  {
    let id = this.$route.params.id
    this.getLocation()
    if ( id )
    {
      this.id = id
      this.getItemDetail()
    }
  }
}
</script>
