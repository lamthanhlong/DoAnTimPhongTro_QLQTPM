<template>
  <div id="profile">
    <v-layout v-resize="onResize">
      <v-container>
        <v-row>
          <label-table title="Profile"> </label-table>
        </v-row>

         <v-row>
      <v-col cols="12" md="4" :class="{ 'pa-0': isMobile }">
        <m-menu :getUser="getUser" v-if="getUser"></m-menu>
      </v-col>

      <v-col cols="12" md="8" :class="{ 'pa-0': isMobile }">
        <v-card tile  style="height: 100%;">

          <v-card-title class="border-bottom">Phòng trọ của {{ getUser.name }}</v-card-title>

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

                          <div>
                            <code>{{item.area}}m<sup>2</sup></code>
                          </div>

                          <div class="my-4 subtitle-1 text-decoration-underline" v-if="item.has_furniture">
                            Có nội thất
                          </div>
                      </v-card-text>
                      <v-card-actions>
                        <v-btn
                        color="primary"
                        small
                        outlined
                        @click="view(item)"
                        >
                          Xem
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
      </v-container>
    </v-layout>
  </div>
</template>

<script>

// service
import CookieService from "@/services/cookie";
import UserService from "@/services/user";
import MotelService from "@/services/motel";

// component
import Menu from './components/Menu.vue';

// mixins
import IsMobile from "@/mixins/is_mobile";
export default {

  components: {
    'm-menu': Menu
  },


  mixins: [IsMobile],

  data() {
    return {
      menuInfo: [
        { title: "Thông tin", icon: "mdi-account-circle", link: "/profile/info" },
        { title: "Đăng bài", icon: "mdi-plus-box-outline", link: "/profile/create_post" },
        { title: "Danh sách bài đã đăng", icon: "mdi-playlist-edit", link: "/profile/list_motel" },
        { title: "Logout", icon: "mdi-login-variant", link: "/auth/login" }
      ],
      edit: false,
      isMobile: false,
      showAvatarDialog: false,
      image: null,
      isSelecting: false,

      userId: this.$route.params.id,
      getUser: {},
      motels: [],
    };
  },

  created(){
    this.retrieveData(this.userId);
  },



  methods: {

    async retrieveData(userId){
      const res = await UserService.fetch(userId);

      if(res.status === 200){
        this.getUser = res.data[0];
      }

      const motelResponse = await MotelService.getAllByOwner(userId);
      if(motelResponse.status === 200)
      {
        this.motels = motelResponse.data.data;

        this.pageCounts = motelResponse.data.pageCounts;
      }
    },

    async view(item){
      this.$router.push(`/motels/detail/${item._id}`);
    }
  },

  computed: {
    userInfo(){
      return CookieService.get('userInfo');
    }
  }
  
};
</script>
