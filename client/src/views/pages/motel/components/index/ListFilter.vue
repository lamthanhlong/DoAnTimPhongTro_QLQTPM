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


                <p> Min: {{ price.value }} triệu VNĐ</p>
                <p> Max: {{ price.max }}  triệu VNĐ</p>

                 <v-slider
                  :max="price.max"
                  min="0"
                  :thumb-color="price.color"
                  v-model="price.value"
                  hide-details
                  :step="price.step"
  
                ></v-slider>
              </div>
              <div>
                 <v-checkbox
                  v-model="filters"
                  label="Area"
                  value="area"
                ></v-checkbox>

                <p> Min: {{ $helper.defaultNumber(area.value) }}m<sup>2</sup></p>
                <p> Max: {{ $helper.defaultNumber(area.max) }}m<sup>2</sup> </p>

                 <v-slider
                  :max="area.max"
                  min="0"
                  :thumb-color="area.color"
                  v-model="area.value"
                  hide-details
                  :step="area.step"
  
                ></v-slider>

              </div>
              <div>
                 <v-checkbox
                  v-model="filters"
                  label="Sort"
                   value="sort"
                ></v-checkbox>
                <m-filter-price
                label="Giá"
                :items="sort"
                :data.sync="filterPrice"
                ></m-filter-price>
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
import SliderPrice from "./SliderPrice";
import SliderArea from "./SliderArea";
import Filter from "./Filter";
export default {

  components: {
    'm-slider-price': SliderPrice,
    'm-slider-area': SliderArea,
    'm-filter-price': Filter,
  },

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
        this.$route.query.sort ? "sort" : "",
      ],
      price: {
        step: 0.5,
        max: 20,
        value: this.$route.query.hasOwnProperty('price') ? (this.$route.query.price.split("-")[0] || 0) : 0,
        color: "primary",
      },
      area: {
        step: 5,
        max: 200,
        value: this.$route.query.hasOwnProperty('area') ? this.$route.query.area.split("-")[0] || 0 : 0,
        color: "primary",
      },
      sort: [
        {
          key: "asc",
          name: "Giá thấp nhất"
        },
         {
          key: "desc",
          name: "Giá cao nhất"
        }
      ],
      
    };
  },

  mounted(){
    console.log(this.filterPrice);
  },

  computed: {
    filterPrice: {
        get(){
          if(this.$route.query.sort && this.$route.query.sort === "price_asc")
          {
            return {
              key: "price_asc",
              name: "Giá thấp nhất"
            }
          }else{
            return  {
              key: "price_desc",
              name: "Giá cao nhất"
            }
          }
        },
        set(data){
          var url = this.$route;
          var filterPrice = data.key;
          var query = Object.assign({}, this.$route.query);
          query.sort = filterPrice;

          this.$router.push({
              name: 'motelIndex', 
              query: query
          });
        }
      }
  },

  methods: {
    close(){
     this.$emit('update:isVisible', false) 
    },

    async save(){

      var query = Object.assign({}, this.$route.query);

      var filterPrice = this.filterPrice.name;
      var pricerSlider =  this.price.value + '-' + this.price.max;
      var areaSlider = this.area.value + '-' + this.area.max;


      var payLoad = Object.assign({}, query);

      if(this.filters.includes("area")){
        payLoad.area = areaSlider;
        query.area = areaSlider;
      }else{
        delete payLoad.area;
        delete query.area;
      }

      if(this.filters.includes("price")){
        payLoad.price = pricerSlider;
        query.price = pricerSlider;
        
      }else{
          delete payLoad.price;
             delete query.price;
      }

      if(this.filters.includes("sort")){
         payLoad.sort = filterPrice;
         query.sort = filterPrice;
      }else{
        delete payLoad.sort;
          delete query.price;
      }

      this.$router.push({
          name: 'motelIndex', 
          query: query
      });


      this.$store.dispatch("components/actionProgressHeader", { option: "show" })
      setTimeout(async () => {
        this.$store.dispatch("motels/fetchPaging", payLoad);
      }, 200);

      this.$emit('update:isVisible', false) 
    },
  },
};
</script>
