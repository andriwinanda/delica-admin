<template>
  <div>
    <div class="flat-card">
      <div class="card-content">
        <p class="is-size-3 dynamic-title">
          {{ id ? 'Edit ' : 'Create new' }} Product
          <b-button class="is-pulled-right" type="is-secondary" rounded :loading="isLoading"
            @click="submitForm()">Save</b-button>
        </p>
        <br />
        <div class="row">
          <div class="columns">
            <div class="column">
              <b-field label="Upload Gambar">
              </b-field>
              <div v-if="imageUrl" class="upload-wrapper">
                <img :src="imageUrl" class="image-preview">
                <p class="delete-file is-overlay">
                  <a @click="removeFile()" type="is-primary" class="delete"></a>
                </p>
              </div>
              <b-upload v-else class="image-preview" v-model="dropFiles" accept="image/png, image/jpeg" drag-drop
                @input="imageUpload($event)">
                <section class="section margin-top-6">
                  <div class="content has-text-centered">
                    <p>
                      <b-icon icon="upload" size="is-large">
                      </b-icon>
                    </p>
                    <p>Drop your files here or click to upload</p>
                  </div>
                </section>
              </b-upload>
            </div>
            <div class="column is-7">
              <form>
                <b-field label="Tipe">
                  <b-select v-model="type" :value="type" placeholder="Pilih tipe" expanded>
                    <option v-for="item in seriesData" :value="item" :key="item.idSeries">{{ item.type }}</option>
                  </b-select>
                </b-field>
                <template v-if="type">
                  <b-field label="Series">
                    <b-select v-model="series" :value="series" placeholder="Pilih series" expanded>
                      <option v-for="item in type.availability" :value="item" :key="item">{{ item }}</option>
                    </b-select>
                  </b-field>
                  <b-field label="Jumlah Daun">
                    <b-select v-model="leaves" :value="leaves" placeholder="Pilih jumlah daun" expanded>
                      <option v-for="item in type.doorLeaves" :value="item" :key="item">{{ item }}</option>
                    </b-select>
                  </b-field>
                </template>
                <b-field label="Deskripsi">
                  <b-input v-model="description" placeholder="Cth. 1 Daun Hidup + 1 Daun Mati" />
                </b-field>
                <b-field label="Kaca Mati"></b-field>
                <b-field grouped>
                  <b-field>
                    <b-checkbox v-model="fixGlassTop">Kaca Mati Atas</b-checkbox>
                  </b-field>
                  <b-field>
                    <b-checkbox v-model="fixGlassBottom">Kaca Mati Bawah</b-checkbox>
                  </b-field>
                </b-field>
              </form>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="column">
            <h2 class="is-size-4 has-text-weight-bold">Matrial yang digunakan</h2>
            <form>
              <!-- <b-field grouped>
                              <b-field label="Nama Material" >
                                <b-input required v-model="glass.name" readonly />
                              </b-field>
                              <b-field label="Rumus" expanded>
                                <b-input required v-model="glass.rumus" expanded readonly placeholder="Masukkan rumus melalui tombol disamping"/>

                              </b-field>
                              <b-field label="Rumus" >
                                <b-button type="is-secondary" icon-right="calculator" @click="openRumus()"></b-button>
                                </b-field>
                            </b-field> -->
              <b-field v-for="(item, idx) in material.value" :key="idx" grouped>
                <b-field label="Nama Material" expanded>
                  <b-input required v-model="material.value[idx].idMaterial" readonly
                    v-if="material.value[idx].idMaterial === 'Kaca'" />
                  <b-select v-else v-model="material.value[idx].idMaterial" placeholder="Pilih tipe" expanded>
                    <option v-for="item in material.options" :value="item.idMaterial" :key="item.idMaterial">{{ item.name
                    }}
                    </option>
                  </b-select>
                  <!-- <b-autocomplete v-else
                      v-model="material.value[idx].idMaterial"
                      placeholder="Cth. Kusen"
                      :open-on-focus="true"
                      :data="material.options"
                      field="name"
                      @select="option => (material.value[idx].idMaterial = option.idMaterial)"
                      :clearable="true"
                  >
                  </b-autocomplete> -->
                  <!-- <b-input required v-model="material.value[idx].name" readonly /> -->
                </b-field>
                <b-field label="Rumus" expanded>
                  <b-input required v-model="material.value[idx].formula" expanded readonly
                    placeholder="Masukkan rumus melalui tombol disamping" />
                </b-field>
                <b-field label="Rumus">
                  <b-button type="is-secondary" icon-right="calculator" @click="openRumus(idx)"></b-button>
                </b-field>
              </b-field>
              <b-field>
                <b-button @click="addMaterial()" icon-left="plus">Tambah Material</b-button>
              </b-field>
            </form>
            <b-modal :active="isCardModalActive" @close="closeRumus()" :width="640" scroll="keep">
              <input-rumus :fixGlassBottom="fixGlassBottom" :fixGlassTop="fixGlassTop" :idx="activeIdx"
                @rumus="setRumus($event)"></input-rumus>
            </b-modal>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import InputRumus from '../../components/InputRumus.vue'
import imageCompression from 'browser-image-compression'
import { ASSETS_URL } from '@/key-helper'
export default {
  components: { InputRumus },
  data() {
    return {
      isLoading: false,
      isCardModalActive: false,
      activeIdx: null,
      assetUrl: ASSETS_URL,


      id: "",
      dropFiles: null,
      imageUrl: "",
      type: '',
      description: '',
      series: '',
      leaves: '',
      fixGlassBottom: false,
      fixGlassTop: false,

      glass: {
        name: 'Kaca',
        rumus: null,
      },

      material: {
        value: [
          {
            idMaterial: 'Kaca',
            formula: ""
          }
        ],
        options: []
      },

      seriesData: []

    }
  },
  methods: {
    async compressImage(file) {
      const imageFile = file
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 400,
        useWebWorker: true
      }
      try {
        const compressedFile = await imageCompression(imageFile, options)
        return compressedFile // write your own logic
      } catch (error) {
      }
    },
    async uploader(formData) {
      this.isLoading = true
      return this.axios.post(`/api/upload`, formData)
        .then(response => {
          this.isLoading = false
          return response.data
        })
        .catch((err) => {
          this.isLoading = false
          throw err
        })
    },
    async submitForm() {
      let submit
      let data = {
        type: this.type.type,
        series: this.series,
        doorLeaves: this.leaves,
        description: this.description,
        material: this.material.value,
        fixGlassBottom: this.fixGlassBottom || false,
        fixGlassTop: this.fixGlassTop || false,
        imageUrl: this.imageUrl ? this.imageUrl.split('delica/')[1] : ''
      }
      if (data.type && data.series && data.material.length) {
        this.isLoading = true
        if (this.dropFiles) {
          const compressedImgTmp = await this.compressImage(this.dropFiles)

          if (compressedImgTmp) {
            const compressedImg = new File([compressedImgTmp], this.dropFiles.name, { type: "image/jpeg" })
            console.log(compressedImg, this.dropFiles)
            const formData = new FormData()
            formData.append("file", compressedImg)
            const imageUrl = await this.uploader(formData)
            if (imageUrl) data.imageUrl = imageUrl.data.split('delica/')[1]
          }
        }
        if (this.id) {
          submit = this.axios.put(`/api/product/${this.id}`, data)
        }
        else {
          submit = this.axios.post("/api/product", data)
        }
        submit
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

      } else {
        this.$buefy.toast.open("Data can't be null")
      }
    },
    getItemDetail() {
      this.isLoading = true
      this.axios
        .get(`api/product/${this.id}`)
        .then(res => {
          let data = res.data
          this.id = data.idProduct
          this.imageUrl = data.imageUrl
          this.description = data.description
          this.fixGlassBottom = data.fixGlassBottom
          this.fixGlassTop = data.fixGlassTop
          this.type = this.seriesData.find(el => el.type === data.type)
          if (this.type) {
            this.series = data.series
            this.leaves = data.doorLeaves
          }
          this.material.value = data.material
          this.isLoading = false
        })
        .catch(err => {
          this.isLoading = false
        })
    },
    async getSeries() {
      this.isLoading = true
      return this.axios
        .get(`api/series`)
        .then(res => {
          let data = res.data
          this.seriesData = data
          this.isLoading = false
          return data
        })
        .catch(err => {
          this.isLoading = false
        })
    },
    getGlass() {
      this.isLoading = true
      this.axios
        .get(`api/glass`)
        .then(res => {
          let data = res.data
          this.glass.options = data
          this.isLoading = false
        })
        .catch(err => {
          this.isLoading = false
        })
    },
    getMaterial() {
      this.isLoading = true
      this.axios
        .get(`api/material`)
        .then(res => {
          let data = res.data
          this.material.options = data
          this.isLoading = false
        })
        .catch(err => {
          this.isLoading = false
        })
    },

    imageUpload(event) {
      this.imageUrl = URL.createObjectURL(event)
    },
    removeFile() {
      this.imageUrl = null
      this.dropFiles = null
    },
    addMaterial() {
      const value = {
        idMaterial: '',
        formula: null,
      }
      this.material.value.push(value)
    },  
    openRumus(idx) {
      this.isCardModalActive = true
      this.activeIdx = idx

    },
    closeRumus() {
      this.isCardModalActive = false
      this.activeIdx = null
    },
    setRumus(event) {
      this.material.value[this.activeIdx].formula = event

      console.log(this.material.value[this.activeIdx].formula)
      this.closeRumus()
    }
  },
  async created() {
    await this.getSeries()
    await this.getGlass()
    await this.getMaterial()
    let id = this.$route.params.id
    if (id) {
      this.id = id
      this.getItemDetail()
    }
  }
}
</script>
<style scoped>
.upload-wrapper {
  display: block;
  position: relative !important;
  width: 320px;
  max-height: 320px !important;
  height: 320px;
}

.image-preview {
  width: 320px;
  max-height: 320px !important;
  height: 320px;
  border-radius: 10px;
}

.delete-file {
  display: block;
  position: absolute;
  text-align: right;
  padding-right: 7px;
  top: 7px;
}

.margin-top-6 {
  margin-top: 3rem;
}
</style>