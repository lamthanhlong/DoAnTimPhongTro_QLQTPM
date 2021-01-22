<template>
  <v-container>
    <v-row>
      <label-table title="Khách hàng"> </label-table>
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
                <template  v-if="users.length">
                   <thead>
                      <tr>
                        <th class="text-center">STT</th>
                        <th class="text-center">Họ tên</th>
                        <th class="text-center">Số điện thoại</th>
                        <th class="text-center">Địa chỉ</th>
                        <th class="text-center">Xác thực</th>
                        <th class="text-center">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr  v-for="(item, index) in users" :key="item.id">
                        <td class="text-center">
                           {{ $helper.showIndex(index, currentPage, itemsPerPage) }}
                        </td>
                        <td class="text-center">
                          {{ item.name }}
                        </td>
                        <td class="text-center">{{ item.phone }}</td>
                        <td class="text-center">{{ item.address }}</td>
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
import UserService from "@/services/user";
export default {

  components: {
    'm-search': Search
  },

  mixins: [IsMobile],

  created(){
    this.retrieveData(this.$route.query);
  },

  data(){
    return {
      currentPage: parseInt(this.$route.query.page) || 1,
      itemsPerPage: this.$constant.pagination.ITEMS_PER_PAGE,

      isLoading: true,
      pageCounts: 1,
      search: ""
    }
  },

  computed: {
     users: {
      get(){
        return this.$store.getters["users/users"];
      }
    },
  },


  watch: {
    users(data){
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

     async retrieveData(query)
     {

      var payLoad = query;
      payLoad.page = this.currentPage;
      this.$store.dispatch("components/actionProgressHeader", { option: "show" })
      setTimeout(async () => {
        this.$store.dispatch("users/fetchPaging", payLoad);
      }, 200);

    },

    nextPage(){

      var query = Object.assign({}, this.$route.query);
      query.page = this.currentPage;

      this.$router.push({
            query: query
      });

      this.retrieveData(query);
    },


    async verify(item){
      var is_verified = !item.is_verified;
      const res = await UserService.verifyUser(item._id);
      if(res.status === 200){
        item.is_verified = true;
      }
    },

    async remove(item){
      var conf = confirm(this.$lang.REMOVE_CONFIRM);

      if(conf){
        const res = await UserService.delete(item.id);
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
