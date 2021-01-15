<template>
  <v-container>
    <v-row>
      <label-table title="Phòng trọ"> </label-table>
    </v-row>
    <v-row>
      <v-flex :class="{ 'pa-4': !isMobile }">
        <v-card flat>
          <v-row no-gutters>

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
                            :classProp="`mr-4`"
                            type="edit"
                          ></btn-detail>

                           <btn-detail
                            title="Xác thực"
                            v-if="!item.is_verified"
                            v-on:action="verify(item)"
                            color="green darken-1"
                            :classProp="`mr-4`"
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


// services
import MotelService from "@/services/motel";
export default {

  mixins: [IsMobile],

  created(){
      var query = Object.assign({}, this.$route.query);
      query.page = this.currentPage;
    this.retrieveData(query);
  },

  data(){
    return {
      currentPage: parseInt(this.$route.query.page) || 1,
      itemsPerPage: this.$constant.pagination.ITEMS_PER_PAGE,

      isLoading: false,
      pageCounts: 1,
      motels: [],
    }
  },

  methods: {

    async retrieveData(query)
    {
      this.isLoading = true;
      this.$store.dispatch("components/actionProgressHeader", {option: "show"});
      setTimeout(async () => {

        var currentPage = query.page || 1;
        const res = await MotelService.fetchPaging(currentPage);

        if(res){
          this.$store.dispatch('components/actionProgressHeader', {option: "hide"});
          this.motels = res.data.data;
          this.pageCounts = res.data.pageCounts;
          this.isLoading = false;
        }else{
           this.$store.dispatch('components/actionProgressHeader', {option: "hide"});
           this.isLoading = false;
        }

      }, 200)
    },

    nextPage(){

      var query = Object.assign({}, this.$route.query);
      query.page = this.currentPage;

      this.$router.push({
            query: query
      });

      this.retrieveData(query);
    },


    edit(item){
      
    },

    create(){

    },

    async verify(item){
      var is_verified = !item.is_verified;
      const res = await MotelService.verifyMotel(item._id);
      if(res.status === 200){
        item.is_verified = true;
      }
    },

    async remove(item){
      var conf = confirm(this.$lang.REMOVE_CONFIRM);

      if(conf){
        const res = await MotelService.delete(item.id);
        if(!res){
          toastr.error(this.$lang.REMOVE_FAIL, this.$lang.ERROR, { timeOut: 1000 });
        }else{
          toastr.success(this.$lang.REMOVE_SUCCESS, this.$lang.SUCCESS, { timeOut: 1000 });
        }
      }
    }
  },


};
</script>
