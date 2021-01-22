<template>
  <v-container>
    <v-row>
      <label-table title="Phòng trọ"> </label-table>
    </v-row>
    <v-row>
      <v-flex :class="{ 'pa-4': !isMobile }">
        <v-card flat>
          <v-row no-gutters>
            <v-col cols="12" sm="6" md="4" lg="4">
              <m-search :data.sync="search"></m-search>
            </v-col>
            <v-spacer></v-spacer>
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
import Search from "./components/index/Search";

// services
import MotelService from "@/services/motel";
export default {

  mixins: [IsMobile],

  components: {
      'm-search': Search,
  },

  data(){
    return {

      itemsPerPage: this.$constant.pagination.ITEMS_PER_PAGE,
      isLoading: true,
      isVisiblePriceModal: false,
      isVisibleAreaModal: false,
      isVisibleListFilter: false,

      search: "",
    }
  },


  created(){

  

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
