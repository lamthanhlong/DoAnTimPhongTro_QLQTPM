<template>
<v-layout id="window-chat">
   <div class="d-flex window-chat" v-if="windowMessengers.length">
      <div v-for="item, index in windowMessengers">
        <v-card v-show="item.isVisible" class="mr-4" >
          <v-toolbar dark color="primary darken-1">
            <v-toolbar-title>{{ item.sender.name }}</v-toolbar-title>

            <v-spacer></v-spacer>
                <v-btn 
                  icon  
                  dark
                  @click="closeWindowMessenger(item)" 
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
          </v-toolbar>

          <v-card-text
            @v-chat-scroll-top-reached="loadMoreMessenger"
            v-chat-scroll="{ always: false, smooth: true, scrollonremoved: true }"
            class="message pa-0"
          >
            <v-list
              v-for="(messenger, index) in item.listMessengers"
              :key="index"
              class="receive pa-0"
            >
              <div class="block" v-if="messenger.userId !== userInfo._id">
                <v-list-item>
                  <v-list-item-avatar class="logo-img">
                    <v-img src="https://gamek.mediacdn.vn/133514250583805952/2020/3/7/anh-1-1583592253266481895600.jpg"></v-img>
                  </v-list-item-avatar>
                  <v-list-item-title>
                    <v-chip :ripple="false">{{ messenger.message }}</v-chip>
                  </v-list-item-title>
                </v-list-item>
              </div>

              <div class="block" v-else>
                <v-list-item class="justify-end">
                  <v-chip color="pink" :ripple="false">{{ messenger.message }}</v-chip>
                </v-list-item>
              </div>
            </v-list>
          </v-card-text>

           <v-card-actions>
              <v-spacer></v-spacer>
                <div class="d-flex float-right align-center" style="width: 100%;">
                  <v-text-field
                    v-model="item.messageInput"
                    solo
                    clearable
                    label="Message"
                    hide-details="auto"
                    @click:clear="clearMessage"
                    class="textfield__message"
                  ></v-text-field>
                  <v-btn
                    fab
                    dark
                    small
                    color="primary"
                    class="ml-2"
                    @click="sendMessenger(item)"
                  >
                    <v-icon dark>mdi-send</v-icon>
                  </v-btn>
                </div>
          </v-card-actions>
        </v-card>
       </div>
   </div>
 </v-layout>
</template>

<style lang="scss">

#window-chat{
  height: 500px;
  position: fixed;
  right: 0;
  bottom: 1px;

  .v-card {
    height: 100%;
    width: 350px;
  }

  .v-card__actions{
    position: absolute;
    bottom: 0;
    width: 100%;
  }

  .v-card__text{
    height: 375px;
    overflow-y: scroll;
  }
}

.theme--dark.textfield__message .v-input__slot {
  background: #383838 !important;
}


.v-chip.pink {
  color: #fff;
}

</style>

<script>

// service
import CookieService from "@/services/cookie";

export default {

  data(){
    return {

      showMenu: false,
      classActive: "active",
      menuRight: "menu-right",
      btnMenuRight: "btn-menu-right",

      smooth: false,
      statusUserLeave: false,

      message: "",
    }
  },

  mounted(){
    this.subscribeSendMessenger();
  },

  computed: {
    windowMessengers: {
      get(){
        return this.$store.getters["chats/windowMessengers"];
      }
    },

    userInfo: {
      get(){
        return CookieService.get('userInfo');
      }
    }
  },

  methods: {
    loadMoreMessenger() {},

    subscribeSendMessenger(){


      this.sockets.subscribe(this.$socketEvent.USER_SEND_MESSENGER, res => {
        if (res) {
          // var windowMessenger = {
          //   ...res.sender,
          //   isVisible: true,
          //   listMessengers: [
          //     {
          //       userId: res.sender.id,
          //       message: res.message,
          //     }
          //   ] 
          // }

          this.windowMessengers.map(item => {
            item.id !== res.sender.id ? item : {
              ...item, 
              listMessengers: item.listMessengers.push({
                                  userId: item.id,
                                  message: res.message
                                })
            }
          })
        }

        this.$forceUpdate()
      });
    },


    clearMessage() {
      this.message = "";
    },

    sendMessenger(receiver){

      var data = {
        message: this.message,
      }

      this.windowMessengers.map(item => {
        item.id !== receiver.id ? item : {...item, listMessengers: item.listMessengers.push({
          userId: this.userInfo.id,
          message: this.message
        })}
      })


      this.$socket.emit(this.$socketEvent.USER_SEND_MESSENGER, data, receiver);
      this.clearMessage();
    },


    closeWindowMessenger(data){
      var index = this.windowMessengers.indexOf(data);
      this.windowMessengers.splice(index, 1)
    },

  },


}
</script>