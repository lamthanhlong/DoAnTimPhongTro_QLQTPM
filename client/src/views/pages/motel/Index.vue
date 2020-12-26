<template>
	<v-container>
    <v-row>
      <v-flex :class="{ 'pa-4': !isMobile }">
        <v-card flat>
          <v-row no-gutter >
              <v-col cols="12" sm="3" md="2" lg="2">
                <filter-form
                label="Tỉnh, TP"
                :items="cities"
                :data.sync="filterAddress.city"
                v-on:action="changeCityEnvent()"
                ></filter-form>
              </v-col>

              <v-col cols="12" sm="3" md="2" lg="2">
                <filter-form
                label="Quận, huyện"
                :items="districts"
                :data.sync="filterAddress.district"
                v-on:action="changeDistrictEnvent()"
                ></filter-form>
              </v-col>

              <v-col cols="12" sm="4" md="4" lg="4">
                <div class="d-flex">
                  <v-btn 
                  v-if="!$route.query.price || $route.query.price.split('-')[0] === `0`"
                  class="mr-4"
                  depressed
                  @click="showSlider(`price`)"
                  >
                    Giá Thuê +
                  </v-btn>

                 <v-btn
                    v-else
                    outlined
                    @click="showSlider(`price`)"
                    outlined
                    color="primary"
                     class="mr-4"
                  >{{ showFilterPrice }}</v-btn>

                  <v-btn
                  v-if="!$route.query.area || $route.query.area.split('-')[0] === `0`" 
                  depressed
                  @click="showSlider(`area`)"
                   class="mr-4"
                  >
                    Diện Tích +
                  </v-btn>

                  <v-btn
                    v-else
                    outlined
                    @click="showSlider(`area`)"
                    outlined
                    color="primary"
                     class="mr-4"

                  >{{ showFilterArea }}m<sup>2</sup>
                </v-btn>

                 <v-btn
                  outlined
                  depressed
                  @click="showListFilter()"
                  >
                    Lọc
                    <v-icon>
                      mdi-filter-outline
                    </v-icon>
                  </v-btn>
                </div>
              </v-col>
          </v-row>


          <v-layout
            v-resize="onResize"
            column
            class="table"
            :class="{ 'mt-4': isMobile }"
            v-if="motels.length"
          >
            <v-row>
              <v-col v-for="(item, index) in motels" cols="12" lg="8" :key="item.id">
                <m-item 
                :item="item" 
                v-on:action="viewDetail(item)"
                >
                  
                </m-item>
              </v-col>
            </v-row>
           </v-layout>

          <v-row justify="center">
            <v-col cols="8">
              <v-container class="max-width">
                 <pagination-custom
                  :pageCounts="pageCounts"
                  :currentPage.sync="currentPage"
                  :key="currentPage"
                  @change="nextPage()"
                 >
                   
                 </pagination-custom>
              </v-container>
            </v-col>
          </v-row>
        </v-card>
      </v-flex>
    </v-row>

    <m-slider-price
      v-if="isVisiblePriceModal"
      :isVisible.sync="isVisiblePriceModal"
      :title.sync="price.title"
      :max.sync="price.max"
      :value.sync="price.value"
      :step="price.step"
    >
      
    </m-slider-price>

     <m-slider-area
      v-if="isVisibleAreaModal"
      :isVisible.sync="isVisibleAreaModal"
      :title.sync="area.title"
      :max.sync="area.max"
      :value.sync="area.value"
      :step="area.step"
    >
      
    </m-slider-area>

    <m-list-filter
    :isVisible.sync="isVisibleListFilter"
    v-if="isVisibleListFilter"
    title="Danh sách lọc"

    >
      
    </m-list-filter>
  </v-container>
</template>

<script>

// components
import Filter from "./components/index/Filter";
import MItem from "./components/index/Item";
import SliderPrice from "./components/index/SliderPrice";
import SliderArea from "./components/index/SliderArea";
import ListFilter from "./components/index/ListFilter";

// store
import ComponentStore from "@/store/modules/component";


//mixin
import IsMobile from "@/mixins/is_mobile";

// service
import MotelService from "@/services/motel";

export default {

	mixins: [IsMobile],

    components: {
    	'filter-form': Filter,
    	'm-item': MItem,
      'm-slider-price': SliderPrice,
      'm-slider-area': SliderArea,
      'm-list-filter': ListFilter,
	},

	data(){
		return {

	    itemsPerPage: this.$constant.pagination.ITEMS_PER_PAGE,
	    isLoading: false,
      isVisiblePriceModal: false,
      isVisibleAreaModal: false,
      isVisibleListFilter: false,

      price: {
        title: "Giá thuê +",
        step: 0.5,
        max: 20,
        type: "price",
        value: 0,
      },

      area: {
        title: "Diện tích +",
        step: 5,
        max: 200,
        type: "area",
        value: 0,
      },


			districts: [],
			wards: [],

      cities: [
        {
          id: 1,
          name: "Hồ Chí Minh",
        },
        {
          id: 2,
          name: "Hà Nội",
        },
        {
          id: 3,
          name: "Đà Nẵng",
        }
      ],

			filterAddress: {
				district: this.$route.query.district || "",
				ward: "",
        city:  this.$route.query.city || "",
			},


      sortPrice: {},

      sort: [
        {
          key: "price_asc",
          name: "Giá thấp nhất"
        },
         {
          key: "price_desc",
          name: "Giá cao nhất"
        }
      ]
		}
	},


  created(){

    var city = this.cities.find(item => item.name === this.filterAddress.city);

    this.handleCityEvent(city)
    this.retrieveData(this.$route.query);
  },

  computed: {
    currentPage: {
      get(){
         return this.$store.getters["motels/currentPage"]
      },
      set(page){
        this.$store.commit('motels/UPDATE_CURRENT_PAGE', page)
      }
    },
    pageCounts(){
      return this.$store.getters["motels/pageCounts"]
    },

    motels: {
      get(){
        return this.$store.getters["motels/motels"];
      }
    },

    showFilterPrice: {
      get(){
        return  this.$route.query.price + ' triệu VNĐ';
      }
    },

    showFilterArea: {
      get(){
        return  this.$route.query.area;
      }
    },

  },


  watch: {
    motels(data){
      if(data.length)
         this.$store.dispatch("components/actionProgressHeader", { option: "hide" })
    },
  },

  methods: {

    changeCityEnvent(){
        var query = Object.assign({}, this.$route.query);
        delete query.district;

        query.city = this.filterAddress.city.name;

        this.$router.push({
            name: 'motelIndex', 
            query: query
        });

        this.handleCityEvent(this.filterAddress.city); 
        this.retrieveData(query);
    },

    changeDistrictEnvent(){

        var query = Object.assign({}, this.$route.query);
        query.district = this.filterAddress.district.name;

        this.$router.push({
            name: 'motelIndex', 
            query: query
        });

        this.retrieveData(query);
    },

    showListFilter(){
      this.isVisibleListFilter = true;
    },

    async handleCityEvent(city){
 
      if(city){
          this.filterAddress.city = city;
        var cityId = city.id;
         const districtResponse = await MotelService.getDistricts(cityId);


        if(districtResponse.data){
          this.districts = districtResponse.data.data
        }

        var query = Object.assign({}, this.$route.query);
      }

    },

    showSlider(type){

      if(type === "price"){

       this.isVisiblePriceModal = true;  
      }else if(type === "area"){
         this.isVisibleAreaModal = true;  
      }


    },

    viewDetail(item){
      var id = item._id;
       this.$router.push({
            name: "motelDetail",
            params: {
                id: item._id
            }
      })
    },

    nextPage(){

      var query = this.$route.query;

      this.$router.push({
            name: 'motelIndex', 
            query: query
      });

      this.retrieveData(query);
    },

    async retrieveData(query){

      var payLoad = query;
      payLoad.page = this.currentPage;
      this.$store.dispatch("components/actionProgressHeader", { option: "show" })
      setTimeout(async () => {
        this.$store.dispatch("motels/fetchPaging", payLoad);
      }, 200);

    }
  }
}

</script>