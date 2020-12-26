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
              <p> Min: {{ $helper.defaultNumber(getValue) }}m<sup>2</sup></p>
              <p> Max: {{ $helper.defaultNumber(max) }}m<sup>2</sup> </p>
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
      var url = this.$route;

      var filterArea = this.getValue + '-' + this.max;
      var query = Object.assign({}, this.$route.query);

      query.area = filterArea;
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
