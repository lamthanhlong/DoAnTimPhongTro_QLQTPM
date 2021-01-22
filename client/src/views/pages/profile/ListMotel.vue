<template>
<v-layout v-resize="onResize">
  <v-container>
    <v-row>
      <label-table title="Profile"> </label-table>
    </v-row>

    <v-row>
      <v-col cols="12" md="4" :class="{ 'pa-0': isMobile }">
        <m-menu></m-menu>
      </v-col>

      <v-col cols="12" md="8" :class="{ 'pa-0': isMobile }">
        <v-card tile  style="height: 100%;">

          <v-card-title class="border-bottom">Các bài đã đăng</v-card-title>

          <v-list two-line>
              <v-list-item-group

                active-class="pink--text"
                multiple
              >
                <template v-for="(item, index) in motels">
                  <v-row>
                      <v-col cols="5">
                        <v-img 
                          v-if="item.images"
                          width="100%"
                          height="auto"
                          :src="$helper.getMainImageMotel(item.images)"
                          contain
                          :aspect-ratio="16/9"
                        ></v-img>

                        <v-img
                        v-else
                        width="100%"
                        height="auto"
                        contain
                        :aspect-ratio="16/9"
                        src="@/assets/img/default.png"
                        >

                        </v-img>
                      </v-col>
                      <v-col cols="7">
                      <v-card-title>{{ item.title }}</v-card-title>
                        <v-card-text>
                          <v-row
                            align="center"
                            class="mx-0"
                          >
                            <v-rating
                              :value="item.rating"
                              color="amber"
                              dense
                              half-increments
                              readonly
                              size="14"
                            ></v-rating>

                          </v-row>

                          <div class="my-4 subtitle-1 red--text font-weight-bold">
                            {{ item.price }} triệu VNĐ
                          </div>

                          <div class="my-4 subtitle-1 red--text font-weight-bold">
                            <code>{{item.area}}m<sup>2</sup></code>
                          </div>

                          <div v-show="item.rating_code"> 
                            Mã đánh giá: <code>{{item.rating_code}}</code>
                          </div>

                          <div class="my-4 subtitle-1 text-decoration-underline" v-if="item.has_furniture">
                            Có nội thất
                          </div>
                      </v-card-text>
                      <v-card-actions>
                        <v-btn
                        class="mr-2"
                        color="primary"
                        small
                        outlined
                        @click="viewDetail(item)"
                        >
                          Xem chi tiết
                        </v-btn>

                        <v-btn
                        color="primary"
                        small
                        outlined
                        @click="edit(item)"
                        >
                          Sửa
                        </v-btn>

                        <v-btn
                        color="primary"
                        small
                        outlined
                        @click="getRatingCode(item)"
                        >
                          Lấy mã đánh giá
                        </v-btn>

                      </v-card-actions>
                    </v-col>
                </v-row>
                  <v-divider
                    v-if="index < motels.length - 1"
                    :key="index"
                  ></v-divider>
                </template>
              </v-list-item-group>
            </v-list>
        </v-card>
      </v-col>
    </v-row>
    <m-update-post  
    :editModal.sync="editModal"
    v-if="editModal"
    :motel.sync="motel"
    >
    </m-update-post>
  </v-container>
</v-layout>
</template>

<script type="text/javascript">
// services
import MotelService from "@/services/motel";
import CookieService from "@/services/cookie";

// component
import Menu from './components/Menu.vue';
import UpdatePost from "./UpdatePost.vue";

// mixins
import IsMobile from "@/mixins/is_mobile";

export default {

  components: {
    'm-menu': Menu,
    'm-update-post': UpdatePost
  },

  mixins: [IsMobile],

  created(){
    this.retrieveData(this.userId);
  },


  data(){
    return {
      userId: CookieService.get('userInfo')._id,
      selected: [2],
      motels: [],
      currentPage: 1,
      pageCounts: 1,

      editModal: false,
      motel: {},
    }
  },


  methods: {
    async retrieveData(userId){
      const res = await MotelService.getAllByOwner(userId);

      if(res.status === 200)
      {
        this.motels = res.data.data;
        this.pageCounts = res.data.pageCounts;
      }
    },

    edit(motel)
    {
      this.motel = {...motel};
      this.editModal = true;
    },

    viewDetail(item){
      this.$router.push('/motels/detail/' + item._id)
    },

    async getRatingCode(item)
    {
      const res = await MotelService.getRatingCode(item._id);
      console.log(res.data);
      if(res.data){
        item.rating_code = res.data.rating_code
      }
    }
  },


}
</script>