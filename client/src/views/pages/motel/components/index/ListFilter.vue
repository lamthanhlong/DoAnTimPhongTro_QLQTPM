<template>
  <v-layout row justify-center>
    <v-container>
      <v-dialog
        persistent
        max-width="500"
        v-model="isVisible"
      >
        <v-card
          class="pb-8"
        >

            <v-card-title primary-title style="width:100%;">
              {{ title }}
            </v-card-title>

             <v-card-text>
              <div>
                 <v-checkbox
                  v-model="filters"
                  label="Price"
                  value="price"
                ></v-checkbox>
              </div>
              <div>
                 <v-checkbox
                  v-model="filters"
                  label="Area"
                  value="area"
                ></v-checkbox>
              </div>
              <div>
                 <v-checkbox
                  v-model="filters"
                  label="Address"
                  value="address"
                ></v-checkbox>
              </div>
              <div>
                 <v-checkbox
                  v-model="filters"
                  label="Sort"
                   value="sort"
                ></v-checkbox>
              </div>
             </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <btn-save 
                  :outlined="true"
                  title="Cập nhật"
                  v-on:action="save()"
                  color="blue darken-1"
                  type="save"
                >
                </btn-save>
                
                 <btn-cancel
                  :outlined="true"
                  :title="$lang.CANCEL"
                  v-on:action="close()"
                > </btn-cancel>
              </v-card-actions>
        </v-card>
    </v-dialog>
    </v-container>
  </v-layout>
</template>

<script>

export default {

  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
    title: String,
  },


  data() {
    return {
      filters: [
        this.$route.query.price ? "price" : "",
        this.$route.query.area ? "area" : "",
        this.$route.query.city ? "address" : "",
        this.$route.query.district ? "address" : "",
      ]
    };
  },

  mounted(){
     if(this.$route.query.area)
    {
      this.getValue = this.$route.query.area.split("-")[0];
    }
  },

  methods: {
    close(){
     this.$emit('update:isVisible', false) 
    },

    async save(){


   
      var query = Object.assign({}, this.$route.query);
      this.$router.push({
          name: 'motelIndex', 
          query: query
      });


      var payLoad = Object.assign({}, query);
      payLoad.area = filterArea;

      this.$store.dispatch("components/actionProgressHeader", { option: "show" })
      setTimeout(async () => {
        this.$store.dispatch("motels/fetchPaging", payLoad);
      }, 200);

      this.$emit('update:isVisible', false) 
    },
  },
};
</script>
