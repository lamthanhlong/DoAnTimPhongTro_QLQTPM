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
              <p> Min: {{ getValue }} triệu VNĐ</p>
              <p> Max: {{max }}  triệu VNĐ</p>
            </v-card-text>

             <v-card-text>
                <v-slider
                  :max="max"
                  min="0"
                  :thumb-color="color"
                  v-model="getValue"
                  hide-details
                  :step="step"
                  thumb-label="always"
                ></v-slider>
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
    max: Number,
    value: Number,
    color: {
      type: String,
      default: "primary"
    },
    type: String,
    step: [Number, String]
  },


  data() {
    return {
      are: 0,
      getValue: this.value
    };
  },

  mounted(){
    if(this.$route.query.price)
    {
      this.getValue = this.$route.query.price.split("-")[0];
    }
  },

  methods: {
    close(){
     this.$emit('update:isVisible', false) 
    },

    async save(){

      

      var filterPrice = this.getValue + '-' + this.max;
      var query = Object.assign({}, this.$route.query);
      query.price = filterPrice;

      this.$router.push({
          name: 'motelIndex', 
          query: query
      });

      var payLoad = Object.assign({}, query);
      payLoad.price = filterPrice;
      
      this.$store.dispatch("components/actionProgressHeader", { option: "show" })
      setTimeout(async () => {
        this.$store.dispatch("motels/fetchPaging", payLoad);
      }, 200);

      this.$emit('update:isVisible', false) 
    },
  },



};
</script>
