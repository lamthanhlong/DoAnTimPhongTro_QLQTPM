<template>
  <v-container>
    <v-row>
      <label-table title="Phòng trọ"> </label-table>
    </v-row>
    <v-row>
      <v-flex :class="{ 'pa-4': !isMobile }">
        <v-card flat>
          <v-row no-gutters>
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
          </v-row>

          <v-layout
            v-resize="onResize"
            column
            class="table"
            :class="{ 'mt-4': isMobile }"
            v-if="!isLoading"
          >
            <v-responsive :aspect-ratio="$constant.aspectRatio.TABLE">
              <v-simple-table :class="{ mobile: isMobile }">
                <template  v-if="motels.length">
                   <thead>
                      <tr>
                        <th class="text-center">STT</th>
                        <th class="text-center" style="width: 25%">Tiêu đề</th>
                        <th class="text-center">Hình ảnh</th>
                        <th class="text-center">Diện tích</th>
                        <th class="text-center">Giá</th>
                        <th class="text-center">Xác thực</th>
                        <th class="text-center">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr  v-for="(item, index) in motels" :key="item.id">
                        <td class="text-center">
                           {{ $helper.showIndex(index, currentPage, itemsPerPage) }}
                        </td>
                        <td class="text-center" >
                          {{ item.title }}
                        </td>
                        <td class="text-center">
                          <v-img class="mx-auto" height="70" width="120" :src="$helper.getMainImageMotel(item.images)"></v-img>
                        </td>
                        <td class="text-center">{{ item.area }}</td>
                        <td class="text-center">{{ item.price }} triệu VNĐ</td>
                        <td class="text-center">
                          <v-chip
                          small
                          :color="item.is_verified === true ? 'primary' : 'red'"
                          dark
                        >
                           {{ item.is_verified === true ? "Đã xác thực" : "Chưa xác thực" }}
                        </v-chip>
                        </td>
                        <td class="text-center">
                           <btn-detail
                            
                            :title="$lang.DETAIL"
                            v-on:action="edit(item)"
                            color="blue darken-1"
                            :classProp="`ma-2`"
                            type="edit"
                          ></btn-detail>

                           <btn-detail
                            title="Xác thực"
                            v-if="!item.is_verified"
                            v-on:action="verify(item)"
                            color="green darken-1"
                            :classProp="`ma-2`"
                            type="edit"
                          ></btn-detail>
                        </td>
                      </tr>
                    </tbody>
                </template>
              </v-simple-table>
            </v-responsive>
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
  </v-container>
</template>

<script>

//mixin
import IsMobile from "@/mixins/is_mobile";

// components
import Filter from "./components/index/Filter";
import MItem from "./components/index/Item";
import SliderPrice from "./components/index/SliderPrice";
import SliderArea from "./components/index/SliderArea";
import ListFilter from "./components/index/ListFilter";


// services
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
      isLoading: true,
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
      if(data.length){
         this.$store.dispatch("components/actionProgressHeader", { option: "hide" })
         this.isLoading = false
      }else{
        this.$store.dispatch("components/actionProgressHeader", { option: "hide" })
        this.isLoading = false
      }
    },
  },

  methods: {

    changeCityEnvent(){
        var query = Object.assign({}, this.$route.query);
        delete query.district;

        query.city = this.filterAddress.city.name;

        this.$router.push({
            name: 'adminMotelIndex', 
            query: query
        });

        this.handleCityEvent(this.filterAddress.city); 
        this.retrieveData(query);
    },

    changeDistrictEnvent(){

        var query = Object.assign({}, this.$route.query);
        query.district = this.filterAddress.district.name;

        this.$router.push({
            name: 'adminMotelIndex', 
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

      var query = Object.assign({}, this.$route.query);
      query.page = this.currentPage;

      this.$router.push({
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


};
</script>
